import { Request, Response } from 'express';
import { Quest, questSchema } from './quests.model';
import logger from '../../../config/logger';
import pool from '../../../config/database';
import AptosService from '../blockchain/aptos.service';

/**
 * Create a new quest.
 */
export const createQuest = async (req: Request, res: Response) => {
  const { error, value } = questSchema.validate(req.body);
  const creator_id = req.user?.userId;

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (!creator_id) {
    return res.status(401).json({ message: 'Not authorized to create a quest.' });
  }

  try {
    const { title, description, reward, currency, type, expires_at } = value;
    const query = `
      INSERT INTO quests (title, description, creator_id, reward, currency, type, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [title, description, creator_id, reward, currency, type, expires_at];

    const result = await pool.query(query, values);
    const newQuest = result.rows[0];

    logger.info('New quest created:', newQuest);
    res.status(201).json(newQuest);
  } catch (dbError) {
    logger.error('Error creating quest in database:', dbError);
    res.status(500).json({ message: 'Failed to create quest.' });
  }
};

/**
 * Get all quests, with optional filtering.
 */
export const getAllQuests = async (req: Request, res: Response) => {
  const { type, status, creator_id } = req.query;

  try {
    let query = 'SELECT * FROM quests';
    const values: any[] = [];
    const conditions: string[] = [];
    let paramIndex = 1;

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
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (dbError) {
    logger.error('Error fetching quests:', dbError);
    res.status(500).json({ message: 'Failed to fetch quests.' });
  }
};

/**
 * Get a specific quest by its ID.
 */
export const getQuestById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM quests WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (dbError) {
    logger.error(`Error fetching quest ${id}:`, dbError);
    res.status(500).json({ message: 'Failed to fetch quest.' });
  }
};

/**
 * Update a quest.
 */
export const updateQuest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUserId = req.user?.userId;

  // Use the same schema for creation, but make all fields optional for updates.
  const { error, value } = questSchema.fork(Object.keys(questSchema.describe().keys), (schema) => schema.optional()).validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (Object.keys(value).length === 0) {
    return res.status(400).json({ message: 'No update data provided.' });
  }

  try {
    // First, verify the quest exists and the user is the owner.
    const verifyResult = await pool.query('SELECT creator_id FROM quests WHERE id = $1', [id]);
    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Quest not found.' });
    }

    if (verifyResult.rows[0].creator_id !== authenticatedUserId) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own quests.' });
    }

    // Dynamically build the update query.
    const updateFields = Object.keys(value);
    const setClause = updateFields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');
    const queryValues = Object.values(value);
    queryValues.push(id);

    const query = `UPDATE quests SET ${setClause} WHERE id = $${queryValues.length} RETURNING *`;

    const result = await pool.query(query, queryValues);
    const updatedQuest = result.rows[0];

    logger.info(`Quest ${id} updated:`, updatedQuest);
    res.status(200).json(updatedQuest);
  } catch (dbError) {
    logger.error(`Error updating quest ${id}:`, dbError);
    res.status(500).json({ message: 'Failed to update quest.' });
  }
};

/**
 * Delete a quest.
 */
export const deleteQuest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUserId = req.user?.userId;

  try {
    // First, verify the quest exists and the user is the owner.
    const verifyResult = await pool.query('SELECT creator_id FROM quests WHERE id = $1', [id]);
    if (verifyResult.rows.length === 0) {
      // If the quest doesn't exist, it's already gone. Idempotent success.
      return res.status(204).send();
    }

    if (verifyResult.rows[0].creator_id !== authenticatedUserId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own quests.' });
    }

    // Delete the quest.
    await pool.query('DELETE FROM quests WHERE id = $1', [id]);

    logger.info(`Quest ${id} deleted by user ${authenticatedUserId}`);
    res.status(204).send();
  } catch (dbError) {
    logger.error(`Error deleting quest ${id}:`, dbError);
    res.status(500).json({ message: 'Failed to delete quest.' });
  }
};

/**
 * Join a quest.
 */
export const joinQuest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUserId = req.user?.userId;

  if (!authenticatedUserId) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  try {
    // Check if the quest exists and if the user is the creator
    const questResult = await pool.query('SELECT creator_id FROM quests WHERE id = $1', [id]);
    if (questResult.rows.length === 0) {
      return res.status(404).json({ message: 'Quest not found.' });
    }

    if (questResult.rows[0].creator_id === authenticatedUserId) {
      return res.status(400).json({ message: 'You cannot join your own quest.' });
    }

    // Attempt to add the user to the quest participants
    const insertQuery = 'INSERT INTO quest_participants (quest_id, user_id) VALUES ($1, $2)';
    await pool.query(insertQuery, [id, authenticatedUserId]);

    logger.info(`User ${authenticatedUserId} joined quest ${id}`);
    res.status(200).json({ message: 'Successfully joined quest' });

  } catch (dbError: any) {
    // Handle case where user has already joined (unique constraint violation)
    if (dbError.code === '23505') { // PostgreSQL unique violation error code
      return res.status(409).json({ message: 'You have already joined this quest.' });
    }
    logger.error(`Error joining quest ${id}:`, dbError);
    res.status(500).json({ message: 'Failed to join quest.' });
  }
};

/**
 * Complete a quest and claim rewards.
 */
export const completeQuest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUserId = req.user?.userId;

  const { proofOfCompletion } = req.body;

  if (!authenticatedUserId) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  if (!proofOfCompletion || typeof proofOfCompletion !== 'string') {
    return res.status(400).json({ message: 'Proof of completion is required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const participantResult = await client.query(
      'SELECT status FROM quest_participants WHERE quest_id = $1 AND user_id = $2',
      [id, authenticatedUserId]
    );

    if (participantResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'You have not joined this quest.' });
    }

    const participantStatus = participantResult.rows[0].status;
    if (participantStatus !== 'joined') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: `Cannot submit completion for a quest with status: ${participantStatus}` });
    }

    await client.query(
      "UPDATE quest_participants SET status = 'submitted', proof_of_completion = $1 WHERE quest_id = $2 AND user_id = $3",
      [proofOfCompletion, id, authenticatedUserId]
    );

    const activityMetadata = { questId: id, proof: proofOfCompletion };
    await client.query(
      "INSERT INTO user_activities (user_id, activity_type, metadata) VALUES ($1, 'quest_submitted', $2)",
      [authenticatedUserId, activityMetadata]
    );

    await client.query('COMMIT');
    logger.info(`User ${authenticatedUserId} submitted completion for quest ${id}`);
    res.status(200).json({ message: 'Quest completion submitted for verification.' });

  } catch (dbError) {
    await client.query('ROLLBACK');
    logger.error(`Error completing quest ${id} for user ${authenticatedUserId}:`, dbError);
    res.status(500).json({ message: 'Failed to submit quest completion.' });
  } finally {
    client.release();
  }
};

/**
 * Verify quest completion.
 */
export const verifyQuestCompletion = async (req: Request, res: Response) => {
  const { id: questId } = req.params;
  const verifierId = req.user?.userId;
  const { participantId } = req.body; // The user whose completion is being verified

  if (!verifierId) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  if (!participantId) {
    return res.status(400).json({ message: 'Participant ID is required for verification.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const questResult = await client.query('SELECT creator_id, reward_amount FROM quests WHERE id = $1', [questId]);
    if (questResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Quest not found.' });
    }

    const { creator_id: questCreatorId } = questResult.rows[0];
    const rewardAmount = parseInt(questResult.rows[0].reward_amount, 10);
    if (questCreatorId !== verifierId) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Forbidden: Only the quest creator can verify completion.' });
    }

    const participantResult = await client.query(
      'SELECT status FROM quest_participants WHERE quest_id = $1 AND user_id = $2',
      [questId, participantId]
    );

    if (participantResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Participant not found for this quest.' });
    }

    const participantStatus = participantResult.rows[0].status;
    if (participantStatus !== 'submitted') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: `Cannot verify completion for a participant with status: ${participantStatus}` });
    }

    await client.query(
      "UPDATE quest_participants SET status = 'verified' WHERE quest_id = $1 AND user_id = $2",
      [questId, participantId]
    );

    const activityMetadata = { questId: questId, participantId: participantId, verifierId: verifierId };
    await client.query(
      "INSERT INTO user_activities (user_id, activity_type, metadata) VALUES ($1, 'quest_verified', $2)",
      [participantId, activityMetadata]
    );

    // Check for and award 'First Quest Completed' achievement
    const verifiedQuestsResult = await client.query(
      "SELECT COUNT(*) FROM quest_participants WHERE user_id = $1 AND status = 'verified'",
      [participantId]
    );
    const verifiedQuestsCount = parseInt(verifiedQuestsResult.rows[0].count, 10);

    if (verifiedQuestsCount === 1) {
      const achievementId = 1; // ID for 'First Quest Completed'
      const existingAchievementResult = await client.query(
        'SELECT 1 FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
        [participantId, achievementId]
      );

      if (existingAchievementResult.rows.length === 0) {
        await client.query(
          'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)',
          [participantId, achievementId]
        );

        const achievementActivityMetadata = { achievementId };
        await client.query(
          "INSERT INTO user_activities (user_id, activity_type, metadata) VALUES ($1, 'achievement_unlocked', $2)",
          [participantId, achievementActivityMetadata]
        );
        logger.info(`User ${participantId} unlocked achievement ${achievementId}: 'First Quest Completed'`);
      }
    }

    await client.query('COMMIT');

    // Trigger reward distribution (after main transaction is committed)
    try {
      const userResult = await pool.query('SELECT aptos_address FROM users WHERE id = $1', [participantId]);
      const participantAddress = userResult.rows[0]?.aptos_address;

      if (participantAddress) {
        logger.info(`Distributing ${rewardAmount} reward to ${participantAddress} for quest ${questId}`);
        await AptosService.distributeQuestRewards(participantAddress, rewardAmount);
      } else {
        logger.warn(`User ${participantId} has no Aptos address linked. Skipping reward distribution for quest ${questId}.`);
      }
    } catch (rewardError) {
      logger.error(`Failed to distribute rewards for quest ${questId} to user ${participantId}:`, rewardError);
      // Do not fail the request, as verification was successful. The reward can be handled separately.
    }
    logger.info(`Quest ${questId} completion verified for user ${participantId} by ${verifierId}`);
    res.status(200).json({ message: 'Quest completion verified successfully.' });

  } catch (dbError) {
    await client.query('ROLLBACK');
    logger.error(`Error verifying quest completion for quest ${questId}:`, dbError);
    res.status(500).json({ message: 'Failed to verify quest completion.' });
  } finally {
    client.release();
  }
};

/**
 * Get a list of participants for a specific quest.
 */
export const getQuestParticipants = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT
        u.id AS "userId",
        u.username,
        qp.joined_at AS "joinedAt",
        qp.status
      FROM quest_participants qp
      JOIN users u ON qp.user_id = u.id
      WHERE qp.quest_id = $1
      ORDER BY qp.joined_at ASC;
    `;
    const result = await pool.query(query, [id]);

    logger.info(`Fetched ${result.rows.length} participants for quest ${id}`);
    res.status(200).json(result.rows);

  } catch (dbError) {
    logger.error(`Error fetching participants for quest ${id}:`, dbError);
    res.status(500).json({ message: 'Failed to fetch quest participants.' });
  }
};

/**
 * Get quests near a specific location.
 */
export const getNearbyQuests = async (req: Request, res: Response) => {
  const { lat, lon, radius } = req.query; // lat, lon as strings

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  // Note: This is a simplified implementation.
  // A full implementation would use a geospatial query (e.g., with PostGIS)
  // to filter quests based on the user's location and a radius.
  // Here, we fetch all active, location-based quests and let the client filter.

  try {
    const query = `
      SELECT
        id, title, description, reward, currency, type, status, latitude, longitude, expires_at AS "expiresAt"
      FROM quests
      WHERE type = 'location_based' AND status = 'active';
    `;
    const result = await pool.query(query);

    logger.info(`Fetched ${result.rows.length} active location-based quests.`);
    res.status(200).json(result.rows);

  } catch (dbError) {
    logger.error('Error fetching nearby quests:', dbError);
    res.status(500).json({ message: 'Failed to fetch nearby quests.' });
  }
};
