import { getPool } from '../../config/database';
import { AptosService } from '../aptos.service';
import * as questsService from '../quests.service';

// Mock dependencies
jest.mock('../../db/db', () => ({
  getPool: jest.fn(),
}));

jest.mock('../aptos.service', () => ({
  AptosService: {
    distributeQuestRewards: jest.fn(),
  },
}));

const mockQuery = jest.fn();
const mockConnect = jest.fn(() => ({
  query: mockQuery,
  release: jest.fn(),
}));

(getPool as jest.Mock).mockReturnValue({ query: mockQuery, connect: mockConnect });


describe('Quests Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createQuest', () => {
    it('should create and return a new quest', async () => {
      const payload = {
        title: 'Test Quest',
        description: 'Test Desc',
        groupId: 1,
        creatorId: 'user1',
        reward: 100,
        currency: 'VIBE',
        type: 'social',
        // Add other required fields if necessary
      };
      const expectedQuest = { id: 'quest1', ...payload };
      mockQuery.mockResolvedValue({ rows: [expectedQuest], rowCount: 1 });

      const result = await questsService.createQuest(payload);
      expect(result).toEqual(expectedQuest);
            const queryArgs = [payload.title, payload.description, payload.groupId, payload.creatorId, payload.reward, payload.currency, payload.type];
      expect(mockQuery).toHaveBeenCalledWith(expect.any(String), queryArgs);
    });
  });

  describe('getQuestById', () => {
    it('should return a quest if found', async () => {
      const quest = { id: 'quest1', title: 'Test' };
      mockQuery.mockResolvedValue({ rows: [quest], rowCount: 1 });

      const result = await questsService.getQuestById('quest1', 1);
      expect(result).toEqual(quest);
      expect(mockQuery).toHaveBeenCalledWith(expect.any(String), ['quest1', 1]);
    });

    it('should return null if quest not found', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
      const result = await questsService.getQuestById('quest1', 1);
      expect(result).toBeNull();
    });
  });

  describe('deleteQuest', () => {
    it('should return true if quest is deleted by creator', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ creator_id: 'user1' }], rowCount: 1 }); // Verification
      mockQuery.mockResolvedValueOnce({ rowCount: 1 }); // Deletion

      const result = await questsService.deleteQuest('quest1', 1, 'user1');
      expect(result).toBe(true);
    });

    it('should throw FORBIDDEN error if not deleted by creator', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ creator_id: 'user2' }], rowCount: 1 });
      await expect(questsService.deleteQuest('quest1', 1, 'user1')).rejects.toThrow('FORBIDDEN');
    });

    it('should return null if quest to delete is not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });
      const result = await questsService.deleteQuest('quest1', 1, 'user1');
      expect(result).toBeNull();
    });
  });

  describe('joinQuest', () => {
    it('should allow a user to join a quest', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ creator_id: 'user2' }], rowCount: 1 }); // Quest check
      mockQuery.mockResolvedValueOnce({ rows: [{ quest_id: 'quest1', user_id: 'user1' }], rowCount: 1 }); // Insert

      const result = await questsService.joinQuest('quest1', 1, 'user1');
      expect(result).toBeDefined();
    });

    it('should throw CANNOT_JOIN_OWN_QUEST error if user is the creator', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ creator_id: 'user1' }], rowCount: 1 });
      await expect(questsService.joinQuest('quest1', 1, 'user1')).rejects.toThrow('CANNOT_JOIN_OWN_QUEST');
    });

    it('should throw ALREADY_JOINED error if user has already joined', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ creator_id: 'user2' }], rowCount: 1 });
        mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 }); // ON CONFLICT DO NOTHING returns 0 rows
        await expect(questsService.joinQuest('quest1', 1, 'user1')).rejects.toThrow('ALREADY_JOINED');
    });
  });

  describe('verifyQuestCompletion', () => {
    beforeEach(() => {
        // Setup the mock for a transaction
        (getPool as jest.Mock).mockReturnValue({ connect: mockConnect });
    });

    it('should verify a quest and distribute rewards', async () => {
        mockQuery
            .mockResolvedValueOnce({ rows: [{ creator_id: 'verifier1', reward_amount: '100' }] }) // Quest check
            .mockResolvedValueOnce({ rows: [{ status: 'submitted' }] }) // Participant check
            .mockResolvedValueOnce({ rowCount: 1 }) // Update participant
            .mockResolvedValueOnce({ rowCount: 1 }) // Insert activity
            .mockResolvedValueOnce({ rows: [{ count: '1' }] }) // Check verified count
            .mockResolvedValueOnce({ rowCount: 1 }) // Insert achievement
            .mockResolvedValueOnce({ rows: [{ aptos_address: '0x123' }] }); // Get user for reward

        const result = await questsService.verifyQuestCompletion('quest1', 1, 'participant1', 'verifier1');

        expect(result.success).toBe(true);
        expect(AptosService.distributeQuestRewards).toHaveBeenCalledWith('0x123', 100);
        expect(mockQuery).toHaveBeenCalledWith('COMMIT');
    });

    it('should throw FORBIDDEN if verifier is not the creator', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ creator_id: 'anotherUser', reward_amount: '100' }] });

        await expect(questsService.verifyQuestCompletion('quest1', 1, 'participant1', 'verifier1')).rejects.toThrow('FORBIDDEN');
        expect(mockQuery).toHaveBeenCalledWith('ROLLBACK');
    });
  });
});
