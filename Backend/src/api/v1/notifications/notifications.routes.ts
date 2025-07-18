import { Router, Request, Response } from 'express';
import { protect } from '../../../middleware/auth.middleware';
import {
  getUserNotifications,
  markNotificationsAsRead,
  getNotificationSettings,
  updateNotificationSettings,
  getUnreadNotificationCount
} from '../../../services/notification.service';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management endpoints for real-time updates
 */

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Get user notifications with pagination
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of notifications to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of notifications to skip
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Only return unread notifications
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     notifications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           type:
 *                             type: string
 *                           title:
 *                             type: string
 *                           message:
 *                             type: string
 *                           read:
 *                             type: boolean
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     totalCount:
 *                       type: integer
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, async (req: Request & { user: any }, res: Response) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const unreadOnly = req.query.unreadOnly === 'true';
    
    const result = await getUserNotifications(userId, limit, offset, unreadOnly);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/v1/notifications/unread-count:
 *   get:
 *     summary: Get count of unread notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.get('/unread-count', protect, async (req: Request & { user: any }, res: Response) => {
  try {
    const userId = req.user.id;
    const count = await getUnreadNotificationCount(userId);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get unread notification count',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/v1/notifications/mark-read:
 *   post:
 *     summary: Mark notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of notification IDs to mark as read (optional - if not provided, marks all as read)
 *     responses:
 *       200:
 *         description: Notifications marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedCount:
 *                       type: integer
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.post('/mark-read', protect, async (req: Request & { user: any }, res: Response) => {
  try {
    const userId = req.user.id;
    const { notificationIds } = req.body;
    
    const updatedCount = await markNotificationsAsRead(userId, notificationIds);
    
    res.json({
      success: true,
      data: { updatedCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/v1/notifications/settings:
 *   get:
 *     summary: Get user notification settings
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: boolean
 *                     push:
 *                       type: boolean
 *                     questCompletions:
 *                       type: boolean
 *                     rewards:
 *                       type: boolean
 *                     social:
 *                       type: boolean
 *                     governance:
 *                       type: boolean
 *                     system:
 *                       type: boolean
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.get('/settings', protect, async (req: Request & { user: any }, res: Response) => {
  try {
    const userId = req.user.id;
    const settings = await getNotificationSettings(userId);
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notification settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/v1/notifications/settings:
 *   put:
 *     summary: Update user notification settings
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: boolean
 *               push:
 *                 type: boolean
 *               questCompletions:
 *                 type: boolean
 *               rewards:
 *                 type: boolean
 *               social:
 *                 type: boolean
 *               governance:
 *                 type: boolean
 *               system:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: boolean
 *                     push:
 *                       type: boolean
 *                     questCompletions:
 *                       type: boolean
 *                     rewards:
 *                       type: boolean
 *                     social:
 *                       type: boolean
 *                     governance:
 *                       type: boolean
 *                     system:
 *                       type: boolean
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.put('/settings', protect, async (req: Request & { user: any }, res: Response) => {
  try {
    const userId = req.user.id;
    const settingsUpdate = req.body;
    
    const updatedSettings = await updateNotificationSettings(userId, settingsUpdate);
    
    res.json({
      success: true,
      data: updatedSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
