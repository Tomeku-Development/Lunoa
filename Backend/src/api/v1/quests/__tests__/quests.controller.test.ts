import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { verifyQuestCompletion } from '../quests.controller';
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

app.post('/quests/:id/verify', (req, res, next) => mockedProtect(req, res, next), verifyQuestCompletion);

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
      .mockResolvedValueOnce({ rows: [{ creator_id: verifierId, reward_amount: 500000 }], rowCount: 1 })
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
      .post(`/quests/${questId}/verify`)
      .send({ participantId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Quest completion verified successfully.');

    // Verify transaction was committed
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');

    // Verify reward distribution was called
    const expectedReward = 500000; // The amount from the mocked quest data
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
      .mockResolvedValueOnce({ rows: [{ creator_id: '1', reward_amount: 500000 }], rowCount: 1 });

    const response = await request(app)
      .post(`/quests/${questId}/verify`)
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
      .mockResolvedValueOnce({ rows: [{ creator_id: '1', reward_amount: 500000 }], rowCount: 1 })
      // 3. Fetch participant with 'verified' status, which is not allowed
      .mockResolvedValueOnce({ rows: [{ status: 'verified' }], rowCount: 1 });

    const response = await request(app)
      .post(`/quests/${questId}/verify`)
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
      .mockResolvedValueOnce({ rows: [{ creator_id: '1', reward_amount: 500000 }], rowCount: 1 })
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
      .post(`/quests/${questId}/verify`)
      .send({ participantId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Quest completion verified successfully.');
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    expect(AptosService.distributeQuestRewards).not.toHaveBeenCalled();
  });
});
