import { Request, Response } from 'express';
import { Quest, questSchema } from './quests.model';
import logger from '../../../config/logger';
import { getPool } from '../../../config/database';
import AptosService from '../blockchain/aptos.service';
import * as feedGroupService from '../../../services/feedGroups.service';
import * as questsService from '../../../services/quests.service';

/**
 * Create a new quest.
 */
export const createQuest = async (req: Request, res: Response) => {
  const { groupId: groupIdString } = req.params;
  const { error, value } = questSchema.validate(req.body);
  const creator_id = req.user?.userId;

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

    const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  if (!creator_id) {
    return res.status(401).json({ message: 'Not authorized to create a quest.' });
  }

    try {
    // Verify the user is a member of the group
    const isMember = await feedGroupService.isMember(groupId, creator_id);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this group.' });
    }

    const newQuest = await questsService.createQuest({ groupId, creatorId: creator_id, ...value });
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
  const { groupId: groupIdString } = req.params;
  const userId = req.user?.userId;
  const { type, status, creator_id } = req.query;

  const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  try {
    // Verify the user is a member of the group
    const isMember = await feedGroupService.isMember(groupId, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this group.' });
    }

    const filters = { type, status, creator_id } as any;
    const quests = await questsService.getAllQuests(groupId, filters);
    res.status(200).json(quests);

  } catch (dbError) {
    logger.error('Error fetching quests:', dbError);
    res.status(500).json({ message: 'Failed to fetch quests.' });
  }
};

/**
 * Get a specific quest by its ID.
 */
export const getQuestById = async (req: Request, res: Response) => {
  const { groupId: groupIdString, id: questId } = req.params;
  const userId = req.user?.userId;

  const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  try {
    // Verify the user is a member of the group
    const isMember = await feedGroupService.isMember(groupId, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this group.' });
    }

    const quest = await questsService.getQuestById(questId, groupId);

    if (!quest) {
      return res.status(404).json({ message: 'Quest not found in this group.' });
    }

    res.status(200).json(quest);
  } catch (dbError) {
    logger.error(`Error fetching quest ${questId}:`, dbError);
    res.status(500).json({ message: 'Failed to fetch quest.' });
  }
};

/**
 * Update a quest.
 */
export const updateQuest = async (req: Request, res: Response) => {
  const { groupId: groupIdString, id: questId } = req.params;
  const authenticatedUserId = req.user?.userId;
  const { body } = req;

  const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  if (!authenticatedUserId) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  if (Object.keys(body).length === 0) {
    return res.status(400).json({ message: 'No update data provided.' });
  }

  try {
    const isMember = await feedGroupService.isMember(groupId, authenticatedUserId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this group.' });
    }

    const updatedQuest = await questsService.updateQuest(questId, groupId, authenticatedUserId, body);

    if (!updatedQuest) {
      return res.status(404).json({ message: 'Quest not found in this group.' });
    }

    logger.info(`Quest ${questId} updated successfully.`);
    res.status(200).json(updatedQuest);

  } catch (dbError: any) {
    if (dbError.message === 'FORBIDDEN') {
      return res.status(403).json({ message: 'Forbidden: You can only update your own quests.' });
    }
    logger.error(`Error updating quest ${questId}:`, dbError);
    res.status(500).json({ message: 'Failed to update quest.' });
  }
};

/**
 * Delete a quest.
 */
export const deleteQuest = async (req: Request, res: Response) => {
  const { groupId: groupIdString, id: questId } = req.params;
  const authenticatedUserId = req.user?.userId;

  const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  if (!authenticatedUserId) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  try {
    const isMember = await feedGroupService.isMember(groupId, authenticatedUserId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this group.' });
    }

    const success = await questsService.deleteQuest(questId, groupId, authenticatedUserId);

    if (success === null) {
      return res.status(404).json({ message: 'Quest not found in this group.' });
    }

    if (success) {
      logger.info(`Quest ${questId} from group ${groupId} deleted successfully.`);
      res.status(200).json({ message: 'Quest deleted successfully.' });
    } else {
      // This case should ideally not be reached if the service layer is correct
      res.status(404).json({ message: 'Quest not found.' });
    }

  } catch (dbError: any) {
    if (dbError.message === 'FORBIDDEN') {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own quests.' });
    }
    logger.error(`Error deleting quest ${questId} from group ${groupId}:`, dbError);
    res.status(500).json({ message: 'Failed to delete quest.' });
  }
};

/**
 * Join a quest.
 */
export const joinQuest = async (req: Request, res: Response) => {
  const { groupId: groupIdString, id: questId } = req.params;
  const authenticatedUserId = req.user?.userId;

  const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  if (!authenticatedUserId) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  try {
    // Verify the user is a member of the group
    const isMember = await feedGroupService.isMember(groupId, authenticatedUserId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this group.' });
    }

    const participantRecord = await questsService.joinQuest(questId, groupId, authenticatedUserId);

    logger.info(`User ${authenticatedUserId} joined quest ${questId} in group ${groupId}`);
    res.status(200).json({ message: 'Successfully joined quest', data: participantRecord });

  } catch (dbError: any) {
    switch (dbError.message) {
      case 'NOT_FOUND':
        return res.status(404).json({ message: 'Quest not found in this group.' });
      case 'CANNOT_JOIN_OWN_QUEST':
        return res.status(400).json({ message: 'You cannot join your own quest.' });
      case 'ALREADY_JOINED':
        return res.status(409).json({ message: 'You have already joined this quest.' });
      default:
        logger.error(`Error joining quest ${questId} in group ${groupId}:`, dbError);
        return res.status(500).json({ message: 'Failed to join quest.' });
    }
  }
};

/**
 * Complete a quest and claim rewards.
 */
export const completeQuest = async (req: Request, res: Response) => {
  const { groupId: groupIdString, id: questId } = req.params;
  const userId = req.user?.userId;

  const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  try {
    // Verify the user is a member of the group first
    const isMember = await feedGroupService.isMember(groupId, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this group.' });
    }

    const updatedParticipant = await questsService.completeQuest(questId, groupId, userId);

    logger.info(`User ${userId} marked quest ${questId} in group ${groupId} as completed.`);
    res.status(200).json({ message: 'Quest marked as completed. Awaiting verification.', data: updatedParticipant });

  } catch (dbError: any) {
    switch (dbError.message) {
      case 'NOT_A_PARTICIPANT':
        return res.status(404).json({ message: 'You are not a participant in this quest or it does not exist in this group.' });
      case 'ALREADY_SUBMITTED':
        return res.status(409).json({ message: 'Quest completion has already been submitted.' });
      default:
        logger.error(`Error completing quest ${questId} for user ${userId} in group ${groupId}:`, dbError);
        return res.status(500).json({ message: 'Failed to complete quest.' });
    }
  }
};

/**
 * Verify quest completion.
 */
export const verifyQuestCompletion = async (req: Request, res: Response) => {
  const { groupId: groupIdString, id: questId } = req.params;
  const verifierId = req.user?.userId;
  const { participantId } = req.body;

  const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  if (!verifierId) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  if (!participantId) {
    return res.status(400).json({ message: 'Participant ID is required.' });
  }

  try {
    const isMember = await feedGroupService.isMember(groupId, verifierId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this group.' });
    }

    const result = await questsService.verifyQuestCompletion(questId, groupId, participantId, verifierId);

    logger.info(`Quest ${questId} completion verified for user ${participantId} by ${verifierId}`);
    res.status(200).json(result);

  } catch (error: any) {
    switch (error.message) {
      case 'QUEST_NOT_FOUND':
        return res.status(404).json({ message: 'Quest not found in this group.' });
      case 'FORBIDDEN':
        return res.status(403).json({ message: 'Forbidden: Only the quest creator can verify completion.' });
      case 'PARTICIPANT_NOT_FOUND':
        return res.status(404).json({ message: 'Participant not found for this quest.' });
      case 'INVALID_STATUS':
        return res.status(400).json({ message: 'Cannot verify completion for a participant whose status is not submitted.' });
      default:
        logger.error(`Error verifying quest ${questId} for user ${participantId}:`, error);
        return res.status(500).json({ message: 'Failed to verify quest completion.' });
    }
  }
};

/**
 * Get a list of participants for a specific quest.
 */
export const getQuestParticipants = async (req: Request, res: Response) => {
  const { groupId: groupIdString, id: questId } = req.params;
  // @ts-ignore
  const userId = req.user?.id;

  const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  try {
    // Verify the user is a member of the group
    const isMember = await feedGroupService.isMember(groupId, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this group.' });
    }

    // Verify the quest exists in the group
    const questExists = await getPool().query('SELECT 1 FROM quests WHERE id = $1 AND group_id = $2', [questId, groupId]);
    if (questExists.rows.length === 0) {
      return res.status(404).json({ message: 'Quest not found in this group.' });
    }

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
    const result = await getPool().query(query, [questId]);

    logger.info(`Fetched ${result.rows.length} participants for quest ${questId} in group ${groupId}`);
    res.status(200).json(result.rows);

  } catch (dbError) {
    logger.error(`Error fetching participants for quest ${questId} in group ${groupId}:`, dbError);
    res.status(500).json({ message: 'Failed to fetch quest participants.' });
  }
};

/**
 * Get quests near a specific location.
 */
export const getNearbyQuests = async (req: Request, res: Response) => {
  const { groupId: groupIdString } = req.params;
  const { lat, lon, radius } = req.query; // lat, lon as strings
  // @ts-ignore
  const userId = req.user?.id;

  const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  // Note: This is a simplified implementation.
  // A full implementation would use a geospatial query (e.g., with PostGIS)
  // to filter quests based on the user's location and a radius.
  // Here, we fetch all active, location-based quests and let the client filter.

  try {
    // Verify the user is a member of the group
    const isMember = await feedGroupService.isMember(groupId, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this group.' });
    }

    const query = `
      SELECT
        id, title, description, reward, currency, type, status, latitude, longitude, expires_at AS "expiresAt"
      FROM quests
      WHERE type = 'location_based' AND status = 'active' AND group_id = $1;
    `;
    const result = await getPool().query(query, [groupId]);

    logger.info(`Fetched ${result.rows.length} active location-based quests for group ${groupId}.`);
    res.status(200).json(result.rows);

  } catch (dbError) {
    logger.error(`Error fetching nearby quests for group ${groupId}:`, dbError);
    res.status(500).json({ message: 'Failed to fetch nearby quests.' });
  }
};
