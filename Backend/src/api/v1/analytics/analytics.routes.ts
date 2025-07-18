import { Router } from 'express';
import { protect } from '../../../middleware/auth.middleware';
import { getDashboardMetrics, getUserAnalytics, getQuestAnalytics, getRealTimeStats } from '../../../services/analytics.service';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics and metrics endpoints for dashboard integration
 */

/**
 * @swagger
 * /api/v1/analytics/dashboard:
 *   get:
 *     summary: Get platform-wide dashboard metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 activeUsers:
 *                   type: integer
 *                 totalQuests:
 *                   type: integer
 *                 completedQuests:
 *                   type: integer
 *                 totalRewards:
 *                   type: number
 *                 platformGrowth:
 *                   type: object
 *                   properties:
 *                     usersThisMonth:
 *                       type: integer
 *                     questsThisMonth:
 *                       type: integer
 *                     rewardsThisMonth:
 *                       type: number
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.get('/dashboard', protect, async (req, res) => {
  try {
    const metrics = await getDashboardMetrics();
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard metrics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/v1/analytics/realtime:
 *   get:
 *     summary: Get real-time platform statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Real-time statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newUsers24h:
 *                   type: integer
 *                 newQuests24h:
 *                   type: integer
 *                 questCompletions24h:
 *                   type: integer
 *                 rewardsDistributed24h:
 *                   type: number
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.get('/realtime', protect, async (req, res) => {
  try {
    const stats = await getRealTimeStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve real-time stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/v1/analytics/user/{userId}:
 *   get:
 *     summary: Get analytics for a specific user
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 questsCompleted:
 *                   type: integer
 *                 questsCreated:
 *                   type: integer
 *                 totalRewardsEarned:
 *                   type: number
 *                 totalRewardsPaid:
 *                   type: number
 *                 followers:
 *                   type: integer
 *                 following:
 *                   type: integer
 *                 vibesCreated:
 *                   type: integer
 *                 reputationScore:
 *                   type: integer
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const analytics = await getUserAnalytics(userId);
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/v1/analytics/quest/{questId}:
 *   get:
 *     summary: Get analytics for a specific quest
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questId
 *         required: true
 *         schema:
 *           type: string
 *         description: The quest's ID
 *     responses:
 *       200:
 *         description: Quest analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questId:
 *                   type: string
 *                 participants:
 *                   type: integer
 *                 completionRate:
 *                   type: number
 *                 averageCompletionTime:
 *                   type: number
 *                 totalRewardsPaid:
 *                   type: number
 *                 engagement:
 *                   type: object
 *                   properties:
 *                     likes:
 *                       type: integer
 *                     shares:
 *                       type: integer
 *                     comments:
 *                       type: integer
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Quest not found
 *       500:
 *         description: Internal server error
 */
router.get('/quest/:questId', protect, async (req, res) => {
  try {
    const { questId } = req.params;
    const analytics = await getQuestAnalytics(questId);
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve quest analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
