import { Router } from 'express';
import { createQuest, getAllQuests, getQuestById, updateQuest, deleteQuest, joinQuest, completeQuest, verifyQuestCompletion, getQuestParticipants, getNearbyQuests } from './quests.controller';
import { protect } from '../../../middleware/auth.middleware';

// This router is intended to be mounted under a route that includes a :groupId parameter.
// For example: app.use('/api/v1/feed-groups/:groupId/quests', questRoutes);
const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Group Quests
 *   description: API for managing quests within a specific group.
 */

/**
 * @swagger
 * /api/v1/feed-groups/{groupId}/quests:
 *   post:
 *     summary: Create a new quest in a group
 *     tags: [Group Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestCreate'
 *     responses:
 *       201:
 *         description: Quest created successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 */
router.post('/', protect, createQuest);

/**
 * @swagger
 * /api/v1/feed-groups/{groupId}/quests:
 *   get:
 *     summary: Get all quests in a group
 *     tags: [Group Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [social, location_based]
 *         description: Filter by quest type.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, expired]
 *         description: Filter by quest status.
 *     responses:
 *       200:
 *         description: A list of quests.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 */
router.get('/', protect, getAllQuests);

/**
 * @swagger
 * /api/v1/feed-groups/{groupId}/quests/nearby:
 *   get:
 *     summary: Get nearby quests in a group
 *     tags: [Group Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group.
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude.
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude.
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         description: Radius in meters.
 *     responses:
 *       200:
 *         description: A list of nearby quests.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 */
router.get('/nearby', protect, getNearbyQuests);

/**
 * @swagger
 * /api/v1/feed-groups/{groupId}/quests/{id}:
 *   get:
 *     summary: Get a specific quest in a group
 *     tags: [Group Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quest.
 *     responses:
 *       200:
 *         description: Quest details.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Quest not found.
 */
router.get('/:id', protect, getQuestById);

/**
 * @swagger
 * /api/v1/feed-groups/{groupId}/quests/{id}:
 *   put:
 *     summary: Update a quest in a group
 *     tags: [Group Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quest.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestUpdate'
 *     responses:
 *       200:
 *         description: Quest updated successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Quest not found.
 */
router.put('/:id', protect, updateQuest);

/**
 * @swagger
 * /api/v1/feed-groups/{groupId}/quests/{id}:
 *   delete:
 *     summary: Delete a quest in a group
 *     tags: [Group Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quest.
 *     responses:
 *       204:
 *         description: Quest deleted successfully.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Quest not found.
 */
router.delete('/:id', protect, deleteQuest);

/**
 * @swagger
 * /api/v1/feed-groups/{groupId}/quests/{id}/join:
 *   post:
 *     summary: Join a quest in a group
 *     tags: [Group Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quest.
 *     responses:
 *       200:
 *         description: Successfully joined quest.
 *       400:
 *         description: Cannot join your own quest.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Quest not found.
 *       409:
 *         description: Already joined this quest.
 */
router.post('/:id/join', protect, joinQuest);

/**
 * @swagger
 * /api/v1/feed-groups/{groupId}/quests/{id}/complete:
 *   post:
 *     summary: Mark a quest as completed in a group
 *     tags: [Group Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quest.
 *     responses:
 *       200:
 *         description: Quest marked as completed.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Participant not found.
 *       409:
 *         description: Quest already submitted.
 */
router.post('/:id/complete', protect, completeQuest);

/**
 * @swagger
 * /api/v1/feed-groups/{groupId}/quests/{id}/verify:
 *   post:
 *     summary: Verify a quest completion in a group
 *     tags: [Group Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quest.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participantId:
 *                 type: string
 *                 description: The ID of the user whose completion is being verified.
 *             required:
 *               - participantId
 *     responses:
 *       200:
 *         description: Quest completion verified.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Quest or participant not found.
 */
router.post('/:id/verify', protect, verifyQuestCompletion);

/**
 * @swagger
 * /api/v1/feed-groups/{groupId}/quests/{id}/participants:
 *   get:
 *     summary: Get participants for a quest in a group
 *     tags: [Group Quests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quest.
 *     responses:
 *       200:
 *         description: A list of quest participants.
 *       401:
 *         description: Not authorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Quest not found.
 */
router.get('/:id/participants', protect, getQuestParticipants);

export default router;
