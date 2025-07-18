import { getPool } from '../config/database';
import logger from '../config/logger';
import { AptosService } from './aptos.service';

export interface Quest {
  id: string; // Assuming UUID
  group_id: number;
  creator_id: string;
  title: string;
  description: string;
  status: string;
  reward_amount: number;
  reward_type: string;
  created_at: Date;
  expires_at?: Date;
}

export interface CreateQuestPayload {
  groupId: number;
  creatorId: string;
  title: string;
  description: string;
  reward: number;
  currency: string;
  type: string;
  expires_at?: Date;
}

/**
 * Creates a new quest in a group.
 * @param payload The quest creation data.
 * @returns The newly created quest.
 */
export interface GetAllQuestsFilters {
  type?: string;
  status?: string;
  creator_id?: string;
}

/**
 * Retrieves all quests for a given group, with optional filtering.
 * @param groupId The ID of the group.
 * @param filters Optional filters for the quests.
 * @returns A list of quests.
 */
/**
 * Retrieves a single quest by its ID, ensuring it belongs to the specified group.
 * @param questId The ID of the quest.
 * @param groupId The ID of the group.
 * @returns The quest object, or null if not found.
 */
export interface UpdateQuestPayload {
  title?: string;
  description?: string;
  reward?: number;
  currency?: string;
  type?: string;
  status?: 'active' | 'inactive' | 'completed';
  expires_at?: Date;
}

/**
 * Updates a quest, verifying ownership.
 * @param questId The ID of the quest to update.
 * @param groupId The ID of the group the quest belongs to.
 * @param userId The ID of the user attempting the update.
 * @param payload The data to update.
 * @returns The updated quest, or null if not found or not authorized.
 */
/**
 * Deletes a quest, verifying ownership.
 * @param questId The ID of the quest to delete.
 * @param groupId The ID of the group the quest belongs to.
 * @param userId The ID of the user attempting the deletion.
 * @returns A boolean indicating success, or null if not found.
 */
/**
 * Allows a user to join a quest.
 * @param questId The ID of the quest to join.
 * @param groupId The ID of the group the quest belongs to.
 * @param userId The ID of the user joining the quest.
 * @returns The new participant record, or throws an error if unable to join.
 */
/**
 * Marks a quest as completed by a participant.
 * @param questId The ID of the quest.
 * @param groupId The ID of the group.
 * @param userId The ID of the user completing the quest.
 * @returns The updated participant record.
 */
/**
 * Verifies a quest's completion, updates statuses, and distributes rewards.
 * @param questId The ID of the quest.
 * @param groupId The ID of the group.
 * @param participantId The user who completed the quest.
 * @param verifierId The user verifying the quest (usually the creator).
 * @returns A success object with the transaction result.
 */
export const verifyQuestCompletion = async (questId: string, groupId: number, participantId: string, verifierId: string) => {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');

    const questResult = await client.query('SELECT creator_id, reward_amount FROM quests WHERE id = $1 AND group_id = $2', [questId, groupId]);
    if (questResult.rows.length === 0) {
      throw new Error('QUEST_NOT_FOUND');
    }

    const { creator_id: questCreatorId, reward_amount } = questResult.rows[0];
    const rewardAmount = parseInt(reward_amount, 10);

    if (questCreatorId !== verifierId) {
      throw new Error('FORBIDDEN');
    }

    const participantResult = await client.query('SELECT status FROM quest_participants WHERE quest_id = $1 AND user_id = $2 FOR UPDATE', [questId, participantId]);
    if (participantResult.rows.length === 0) {
      throw new Error('PARTICIPANT_NOT_FOUND');
    }

    const { status } = participantResult.rows[0];
    if (status !== 'submitted') {
      throw new Error('INVALID_STATUS');
    }

    await client.query("UPDATE quest_participants SET status = 'verified' WHERE quest_id = $1 AND user_id = $2", [questId, participantId]);

    // Log activity and check for achievements
    const activityMetadata = { questId, participantId, verifierId };
    await client.query("INSERT INTO user_activities (user_id, activity_type, metadata) VALUES ($1, 'quest_verified', $2)", [participantId, activityMetadata]);

    const verifiedQuestsResult = await client.query("SELECT COUNT(*) FROM quest_participants WHERE user_id = $1 AND status = 'verified'", [participantId]);
    const verifiedQuestsCount = parseInt(verifiedQuestsResult.rows[0].count, 10);

    if (verifiedQuestsCount === 1) {
      const achievementId = 1; // 'First Quest Completed'
      await client.query('INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [participantId, achievementId]);
    }

    await client.query('COMMIT');

    // Trigger reward distribution post-transaction
    try {
      const userResult = await getPool().query('SELECT aptos_address FROM users WHERE id = $1', [participantId]);
      const participantAddress = userResult.rows[0]?.aptos_address;
      if (participantAddress && rewardAmount > 0) {
        logger.info(`Distributing ${rewardAmount} reward to ${participantAddress} for quest ${questId}`);
        await AptosService.distributeQuestRewards(participantAddress, rewardAmount);
      } else {
        logger.warn(`User ${participantId} has no Aptos address or reward is 0. Skipping reward distribution.`);
      }
    } catch (rewardError) {
      logger.error(`Post-commit reward distribution failed for quest ${questId} to user ${participantId}:`, rewardError);
      // Do not re-throw; the main transaction was successful.
    }

    return { success: true, message: 'Quest verified and rewards initiated.' };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error; // Re-throw original error to be handled by the controller
  } finally {
    client.release();
  }
};

export const completeQuest = async (questId: string, groupId: number, userId: string) => {
  const pool = getPool();

  // Check if the user is a participant and the quest belongs to the group
  const participantQuery = `
    SELECT qp.status
    FROM quest_participants qp
    JOIN quests q ON qp.quest_id = q.id
    WHERE qp.quest_id = $1 AND qp.user_id = $2 AND q.group_id = $3
  `;
  const participantResult = await pool.query(participantQuery, [questId, userId, groupId]);

  if (participantResult.rows.length === 0) {
    throw new Error('NOT_A_PARTICIPANT');
  }

  const { status } = participantResult.rows[0];

  if (status === 'submitted' || status === 'verified') {
    throw new Error('ALREADY_SUBMITTED');
  }

  const { rows } = await pool.query(
    'UPDATE quest_participants SET status = $1, updated_at = NOW() WHERE quest_id = $2 AND user_id = $3 RETURNING *',
    ['submitted', questId, userId]
  );

  return rows[0];
};

export const joinQuest = async (questId: string, groupId: number, userId: string) => {
  const pool = getPool();

  // Check if the quest exists and if the user is the creator
  const questResult = await pool.query('SELECT creator_id FROM quests WHERE id = $1 AND group_id = $2', [questId, groupId]);
  if (questResult.rows.length === 0) {
    throw new Error('NOT_FOUND');
  }
  if (questResult.rows[0].creator_id === userId) {
    throw new Error('CANNOT_JOIN_OWN_QUEST');
  }

  // Attempt to add the user to the quest participants
  const insertQuery = `
    INSERT INTO quest_participants (quest_id, user_id, status)
    VALUES ($1, $2, 'joined')
    ON CONFLICT (quest_id, user_id) DO NOTHING
    RETURNING *;
  `;

  try {
    const { rows } = await pool.query(insertQuery, [questId, userId]);
    if (rows.length === 0) {
      throw new Error('ALREADY_JOINED');
    }
    return rows[0];
  } catch (error: any) {
    // Re-throw specific errors or a generic one
    if (error.message.includes('quest_participants_quest_id_fkey')) {
        throw new Error('NOT_FOUND');
    }
    throw error;
  }
};

export const deleteQuest = async (questId: string, groupId: number, userId: string): Promise<boolean | null> => {
  // First, verify the user is the creator of the quest
  const questCheck = await getPool().query('SELECT creator_id FROM quests WHERE id = $1 AND group_id = $2', [questId, groupId]);
  if (questCheck.rows.length === 0) {
    return null; // Quest not found
  }
  if (questCheck.rows[0].creator_id !== userId) {
    throw new Error('FORBIDDEN'); // User is not the creator
  }

  const query = 'DELETE FROM quests WHERE id = $1';

  try {
    const pool = getPool();
    const result = await pool.query(query, [questId]);
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    logger.error(`Error deleting quest ${questId}:`, error);
    throw new Error('Failed to delete quest.');
  }
};

export const updateQuest = async (questId: string, groupId: number, userId: string, payload: UpdateQuestPayload): Promise<Quest | null> => {
  // First, verify the user is the creator of the quest
  const questCheck = await getPool().query('SELECT creator_id FROM quests WHERE id = $1 AND group_id = $2', [questId, groupId]);
  if (questCheck.rows.length === 0) {
    return null; // Quest not found
  }
  if (questCheck.rows[0].creator_id !== userId) {
    throw new Error('FORBIDDEN'); // User is not the creator
  }

  const fields = Object.keys(payload) as (keyof UpdateQuestPayload)[];
  const values = Object.values(payload);

  const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');
  const query = `UPDATE quests SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;

  try {
    const pool = getPool();
    const { rows } = await pool.query(query, [...values, questId]);
    return rows[0];
  } catch (error) {
    logger.error(`Error updating quest ${questId}:`, error);
    throw new Error('Failed to update quest.');
  }
};

export const getQuestById = async (questId: string, groupId: number): Promise<Quest | null> => {
  const query = 'SELECT * FROM quests WHERE id = $1 AND group_id = $2';

  try {
    const pool = getPool();
    const { rows } = await pool.query(query, [questId, groupId]);

    if (rows.length === 0) {
      logger.warn(`Quest with ID ${questId} not found in group ${groupId}.`);
      return null;
    }

    return rows[0];
  } catch (error) {
    logger.error(`Error fetching quest ${questId} from group ${groupId}:`, error);
    throw new Error('Failed to fetch quest.');
  }
};

export const getAllQuests = async (groupId: number, filters: GetAllQuestsFilters): Promise<Quest[]> => {
  const { type, status, creator_id } = filters;

  let query = 'SELECT * FROM quests WHERE group_id = $1';
  const values: any[] = [groupId];
  const conditions: string[] = [];
  let paramIndex = 2; // Starts at 2 because $1 is group_id

  if (type) {
    conditions.push(`type = $${paramIndex++}`);
    values.push(type);
  }

  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    values.push(status);
  }

  if (creator_id) {
    conditions.push(`creator_id = $${paramIndex++}`);
    values.push(creator_id);
  }

  if (conditions.length > 0) {
    query += ' AND ' + conditions.join(' AND ');
  }

  try {
    const pool = getPool();
    const { rows } = await pool.query(query, values);
    logger.info(`Fetched ${rows.length} quests for group ${groupId}.`);
    return rows;
  } catch (error) {
    logger.error(`Error fetching quests for group ${groupId}:`, error);
    throw new Error('Failed to fetch quests.');
  }
};

export const createQuest = async (payload: CreateQuestPayload): Promise<Quest> => {
  const { groupId, creatorId, title, description, reward, currency, type, expires_at } = payload;

  const query = `
    INSERT INTO quests (group_id, creator_id, title, description, reward, currency, type, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  try {
    const pool = getPool();
    const { rows } = await pool.query(query, [groupId, creatorId, title, description, reward, currency, type, expires_at]);
    logger.info(`Quest "${title}" created successfully in group ${groupId}.`);
    return rows[0];
  } catch (error) {
    logger.error(`Error creating quest in group ${groupId}:`, error);
    throw new Error('Failed to create quest.');
  }
};
