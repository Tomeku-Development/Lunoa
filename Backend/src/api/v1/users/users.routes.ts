import { Router } from 'express';
import { getUserById, getUserStats, getUserAchievements, getUserReputation, updateUserSettings, getUserActivity, toggleFollowUser, getUserFollowers, getUserFollowing } from './users.controller';
import { protect } from '../../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a user's public profile by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User profile data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /api/v1/users/{id}/stats:
 *   get:
 *     summary: Get a user's statistics
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 quests_completed:
 *                   type: integer
 *                 vibes_minted:
 *                   type: integer
 *                 reputation_score:
 *                   type: integer
 *                 followers:
 *                   type: integer
 *                 following:
 *                   type: integer
 *       500:
 *         description: Internal server error.
 */
router.get('/:id/stats', getUserStats);

/**
 * @swagger
 * /api/v1/users/{id}/achievements:
 *   get:
 *     summary: Get a user's achievements
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: A list of user achievements.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date_unlocked:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error.
 */
router.get('/:id/achievements', getUserAchievements);

/**
 * @swagger
 * /api/v1/users/{id}/reputation:
 *   get:
 *     summary: Get a user's reputation score
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User reputation data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 reputation_score:
 *                   type: integer
 *                 level:
 *                   type: string
 *       500:
 *         description: Internal server error.
 */
router.get('/:id/reputation', getUserReputation);

/**
 * @swagger
 * /api/v1/users/{id}/settings:
 *   put:
 *     summary: Update user settings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notifications:
 *                 type: object
 *                 properties:
 *                   push:
 *                     type: boolean
 *                   email:
 *                     type: boolean
 *               privacy:
 *                 type: object
 *                 properties:
 *                   show_activity:
 *                     type: string
 *                     enum: [all, followers, none]
 *     responses:
 *       200:
 *         description: Settings updated successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */
router.put('/:id/settings', protect, updateUserSettings);

/**
 * @swagger
 * /api/v1/users/{id}/activity:
 *   get:
 *     summary: Get a user's activity feed
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: A list of recent user activities.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   details:
 *                     type: object
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error.
 */
router.get('/:id/activity', getUserActivity);

/**
 * @swagger
 * /api/v1/users/{id}/follow:
 *   post:
 *     summary: Follow or unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to follow or unfollow
 *     responses:
 *       200:
 *         description: Successfully followed or unfollowed the user.
 *       400:
 *         description: You cannot follow yourself.
 *       401:
 *         description: Not authorized.
 *       500:
 *         description: Internal server error.
 */
router.post('/:id/follow', protect, toggleFollowUser);

/**
 * @swagger
 * /api/v1/users/{id}/followers:
 *   get:
 *     summary: Get a list of a user's followers
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: A list of followers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   wallet_address:
 *                     type: string
 *       500:
 *         description: Internal server error.
 */
router.get('/:id/followers', getUserFollowers);

/**
 * @swagger
 * /api/v1/users/{id}/following:
 *   get:
 *     summary: Get a list of users a user is following
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: A list of users being followed.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   wallet_address:
 *                     type: string
 *       500:
 *         description: Internal server error.
 */
router.get('/:id/following', getUserFollowing);

export default router;
