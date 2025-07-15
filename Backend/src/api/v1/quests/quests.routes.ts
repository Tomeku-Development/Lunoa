import { Router } from 'express';
import { createQuest, getAllQuests, getQuestById, updateQuest, deleteQuest, joinQuest, completeQuest, verifyQuestCompletion, getQuestParticipants, getNearbyQuests } from './quests.controller';
import { protect } from '../../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/v1/quests:
 *   post:
 *     summary: Create a new quest
 *     tags: [Quests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - reward
 *               - currency
 *               - type
 *               - expires_at
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               reward:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [Lunoa, USDC]
 *               type:
 *                 type: string
 *                 enum: [social, location_based]
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Quest created successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Not authorized.
 *       500:
 *         description: Internal server error.
 */
router.post('/', protect, createQuest);

/**
 * @swagger
 * /api/v1/quests/{id}/join:
 *   post:
 *     summary: Join a quest
 *     tags: [Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quest to join.
 *     responses:
 *       200:
 *         description: Successfully joined quest.
 *       400:
 *         description: Cannot join your own quest.
 *       401:
 *         description: Not authorized.
 *       404:
 *         description: Quest not found.
 *       409:
 *         description: Already joined this quest.
 *       500:
 *         description: Internal server error.
 */
router.post('/:id/join', protect, joinQuest);

/**
 * @swagger
 * /api/v1/quests:
 *   get:
 *     summary: Get all quests with optional filtering
 *     tags: [Quests]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [social, location_based]
 *         description: Filter quests by type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, expired]
 *         description: Filter quests by status
 *       - in: query
 *         name: creator_id
 *         schema:
 *           type: string
 *         description: Filter quests by creator ID
 *     responses:
 *       200:
 *         description: A list of quests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quest'
 *       500:
 *         description: Internal server error.
 */
router.get('/', getAllQuests);

/**
 * @swagger
 * /api/v1/quests/{id}:
 *   get:
 *     summary: Get a specific quest by its ID
 *     tags: [Quests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The quest's ID
 *     responses:
 *       200:
 *         description: Quest details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quest'
 *       404:
 *         description: Quest not found.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/v1/quests/nearby:
 *   get:
 *     summary: Get quests near a specific location
 *     tags: [Quests]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude
 *       - in: query
 *         name: radius
 *         schema:
 *           type: integer
 *         description: Search radius in meters
 *     responses:
 *       200:
 *         description: A list of nearby quests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quest'
 *       400:
 *         description: Missing latitude or longitude.
 *       500:
 *         description: Internal server error.
 */
router.get('/nearby', getNearbyQuests);

router.get('/:id', getQuestById);

/**
 * @swagger
 * /api/v1/quests/{id}:
 *   put:
 *     summary: Update a quest
 *     tags: [Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The quest's ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quest'
 *     responses:
 *       200:
 *         description: Quest updated successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Quest not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/:id', protect, updateQuest);

/**
 * @swagger
 * /api/v1/quests/{id}:
 *   delete:
 *     summary: Delete a quest
 *     tags: [Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The quest's ID
 *     responses:
 *       204:
 *         description: Quest deleted successfully.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Quest not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', protect, deleteQuest);

/**
 * @swagger
 * /api/v1/quests/{id}/join:
 *   post:
 *     summary: Join a quest
 *     tags: [Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The quest's ID
 *     responses:
 *       200:
 *         description: Successfully joined quest.
 *       401:
 *         description: Not authorized.
 *       404:
 *         description: Quest not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/:id/join', protect, joinQuest);

/**
 * @swagger
 * /api/v1/quests/{id}/complete:
 *   post:
 *     summary: Complete a quest and claim rewards
 *     tags: [Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The quest's ID
 *     responses:
 *       200:
 *         description: Quest completed successfully.
 *       401:
 *         description: Not authorized.
 *       404:
 *         description: Quest not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/:id/complete', protect, completeQuest);

/**
 * @swagger
 * /api/v1/quests/{id}/verify:
 *   post:
 *     summary: Verify quest completion (by quest owner/admin)
 *     tags: [Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The quest's ID
 *     responses:
 *       200:
 *         description: Quest completion verified successfully.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Quest not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/:id/verify', protect, verifyQuestCompletion);

/**
 * @swagger
 * /api/v1/quests/{id}/participants:
 *   get:
 *     summary: Get a list of participants for a specific quest
 *     tags: [Quests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The quest's ID
 *     responses:
 *       200:
 *         description: A list of quest participants.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId: { type: 'string' }
 *                   username: { type: 'string' }
 *                   joined_at: { type: 'string', format: 'date-time' }
 *       404:
 *         description: Quest not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id/participants', getQuestParticipants);

export default router;
