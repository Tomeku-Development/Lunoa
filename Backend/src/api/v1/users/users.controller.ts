import { Request, Response } from 'express';
import { getPool } from '../../../config/database';
import logger from '../../../config/logger';
import Joi from 'joi';

/**
 * Get a user's public profile by their ID.
 */
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await getPool().query(
      `SELECT 
        id, 
        wallet_address AS "walletAddress", 
        bio, 
        avatar_url AS "avatarUrl", 
        website, 
        location, 
        reputation_score AS "reputationScore",
        created_at AS "createdAt"
      FROM users WHERE id = $1`,
      [id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching user by ID ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get a user's statistics by their ID.
 */
export const getUserStats = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // First, check if the user exists and get their base reputation score
    const userResult = await getPool().query('SELECT reputation_score FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const reputationScore = userResult.rows[0].reputation_score;

    // Run all stat queries concurrently
    const [questsResult, followersResult, followingResult] = await Promise.all([
      getPool().query("SELECT COUNT(*) FROM quest_participants WHERE user_id = $1 AND status = 'verified'", [id]),
      getPool().query('SELECT COUNT(*) FROM user_follows WHERE following_id = $1', [id]),
      getPool().query('SELECT COUNT(*) FROM user_follows WHERE follower_id = $1', [id])
    ]);

    const stats = {
      userId: id,
      questsCompleted: parseInt(questsResult.rows[0].count, 10),
      vibesMinted: 0, // Placeholder until Vibe system is implemented
      reputationScore: reputationScore,
      followers: parseInt(followersResult.rows[0].count, 10),
      following: parseInt(followingResult.rows[0].count, 10),
    };

    res.status(200).json(stats);

  } catch (error) {
    logger.error(`Error fetching stats for user ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get a user's achievements by their ID.
 */
export const getUserAchievements = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        a.id,
        a.name,
        a.description,
        a.icon_url AS "iconUrl",
        ua.created_at AS "unlockedAt"
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = $1
      ORDER BY ua.created_at DESC;
    `;

    const result = await getPool().query(query, [id]);

    // It's not an error if a user has no achievements, so we just return an empty array.
    res.status(200).json(result.rows);

  } catch (error) {
    logger.error(`Error fetching achievements for user ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get a user's reputation score by their ID.
 */
export const getUserReputation = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await getPool().query('SELECT reputation_score FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // TODO: The 'level' could be calculated based on the score in a more advanced implementation.
    const reputation = {
      userId: id,
      reputationScore: result.rows[0].reputation_score,
      level: 'Trusted', // Placeholder level
    };

    res.status(200).json(reputation);

  } catch (error) {
    logger.error(`Error fetching reputation for user ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const userSettingsSchema = Joi.object({
  notifications: Joi.object({
    push: Joi.boolean().optional(),
    email: Joi.boolean().optional(),
  }).optional(),
  privacy: Joi.object({
    show_activity: Joi.string().valid('all', 'followers', 'none').optional(),
  }).optional(),
}).min(1);

/**
 * Update a user's settings.
 */
export const updateUserSettings = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUserId = req.user?.userId;

  if (id !== authenticatedUserId) {
    return res.status(403).json({ message: 'Forbidden: You can only update your own settings.' });
  }

  const { error, value } = userSettingsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Fetch the current settings
    const currentSettingsResult = await getPool().query('SELECT settings FROM users WHERE id = $1', [authenticatedUserId]);

    if (currentSettingsResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const currentSettings = currentSettingsResult.rows[0].settings || {};

    // Merge with new settings
    const newSettings = { ...currentSettings, ...value };

    // Update the database
    const result = await getPool().query(
      'UPDATE users SET settings = $1 WHERE id = $2 RETURNING settings',
      [newSettings, authenticatedUserId]
    );

    logger.info(`User settings updated for user ID: ${authenticatedUserId}`);
    res.status(200).json(result.rows[0].settings);

  } catch (error) {
    logger.error(`Error updating settings for user ${authenticatedUserId}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get a user's activity feed by their ID.
 */
export const getUserActivity = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  try {
    const query = `
      SELECT 
        id,
        activity_type AS "activityType",
        metadata,
        created_at AS "createdAt"
      FROM user_activities
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50; -- Add pagination in a future implementation
    `;

    const { rows } = await getPool().query(query, [userId]);
    res.status(200).json(rows);
  } catch (err) {
    logger.error(`Error fetching activity for user ID ${userId}:`, err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Follow or unfollow a user.
 */
export const toggleFollowUser = async (req: Request, res: Response) => {
  const { id: userToFollowId } = req.params;
  const authenticatedUserId = req.user?.userId;

  if (userToFollowId === authenticatedUserId) {
    return res.status(400).json({ message: 'You cannot follow yourself.' });
  }

  const client = await getPool().connect();
  try {
    await client.query('BEGIN');

    const followResult = await client.query(
      'SELECT * FROM user_follows WHERE follower_id = $1 AND following_id = $2',
      [authenticatedUserId, userToFollowId]
    );

    if (followResult.rows.length > 0) {
      await client.query(
        'DELETE FROM user_follows WHERE follower_id = $1 AND following_id = $2',
        [authenticatedUserId, userToFollowId]
      );
      // TODO: Optionally, log the unfollow activity.
      await client.query('COMMIT');
      logger.info(`User ${authenticatedUserId} unfollowed user ${userToFollowId}`);
      res.status(200).json({ message: 'Successfully unfollowed user.' });
    } else {
      await client.query(
        'INSERT INTO user_follows (follower_id, following_id) VALUES ($1, $2)',
        [authenticatedUserId, userToFollowId]
      );

      const activityMetadata = { followingId: userToFollowId };
      await client.query(
        "INSERT INTO user_activities (user_id, activity_type, metadata) VALUES ($1, 'user_followed', $2)",
        [authenticatedUserId, activityMetadata]
      );

      await client.query('COMMIT');
      logger.info(`User ${authenticatedUserId} followed user ${userToFollowId}`);
      res.status(200).json({ message: 'Successfully followed user.' });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Error in follow/unfollow action for user ${authenticatedUserId} and ${userToFollowId}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
};

/**
 * Get a list of a user's followers.
 */
export const getUserFollowers = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT u.id, u.wallet_address AS "walletAddress", u.bio, u.avatar_url AS "avatarUrl"
      FROM user_follows uf
      JOIN users u ON uf.follower_id = u.id
      WHERE uf.following_id = $1
      ORDER BY uf.created_at DESC;
    `;
    const result = await getPool().query(query, [id]);
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error(`Error fetching followers for user ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get a list of users a user is following.
 */
export const getUserFollowing = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT u.id, u.wallet_address AS "walletAddress", u.bio, u.avatar_url AS "avatarUrl"
      FROM user_follows uf
      JOIN users u ON uf.following_id = u.id
      WHERE uf.follower_id = $1
      ORDER BY uf.created_at DESC;
    `;
    const result = await getPool().query(query, [id]);
    res.status(200).json(result.rows);
  } catch (error) {
    logger.error(`Error fetching following list for user ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
