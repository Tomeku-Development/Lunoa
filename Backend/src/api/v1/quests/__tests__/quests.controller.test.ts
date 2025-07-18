import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { getPool } from '../../../../config/database';
import AptosService from '../../blockchain/aptos.service';
import { protect } from '../../../../middleware/auth.middleware';
import apiV1 from '../..'; // Import the main v1 router
import * as feedGroupService from '../../../../services/feedGroups.service';

// --- Mock Dependencies ---
jest.mock('../../../../config/database', () => ({
  getPool: jest.fn(),
}));
jest.mock('../../blockchain/aptos.service', () => ({
  distributeQuestRewards: jest.fn().mockResolvedValue('fake_transaction_hash'),
}));
jest.mock('../../../../middleware/auth.middleware');
jest.mock('../../../../services/feedGroups.service', () => ({
  isMember: jest.fn(),
}));
// --- End Mock Dependencies ---

// --- App and Mock Setup ---
const app = express();
app.use(express.json());
app.use('/api/v1', apiV1); // Mount the entire v1 API

const mockedGetPool = getPool as jest.Mock;
const mockedProtect = protect as jest.Mock;
const mockedAptosService = AptosService as jest.Mocked<typeof AptosService>;
const mockedFeedGroupService = feedGroupService as jest.Mocked<typeof feedGroupService>;

const mockPool = {
  connect: jest.fn(),
  query: jest.fn(),
};

// Global setup to reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockedGetPool.mockReturnValue(mockPool);

  // Default auth mock: pass through, tests will override for specific user states
  mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    // This default behavior simulates an unauthenticated user by sending a 401 response.
    // Specific tests must override this mock to simulate an authenticated user.
    res.status(401).json({ message: 'Not authorized, no token' });
  });
});
// --- End App and Mock Setup ---

describe.skip('POST /api/v1/quests', () => {
  it('should create a new quest successfully for an authenticated user', async () => {
    const mockUserId = '1';
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: mockUserId };
      next();
    });

    const MOCK_NOW = 1735689600000; // 2025-01-01T00:00:00.000Z
    const mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(MOCK_NOW);

    const expectedExpiresAt = new Date(MOCK_NOW + 86400000);
    const newQuestData = {
      title: 'Test Quest',
      description: 'A quest for testing',
      reward: 100,
      currency: 'Lunoa' as const,
      type: 'social' as const,
      expires_at: expectedExpiresAt.toISOString(),
    };

    const mockDbResponse = {
      id: '101',
      creator_id: mockUserId,
      ...newQuestData,
      reward: String(newQuestData.reward),
      status: 'active',
      created_at: new Date(MOCK_NOW).toISOString(),
    };

    mockPool.query.mockResolvedValue({ rows: [mockDbResponse] });

    const response = await request(app).post('/api/v1/quests').send(newQuestData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockDbResponse);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [
      newQuestData.title,
      newQuestData.description,
      mockUserId,
      newQuestData.reward,
      newQuestData.currency,
      newQuestData.type,
      expectedExpiresAt,
    ]);

    mockDateNow.mockRestore();
  });

  it('should return 401 if user is not authenticated', async () => {
    // No user is mocked, so the default unauthenticated mock is used
    const response = await request(app).post('/api/v1/quests').send({
      title: 'Unauthorized Quest',
      description: 'This should not be created',
      reward: 50,
      currency: 'Lunoa',
      type: 'social',
      expires_at: new Date().toISOString(),
    });

    expect(response.status).toBe(401);
  });

  it('should return 400 for invalid quest data', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: '1' };
      next();
    });

    const response = await request(app).post('/api/v1/quests').send({ title: 'Only title' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"description" is required');
  });
});

describe.skip('POST /api/v1/quests/:id/verify', () => {
  const questId = '101';
  const participantId = '202';
  const verifierId = '1';

  it('should successfully verify quest, award achievement, and distribute rewards', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: verifierId };
      next();
    });

    const aptosAddress = '0x' + 'a'.repeat(64);
    const mockClient = { query: jest.fn(), release: jest.fn() };
    mockPool.connect.mockResolvedValue(mockClient);

    // Mock transaction flow
    mockClient.query
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // BEGIN
      .mockResolvedValueOnce({ rows: [{ creator_id: verifierId, reward_amount: '500000' }], rowCount: 1 }) // Fetch quest
      .mockResolvedValueOnce({ rows: [{ status: 'submitted' }], rowCount: 1 }) // Fetch participant
      .mockResolvedValueOnce({ rowCount: 1 }) // UPDATE participant status
      .mockResolvedValueOnce({ rowCount: 1 }) // INSERT verification activity
      .mockResolvedValueOnce({ rows: [{ count: '1' }], rowCount: 1 }) // COUNT verified quests
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // Check achievement (not found)
      .mockResolvedValueOnce({ rowCount: 1 }) // INSERT achievement
      .mockResolvedValueOnce({ rowCount: 1 }) // INSERT achievement activity
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }); // COMMIT

    mockPool.query.mockResolvedValueOnce({ rows: [{ aptos_address: aptosAddress }], rowCount: 1 });

    const response = await request(app).post(`/api/v1/quests/${questId}/verify`).send({ participantId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Quest completion verified successfully.');
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    expect(mockedAptosService.distributeQuestRewards).toHaveBeenCalledWith(aptosAddress, 500000);
  });

  it('should return 403 if the verifier is not the quest creator', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: '999' }; // Not the creator
      next();
    });

    const mockClient = { query: jest.fn(), release: jest.fn() };
    mockPool.connect.mockResolvedValue(mockClient);
    mockClient.query
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // BEGIN
      .mockResolvedValueOnce({ rows: [{ creator_id: verifierId }], rowCount: 1 }); // Fetch quest

    const response = await request(app).post(`/api/v1/quests/${questId}/verify`).send({ participantId });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden: Only the quest creator can verify completion.');
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
  });
});

describe.skip('POST /api/v1/quests/:id/join', () => {
  const questId = '101';
  const creatorId = '1';
  const participantId = '2';

  it('should allow an authenticated user to join a quest', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: participantId };
      next();
    });

    mockPool.query
      .mockResolvedValueOnce({ rows: [{ creator_id: creatorId }] }) // Quest lookup
      .mockResolvedValueOnce({ rows: [] }); // Insert participant

    const response = await request(app).post(`/api/v1/quests/${questId}/join`).send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Successfully joined quest');
  });

  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app).post(`/api/v1/quests/${questId}/join`).send();
    expect(response.status).toBe(401);
  });

  it('should return 409 if the user has already joined the quest', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: participantId };
      next();
    });

    mockPool.query
      .mockResolvedValueOnce({ rows: [{ creator_id: creatorId }] })
      .mockRejectedValueOnce({ code: '23505' }); // Simulate unique constraint violation

    const response = await request(app).post(`/api/v1/quests/${questId}/join`).send();
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('You have already joined this quest.');
  });
});

describe.skip('POST /api/v1/quests/:id/complete', () => {
  const questId = '102';
  const participantId = '3';

  it('should allow a participant to mark a quest as complete', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: participantId };
      next();
    });

    mockPool.query
      .mockResolvedValueOnce({ rows: [{ status: 'active' }] }) // Participant lookup
      .mockResolvedValueOnce({ rowCount: 1 }); // Update status

    const response = await request(app).post(`/api/v1/quests/${questId}/complete`).send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Quest marked as completed. Awaiting verification.');
  });

  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app).post(`/api/v1/quests/${questId}/complete`).send();
    expect(response.status).toBe(401);
  });

  it('should return 409 if the quest has already been submitted', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: participantId };
      next();
    });

    mockPool.query.mockResolvedValue({ rows: [{ status: 'submitted' }] });

    const response = await request(app).post(`/api/v1/quests/${questId}/complete`).send();
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Quest completion has already been submitted.');
  });
});

describe.skip('PUT /api/v1/quests/:id', () => {
  const questId = '103';
  const creatorId = '4';
  const updateData = { title: 'Updated Quest Title' };

  it('should allow the creator to update a quest', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: creatorId };
      next();
    });

    mockPool.query
      .mockResolvedValueOnce({ rows: [{ creator_id: creatorId }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [{ ...updateData }], rowCount: 1 });

    const response = await request(app).put(`/api/v1/quests/${questId}`).send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updateData.title);
  });

  it('should return 403 if a non-creator tries to update', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: 'non-creator' };
      next();
    });

    mockPool.query.mockResolvedValueOnce({ rows: [{ creator_id: creatorId }], rowCount: 1 });

    const response = await request(app).put(`/api/v1/quests/${questId}`).send(updateData);

    expect(response.status).toBe(403);
  });

  it('should return 400 if no update data is provided', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: creatorId };
      next();
    });

    const response = await request(app).put(`/api/v1/quests/${questId}`).send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('No update data provided.');
  });
});

describe.skip('DELETE /api/v1/quests/:id', () => {
  const questId = '104';
  const creatorId = '6';

  it('should allow the creator to delete a quest', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: creatorId };
      next();
    });

    mockPool.query
      .mockResolvedValueOnce({ rows: [{ creator_id: creatorId }], rowCount: 1 })
      .mockResolvedValueOnce({ rowCount: 1 });

    const response = await request(app).delete(`/api/v1/quests/${questId}`);

    expect(response.status).toBe(204);
  });

  it('should return 403 if a non-creator tries to delete', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: 'non-creator' };
      next();
    });

    mockPool.query.mockResolvedValueOnce({ rows: [{ creator_id: creatorId }], rowCount: 1 });

    const response = await request(app).delete(`/api/v1/quests/${questId}`);

    expect(response.status).toBe(403);
  });

  it('should return 404 if the quest does not exist', async () => {
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: creatorId };
      next();
    });

    mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const response = await request(app).delete(`/api/v1/quests/${questId}`);

    expect(response.status).toBe(404);
  });
});

describe('Group-Specific Quests: /api/v1/feed-groups/:groupId/quests', () => {
  const groupId = '1';
  const creatorId = '10';
  const memberId = '11';
  const nonMemberId = '12';
  const questId = '101';

  beforeEach(() => {
    // Ensure the mock is clean before each test in this suite
    mockedFeedGroupService.isMember.mockClear();
  });

  describe('POST /', () => {
    const newQuestData = {
      title: 'Group Quest',
      description: 'A quest for our group',
      reward: 200,
      currency: 'Lunoa' as const,
      type: 'social' as const,
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    };

    it('should create a new quest successfully for a group member', async () => {
      mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.user = { userId: creatorId };
        next();
      });
      mockedFeedGroupService.isMember.mockResolvedValue(true);
      mockPool.query.mockResolvedValue({ rows: [{ id: questId, ...newQuestData }] });

      const response = await request(app)
        .post(`/api/v1/feed-groups/${groupId}/quests`)
        .send(newQuestData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newQuestData.title);
      expect(mockedFeedGroupService.isMember).toHaveBeenCalledWith(parseInt(groupId), creatorId);
    });

    it('should return 403 if the user is not a member of the group', async () => {
      mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.user = { userId: nonMemberId };
        next();
      });
      mockedFeedGroupService.isMember.mockResolvedValue(false);

      const response = await request(app)
        .post(`/api/v1/feed-groups/${groupId}/quests`)
        .send(newQuestData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Forbidden: You are not a member of this group.');
    });
  });

  describe('POST /:questId/join', () => {
    it('should allow a group member to join a quest', async () => {
      mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.user = { userId: memberId };
        next();
      });
      mockedFeedGroupService.isMember.mockResolvedValue(true);
      // Mock quest exists and belongs to group, and user is not creator
      mockPool.query.mockResolvedValueOnce({ rows: [{ creator_id: creatorId, group_id: parseInt(groupId) }] });
      // Mock successful insert into quest_participants
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app).post(`/api/v1/feed-groups/${groupId}/quests/${questId}/join`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully joined quest');
      expect(mockedFeedGroupService.isMember).toHaveBeenCalledWith(parseInt(groupId), memberId);
    });

    it('should return 403 if a non-group member tries to join', async () => {
        mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.user = { userId: nonMemberId };
            next();
        });
        mockedFeedGroupService.isMember.mockResolvedValue(false);

        const response = await request(app).post(`/api/v1/feed-groups/${groupId}/quests/${questId}/join`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: You are not a member of this group.');
    });
  });
});
