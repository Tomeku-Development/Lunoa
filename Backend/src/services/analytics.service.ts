import { getPool } from '../config/database';
import logger from '../config/logger';

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalQuests: number;
  completedQuests: number;
  totalRewards: number;
  platformGrowth: {
    usersThisMonth: number;
    questsThisMonth: number;
    rewardsThisMonth: number;
  };
}

export interface UserAnalytics {
  userId: string;
  questsCompleted: number;
  questsCreated: number;
  totalRewardsEarned: number;
  totalRewardsPaid: number;
  followers: number;
  following: number;
  vibesCreated: number;
  reputationScore: number;
}

export interface QuestAnalytics {
  questId: string;
  participants: number;
  completionRate: number;
  averageCompletionTime: number;
  totalRewardsPaid: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

/**
 * Get platform-wide dashboard metrics
 */
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const pool = getPool();
  
  try {
    // Get total users
    const totalUsersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    // Get active users (users with activity in last 30 days)
    const activeUsersResult = await pool.query(`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM user_activity 
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);
    const activeUsers = parseInt(activeUsersResult.rows[0].count || '0');

    // Get total quests
    const totalQuestsResult = await pool.query('SELECT COUNT(*) as count FROM quests');
    const totalQuests = parseInt(totalQuestsResult.rows[0].count);

    // Get completed quests
    const completedQuestsResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM quests 
      WHERE status = 'completed'
    `);
    const completedQuests = parseInt(completedQuestsResult.rows[0].count);

    // Get total rewards distributed
    const totalRewardsResult = await pool.query(`
      SELECT COALESCE(SUM(reward_amount), 0) as total 
      FROM quest_participants 
      WHERE status = 'verified'
    `);
    const totalRewards = parseFloat(totalRewardsResult.rows[0].total || '0');

    // Get monthly growth metrics
    const usersThisMonthResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= DATE_TRUNC('month', NOW())
    `);
    const usersThisMonth = parseInt(usersThisMonthResult.rows[0].count);

    const questsThisMonthResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM quests 
      WHERE created_at >= DATE_TRUNC('month', NOW())
    `);
    const questsThisMonth = parseInt(questsThisMonthResult.rows[0].count);

    const rewardsThisMonthResult = await pool.query(`
      SELECT COALESCE(SUM(reward_amount), 0) as total 
      FROM quest_participants 
      WHERE status = 'verified' 
      AND updated_at >= DATE_TRUNC('month', NOW())
    `);
    const rewardsThisMonth = parseFloat(rewardsThisMonthResult.rows[0].total || '0');

    const metrics: DashboardMetrics = {
      totalUsers,
      activeUsers,
      totalQuests,
      completedQuests,
      totalRewards,
      platformGrowth: {
        usersThisMonth,
        questsThisMonth,
        rewardsThisMonth,
      },
    };

    logger.info('Dashboard metrics retrieved successfully');
    return metrics;
  } catch (error) {
    logger.error('Error retrieving dashboard metrics:', error);
    throw new Error('Failed to retrieve dashboard metrics');
  }
};

/**
 * Get analytics for a specific user
 */
export const getUserAnalytics = async (userId: string): Promise<UserAnalytics> => {
  const pool = getPool();
  
  try {
    // Get quests completed by user
    const questsCompletedResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM quest_participants 
      WHERE user_id = $1 AND status = 'verified'
    `, [userId]);
    const questsCompleted = parseInt(questsCompletedResult.rows[0].count);

    // Get quests created by user
    const questsCreatedResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM quests 
      WHERE creator_id = $1
    `, [userId]);
    const questsCreated = parseInt(questsCreatedResult.rows[0].count);

    // Get total rewards earned
    const totalRewardsEarnedResult = await pool.query(`
      SELECT COALESCE(SUM(reward_amount), 0) as total 
      FROM quest_participants 
      WHERE user_id = $1 AND status = 'verified'
    `, [userId]);
    const totalRewardsEarned = parseFloat(totalRewardsEarnedResult.rows[0].total || '0');

    // Get total rewards paid out (for quests created by user)
    const totalRewardsPaidResult = await pool.query(`
      SELECT COALESCE(SUM(qp.reward_amount), 0) as total 
      FROM quest_participants qp
      JOIN quests q ON q.id = qp.quest_id
      WHERE q.creator_id = $1 AND qp.status = 'verified'
    `, [userId]);
    const totalRewardsPaid = parseFloat(totalRewardsPaidResult.rows[0].total || '0');

    // Get follower counts
    const followersResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM user_follows 
      WHERE following_id = $1
    `, [userId]);
    const followers = parseInt(followersResult.rows[0].count);

    const followingResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM user_follows 
      WHERE follower_id = $1
    `, [userId]);
    const following = parseInt(followingResult.rows[0].count);

    // Get vibes created (assuming vibes table exists)
    const vibesCreatedResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM vibes 
      WHERE creator_id = $1
    `).catch(() => ({ rows: [{ count: '0' }] }));
    const vibesCreated = parseInt(vibesCreatedResult.rows[0].count);

    // Calculate reputation score based on activity
    const reputationScore = Math.floor(
      (questsCompleted * 10) + 
      (questsCreated * 15) + 
      (followers * 2) + 
      (vibesCreated * 5)
    );

    const analytics: UserAnalytics = {
      userId,
      questsCompleted,
      questsCreated,
      totalRewardsEarned,
      totalRewardsPaid,
      followers,
      following,
      vibesCreated,
      reputationScore,
    };

    logger.info(`User analytics retrieved for user ${userId}`);
    return analytics;
  } catch (error) {
    logger.error(`Error retrieving user analytics for ${userId}:`, error);
    throw new Error('Failed to retrieve user analytics');
  }
};

/**
 * Get analytics for a specific quest
 */
export const getQuestAnalytics = async (questId: string): Promise<QuestAnalytics> => {
  const pool = getPool();
  
  try {
    // Get participant count
    const participantsResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM quest_participants 
      WHERE quest_id = $1
    `, [questId]);
    const participants = parseInt(participantsResult.rows[0].count);

    // Get completion rate
    const completedResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM quest_participants 
      WHERE quest_id = $1 AND status = 'verified'
    `, [questId]);
    const completed = parseInt(completedResult.rows[0].count);
    const completionRate = participants > 0 ? (completed / participants) * 100 : 0;

    // Get average completion time
    const completionTimeResult = await pool.query(`
      SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_time
      FROM quest_participants 
      WHERE quest_id = $1 AND status = 'verified'
    `, [questId]);
    const averageCompletionTime = parseFloat(completionTimeResult.rows[0].avg_time || '0');

    // Get total rewards paid for this quest
    const totalRewardsPaidResult = await pool.query(`
      SELECT COALESCE(SUM(reward_amount), 0) as total 
      FROM quest_participants 
      WHERE quest_id = $1 AND status = 'verified'
    `, [questId]);
    const totalRewardsPaid = parseFloat(totalRewardsPaidResult.rows[0].total || '0');

    const analytics: QuestAnalytics = {
      questId,
      participants,
      completionRate,
      averageCompletionTime,
      totalRewardsPaid,
      engagement: {
        likes: 0, // Placeholder - implement when engagement system is ready
        shares: 0,
        comments: 0,
      },
    };

    logger.info(`Quest analytics retrieved for quest ${questId}`);
    return analytics;
  } catch (error) {
    logger.error(`Error retrieving quest analytics for ${questId}:`, error);
    throw new Error('Failed to retrieve quest analytics');
  }
};

/**
 * Get real-time platform statistics for dashboard widgets
 */
export const getRealTimeStats = async () => {
  const pool = getPool();
  
  try {
    // Get stats for the last 24 hours
    const last24hUsers = await pool.query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= NOW() - INTERVAL '24 hours'
    `);

    const last24hQuests = await pool.query(`
      SELECT COUNT(*) as count 
      FROM quests 
      WHERE created_at >= NOW() - INTERVAL '24 hours'
    `);

    const last24hCompletions = await pool.query(`
      SELECT COUNT(*) as count 
      FROM quest_participants 
      WHERE status = 'verified' 
      AND updated_at >= NOW() - INTERVAL '24 hours'
    `);

    const last24hRewards = await pool.query(`
      SELECT COALESCE(SUM(reward_amount), 0) as total 
      FROM quest_participants 
      WHERE status = 'verified' 
      AND updated_at >= NOW() - INTERVAL '24 hours'
    `);

    return {
      newUsers24h: parseInt(last24hUsers.rows[0].count),
      newQuests24h: parseInt(last24hQuests.rows[0].count),
      questCompletions24h: parseInt(last24hCompletions.rows[0].count),
      rewardsDistributed24h: parseFloat(last24hRewards.rows[0].total || '0'),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Error retrieving real-time stats:', error);
    throw new Error('Failed to retrieve real-time stats');
  }
};
