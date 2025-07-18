import { getPool } from '../config/database';
import logger from '../config/logger';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
}

export enum NotificationType {
  QUEST_COMPLETED = 'quest_completed',
  QUEST_VERIFIED = 'quest_verified',
  REWARD_RECEIVED = 'reward_received',
  VIBE_BOOSTED = 'vibe_boosted',
  NEW_FOLLOWER = 'new_follower',
  GROUP_INVITATION = 'group_invitation',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  TOKEN_TRANSACTION = 'token_transaction',
  GOVERNANCE_PROPOSAL = 'governance_proposal'
}

export interface NotificationSettings {
  userId: string;
  email: boolean;
  push: boolean;
  questCompletions: boolean;
  rewards: boolean;
  social: boolean;
  governance: boolean;
  system: boolean;
}

/**
 * Create a new notification for a user
 */
export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: any
): Promise<Notification> => {
  const pool = getPool();
  
  try {
    const query = `
      INSERT INTO notifications (user_id, type, title, message, data)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userId,
      type,
      title,
      message,
      JSON.stringify(data || {})
    ]);
    
    const notification = result.rows[0];
    logger.info(`Notification created for user ${userId}: ${type}`);
    
    return notification;
  } catch (error) {
    logger.error(`Error creating notification for user ${userId}:`, error);
    throw new Error('Failed to create notification');
  }
};

/**
 * Get notifications for a user with pagination
 */
export const getUserNotifications = async (
  userId: string,
  limit: number = 20,
  offset: number = 0,
  unreadOnly: boolean = false
): Promise<{ notifications: Notification[], totalCount: number }> => {
  const pool = getPool();
  
  try {
    let whereClause = 'WHERE user_id = $1';
    let params: any[] = [userId];
    
    if (unreadOnly) {
      whereClause += ' AND read = false';
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM notifications ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count);
    
    // Get notifications with pagination
    const query = `
      SELECT * FROM notifications 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    
    params.push(limit, offset);
    const result = await pool.query(query, params);
    
    const notifications = result.rows.map(row => ({
      ...row,
      data: row.data ? JSON.parse(row.data) : {}
    }));
    
    return { notifications, totalCount };
  } catch (error) {
    logger.error(`Error retrieving notifications for user ${userId}:`, error);
    throw new Error('Failed to retrieve notifications');
  }
};

/**
 * Mark notifications as read
 */
export const markNotificationsAsRead = async (
  userId: string,
  notificationIds?: string[]
): Promise<number> => {
  const pool = getPool();
  
  try {
    let query: string;
    let params: any[];
    
    if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      const placeholders = notificationIds.map((_, index) => `$${index + 2}`).join(',');
      query = `
        UPDATE notifications 
        SET read = true, read_at = NOW() 
        WHERE user_id = $1 AND id IN (${placeholders})
      `;
      params = [userId, ...notificationIds];
    } else {
      // Mark all notifications as read for user
      query = `
        UPDATE notifications 
        SET read = true, read_at = NOW() 
        WHERE user_id = $1 AND read = false
      `;
      params = [userId];
    }
    
    const result = await pool.query(query, params);
    const updatedCount = result.rowCount || 0;
    
    logger.info(`Marked ${updatedCount} notifications as read for user ${userId}`);
    return updatedCount;
  } catch (error) {
    logger.error(`Error marking notifications as read for user ${userId}:`, error);
    throw new Error('Failed to mark notifications as read');
  }
};

/**
 * Get notification settings for a user
 */
export const getNotificationSettings = async (userId: string): Promise<NotificationSettings> => {
  const pool = getPool();
  
  try {
    const query = 'SELECT * FROM notification_settings WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      // Return default settings if none exist
      return {
        userId,
        email: true,
        push: true,
        questCompletions: true,
        rewards: true,
        social: true,
        governance: true,
        system: true
      };
    }
    
    return result.rows[0];
  } catch (error) {
    logger.error(`Error retrieving notification settings for user ${userId}:`, error);
    throw new Error('Failed to retrieve notification settings');
  }
};

/**
 * Update notification settings for a user
 */
export const updateNotificationSettings = async (
  userId: string,
  settings: Partial<NotificationSettings>
): Promise<NotificationSettings> => {
  const pool = getPool();
  
  try {
    const query = `
      INSERT INTO notification_settings (
        user_id, email, push, quest_completions, rewards, social, governance, system
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id) DO UPDATE SET
        email = COALESCE($2, notification_settings.email),
        push = COALESCE($3, notification_settings.push),
        quest_completions = COALESCE($4, notification_settings.quest_completions),
        rewards = COALESCE($5, notification_settings.rewards),
        social = COALESCE($6, notification_settings.social),
        governance = COALESCE($7, notification_settings.governance),
        system = COALESCE($8, notification_settings.system)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userId,
      settings.email,
      settings.push,
      settings.questCompletions,
      settings.rewards,
      settings.social,
      settings.governance,
      settings.system
    ]);
    
    return result.rows[0];
  } catch (error) {
    logger.error(`Error updating notification settings for user ${userId}:`, error);
    throw new Error('Failed to update notification settings');
  }
};

/**
 * Send real-time notification (for WebSocket integration)
 */
export const sendRealTimeNotification = async (
  userId: string,
  notification: Notification
) => {
  // This would integrate with WebSocket service when implemented
  logger.info(`Real-time notification sent to user ${userId}: ${notification.type}`);
  
  // Placeholder for WebSocket/Socket.IO integration
  // In a real implementation, this would emit to the user's connected socket
  return true;
};

/**
 * Create notifications for quest-related events
 */
export const createQuestNotifications = {
  questCompleted: async (questId: string, userId: string, questTitle: string) => {
    return createNotification(
      userId,
      NotificationType.QUEST_COMPLETED,
      'Quest Completed!',
      `You have successfully completed the quest "${questTitle}". Awaiting verification for rewards.`,
      { questId, questTitle }
    );
  },
  
  questVerified: async (questId: string, userId: string, questTitle: string, rewardAmount: number) => {
    return createNotification(
      userId,
      NotificationType.QUEST_VERIFIED,
      'Quest Verified!',
      `Your completion of "${questTitle}" has been verified. You earned ${rewardAmount} $LUNOA!`,
      { questId, questTitle, rewardAmount }
    );
  },
  
  rewardReceived: async (userId: string, amount: number, source: string) => {
    return createNotification(
      userId,
      NotificationType.REWARD_RECEIVED,
      'Reward Received!',
      `You received ${amount} $LUNOA from ${source}`,
      { amount, source }
    );
  }
};

/**
 * Get unread notification count for a user
 */
export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  const pool = getPool();
  
  try {
    const query = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read = false';
    const result = await pool.query(query, [userId]);
    
    return parseInt(result.rows[0].count);
  } catch (error) {
    logger.error(`Error getting unread notification count for user ${userId}:`, error);
    throw new Error('Failed to get unread notification count');
  }
};
