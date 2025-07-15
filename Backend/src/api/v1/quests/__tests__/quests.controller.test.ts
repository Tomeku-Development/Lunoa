import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { Quest } from '../quests.model';
import { createQuest, verifyQuestCompletion } from '../quests.controller';
import pool from '../../../../config/database';
import AptosService from '../../blockchain/aptos.service';
import { protect } from '../../../../middleware/auth.middleware';

// --- Mock Dependencies ---
jest.mock('../../../../config/database');
jest.mock('../../blockchain/aptos.service', () => ({
  distributeQuestRewards: jest.fn().mockResolvedValue('fake_transaction_hash'),
}));
jest.mock('../../../../middleware/auth.middleware');

// --- End Mock Dependencies ---

const mockedPool = pool as jest.Mocked<typeof pool>;
const mockedProtect = protect as jest.Mock;
mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
  // Default mock for the verifier (quest creator)
  req.user = { userId: '1' };
  next();
});
const mockedAptosService = AptosService as jest.Mocked<typeof AptosService>;

const app = express();
app.use(express.json());



app.use((req: Request, res: Response, next: NextFunction) => {
  // This mock simulates the default behavior of the auth middleware
  // It can be overridden in specific tests. By default, just call next().
  // The actual user injection will be handled inside each test.
  next();
});

import apiV1 from '../..'; // Import the main v1 router

app.use('/api/v1', apiV1); // Mount the entire v1 API

describe('Quests Controller - POST /quests/:id/verify', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedProtect.mockClear();
  });

  it('should successfully verify quest, award achievement, and distribute rewards', async () => {
    const questId = '101';
    const participantId = '202';
    const verifierId = '1';
    const aptosAddress = '0x' + 'a'.repeat(64);

    const mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (mockedPool.connect as jest.Mock).mockResolvedValue(mockClient);

    // Mock the sequence of queries within the transaction
    mockClient.query
      // 1. BEGIN
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      // 2. Fetch quest to verify creator
      .mockResolvedValueOnce({ rows: [{ creator_id: verifierId, reward_amount: '500000' }], rowCount: 1 })
      // 3. Fetch participant to verify status
      .mockResolvedValueOnce({ rows: [{ status: 'submitted' }], rowCount: 1 })
      // 4. UPDATE quest_participants status
      .mockResolvedValueOnce({ rowCount: 1 })
      // 5. INSERT into user_activities (verification)
      .mockResolvedValueOnce({ rowCount: 1 })
      // 6. COUNT verified quests for achievement check
      .mockResolvedValueOnce({ rows: [{ count: '1' }], rowCount: 1 })
      // 7. Check if 'First Quest Completed' achievement exists
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // Does not exist, so will be awarded
      // 8. INSERT into user_achievements
      .mockResolvedValueOnce({ rowCount: 1 })
      // 9. INSERT into user_activities (achievement)
      .mockResolvedValueOnce({ rowCount: 1 })
      // 10. COMMIT
      .mockResolvedValueOnce({ rows: [], rowCount: 0 });

    // Mock the separate query for the user's Aptos address (happens after COMMIT)
    (mockedPool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ aptos_address: aptosAddress }], rowCount: 1 });

    const response = await request(app)
      .post(`/api/v1/quests/${questId}/verify`)
      .send({ participantId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Quest completion verified successfully.');

    // Verify transaction was committed
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');

    // Verify reward distribution was called
    const expectedReward = 500000; // The amount from the mocked quest data, parsed to a number
    expect(AptosService.distributeQuestRewards).toHaveBeenCalledWith(aptosAddress, expectedReward);
  });

  it('should return 403 Forbidden if the verifier is not the quest creator', async () => {
    // Set the middleware to mock a user who is NOT the creator
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: '999' }; // This verifier is not the creator
      next();
    });

    const questId = '101';
    const participantId = '202';

    const mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (mockedPool.connect as jest.Mock).mockResolvedValue(mockClient);

    // Mock the transaction flow
    mockClient.query
      // 1. BEGIN
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      // 2. Fetch quest to find the actual creator is '1'
      .mockResolvedValueOnce({ rows: [{ creator_id: '1', reward_amount: '500000' }], rowCount: 1 });

    const response = await request(app)
      .post(`/api/v1/quests/${questId}/verify`)
      .send({ participantId });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden: Only the quest creator can verify completion.');
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(AptosService.distributeQuestRewards).not.toHaveBeenCalled();
  });

  it('should return 400 Bad Request if participant status is not submitted', async () => {
    // Set middleware to mock the correct creator
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: '1' };
      next();
    });

    const questId = '101';
    const participantId = '202';

    const mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (mockedPool.connect as jest.Mock).mockResolvedValue(mockClient);

    mockClient.query
      // 1. BEGIN
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      // 2. Fetch quest
      .mockResolvedValueOnce({ rows: [{ creator_id: '1', reward_amount: '500000' }], rowCount: 1 })
      // 3. Fetch participant with 'verified' status, which is not allowed
      .mockResolvedValueOnce({ rows: [{ status: 'verified' }], rowCount: 1 });

    const response = await request(app)
      .post(`/api/v1/quests/${questId}/verify`)
      .send({ participantId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Cannot verify completion for a participant with status: verified');
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(AptosService.distributeQuestRewards).not.toHaveBeenCalled();
  });

  it('should succeed but not distribute rewards if user has no aptos_address', async () => {
    // Set middleware to mock the correct creator
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: '1' };
      next();
    });

    const questId = '101';
    const participantId = '202';

    const mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (mockedPool.connect as jest.Mock).mockResolvedValue(mockClient);

    // Mock the full, successful transaction flow
    mockClient.query
      // 1. BEGIN
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      // 2. Fetch quest
      .mockResolvedValueOnce({ rows: [{ creator_id: '1', reward_amount: '500000' }], rowCount: 1 })
      // 3. Fetch participant
      .mockResolvedValueOnce({ rows: [{ status: 'submitted' }], rowCount: 1 })
      // 4. Update participant status
      .mockResolvedValueOnce({ rowCount: 1 })
      // 5. Log activity
      .mockResolvedValueOnce({ rowCount: 1 })
      // 6. Check for achievements
      .mockResolvedValueOnce({ rows: [{ count: '5' }], rowCount: 1 }) // Not first quest, no achievement
      // 7. COMMIT
      .mockResolvedValueOnce({ rows: [], rowCount: 0 });

    // Mock the post-transaction query to find no aptos_address
    (mockedPool.query as jest.Mock).mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const response = await request(app)
      .post(`/api/v1/quests/${questId}/verify`)
      .send({ participantId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Quest completion verified successfully.');
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    expect(AptosService.distributeQuestRewards).not.toHaveBeenCalled();
  });
});

describe('Quests Controller - POST /quests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Provide a default mock implementation for the protect middleware
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      // This default mock simulates an unauthenticated user.
      // Tests that require an authenticated user will override this implementation.
      next();
    });
  });

  it('should create a new quest successfully', async () => {
    const mockUserId = '1';
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: mockUserId };
      next();
    });

    // Mock Date.now() to make the timestamps deterministic
    const MOCK_NOW = 1735689600000; // Corresponds to 2025-01-01T00:00:00.000Z
    const mockDateNow = jest.spyOn(Date, 'now').mockImplementation(() => MOCK_NOW);



    const expectedExpiresAtDate = new Date(MOCK_NOW + 86400000);
    const expectedExpiresAtString = expectedExpiresAtDate.toISOString();
    const expectedCreatedAtString = new Date(MOCK_NOW).toISOString();

    const newQuestData = {
      title: 'Test Quest',
      description: 'A quest for testing',
      reward: 100,
      currency: 'Lunoa' as const,
      type: 'social' as const,
      expires_at: expectedExpiresAtString, // Sent as a string
    };

    const mockDbResponse = {
      id: '101',
      creator_id: mockUserId,
      title: newQuestData.title,
      description: newQuestData.description,
      reward: String(newQuestData.reward),
      currency: newQuestData.currency,
      type: newQuestData.type,
      expires_at: expectedExpiresAtString,
      status: 'active',
      created_at: expectedCreatedAtString,
    };

    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockDbResponse] });

    const response = await request(app)
      .post('/api/v1/quests')
      .send(newQuestData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockDbResponse);

    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      [
        newQuestData.title,
        newQuestData.description,
        mockUserId,
        newQuestData.reward,
        newQuestData.currency,
        newQuestData.type,
        expectedExpiresAtDate, // Assert that a Date object is passed
      ]
    );

    // Restore the original Date.now()
    mockDateNow.mockRestore();
  });

  it('should return 400 for invalid quest data', async () => {
    const mockUserId = '1';
    mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      req.user = { userId: mockUserId };
      next();
    });

    const invalidQuestData = {
      title: 'Test Quest',
      description: 'This is a valid description.',
      // reward is missing
      currency: 'Lunoa' as const,
      type: 'social' as const,
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    };

    const response = await request(app)
      .post('/api/v1/quests')
      .send(invalidQuestData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"reward" is required');
  });

  describe('POST /quests/:id/join', () => {
    const mockQuestId = '101';
    const mockCreatorId = '1';
    const mockParticipantId = '2';

    it('should allow an authenticated user to join a quest', async () => {
      mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.user = { userId: mockParticipantId };
        next();
      });

      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ creator_id: mockCreatorId }] }) // Quest lookup
        .mockResolvedValueOnce({ rows: [] }); // Insert participant

      const response = await request(app).post(`/api/v1/quests/${mockQuestId}/join`).send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully joined quest');
      expect(pool.query).toHaveBeenCalledWith('INSERT INTO quest_participants (quest_id, user_id) VALUES ($1, $2)', [mockQuestId, mockParticipantId]);
    });

    it('should return 401 if user is not authenticated', async () => {
      // Using default unauthenticated mock
      const response = await request(app).post(`/api/v1/quests/${mockQuestId}/join`).send();
      expect(response.status).toBe(401);
    });

    it('should return 404 if quest does not exist', async () => {
      mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.user = { userId: mockParticipantId };
        next();
      });

      (pool.query as jest.Mock).mockResolvedValue({ rows: [] }); // Quest not found

      const response = await request(app).post(`/api/v1/quests/${mockQuestId}/join`).send();
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Quest not found.');
    });

    it('should return 400 if the creator tries to join their own quest', async () => {
      mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.user = { userId: mockCreatorId }; // User is the creator
        next();
      });

      (pool.query as jest.Mock).mockResolvedValue({ rows: [{ creator_id: mockCreatorId }] });

      const response = await request(app).post(`/api/v1/quests/${mockQuestId}/join`).send();
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('You cannot join your own quest.');
    });

    it('should return 409 if the user has already joined the quest', async () => {
      mockedProtect.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        req.user = { userId: mockParticipantId };
        next();
      });

      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ creator_id: mockCreatorId }] })
        .mockRejectedValueOnce({ code: '23505' }); // Simulate unique constraint violation

      const response = await request(app).post(`/api/v1/quests/${mockQuestId}/join`).send();
      expect(response.status).toBe(409);
      expect(response.body.message).toBe('You have already joined this quest.');
    });
  });

  it('should return 401 if user is not authenticated', async () => {
    // Using the default unauthenticated mock for protect middleware.
    // We send a valid body to ensure the request passes validation and is stopped by the auth middleware.
    const validQuestData = {
      title: 'Unauthorized Quest',
      description: 'This should not be created',
      reward: 50,
      currency: 'Lunoa' as const,
      type: 'social' as const,
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    };
    const response = await request(app).post('/api/v1/quests').send(validQuestData);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not authorized to create a quest.');
  });
});
