import { Request, Response } from 'express';
import * as feedGroupService from '../../../services/feedGroups.service';
import logger from '../../../config/logger';

/**
 * Handles the creation of a new feed group.
 */
export const createFeedGroup = async (req: Request, res: Response) => {
  // @ts-ignore
  const creatorId = req.user?.id;

  if (!creatorId) {
    return res.status(401).json({ message: 'Unauthorized: User not logged in.' });
  }

  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required.' });
  }

  try {
    const groupData = { name, description, creatorId };
    const newGroup = await feedGroupService.createGroup(groupData);
    res.status(201).json(newGroup);
  } catch (error) {
    logger.error('Error creating feed group:', error);
    res.status(500).json({ message: 'Failed to create feed group.' });
  }
};

/**
 * Handles fetching all feed groups.
 */
export const getAllFeedGroups = async (req: Request, res: Response) => {
  try {
    const groups = await feedGroupService.getAllGroups();
    res.status(200).json(groups);
  } catch (error) {
    logger.error('Error fetching all feed groups:', error);
    res.status(500).json({ message: 'Failed to fetch feed groups.' });
  }
};

/**
 * Handles fetching a single feed group by its ID.
 */
export const getFeedGroupById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const group = await feedGroupService.getGroupById(parseInt(id, 10));

    if (!group) {
      return res.status(404).json({ message: 'Feed group not found.' });
    }

    res.status(200).json(group);
  } catch (error) {
    logger.error(`Error fetching feed group with ID ${id}:`, error);
    res.status(500).json({ message: 'Failed to fetch feed group.' });
  }
};

/**
 * Handles updating a feed group.
 */
export const updateFeedGroup = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;
  const { id } = req.params;
  const { name, description } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User not logged in.' });
  }

  try {
    const existingGroup = await feedGroupService.getGroupById(parseInt(id, 10));

    if (!existingGroup) {
      return res.status(404).json({ message: 'Feed group not found.' });
    }

    if (existingGroup.creator_id !== userId) {
      return res.status(403).json({ message: 'Forbidden: You are not the creator of this group.' });
    }

    const updatedGroup = await feedGroupService.updateGroup(parseInt(id, 10), { name, description });

    res.status(200).json(updatedGroup);
  } catch (error) {
    logger.error(`Error updating feed group with ID ${id}:`, error);
    res.status(500).json({ message: 'Failed to update feed group.' });
  }
};

/**
 * Handles deleting a feed group.
 */
export const deleteFeedGroup = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User not logged in.' });
  }

  try {
    const existingGroup = await feedGroupService.getGroupById(parseInt(id, 10));

    if (!existingGroup) {
      return res.status(404).json({ message: 'Feed group not found.' });
    }

    if (existingGroup.creator_id !== userId) {
      return res.status(403).json({ message: 'Forbidden: You are not the creator of this group.' });
    }

    await feedGroupService.deleteGroup(parseInt(id, 10));

    res.status(204).send(); // 204 No Content
  } catch (error) {
    logger.error(`Error deleting feed group with ID ${id}:`, error);
    res.status(500).json({ message: 'Failed to delete feed group.' });
  }
};

/**
 * Handles a user joining a feed group.
 */
export const joinFeedGroup = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;
  const { id } = req.params;
  const groupId = parseInt(id, 10);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User not logged in.' });
  }

  try {
    const group = await feedGroupService.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Feed group not found.' });
    }

    const alreadyMember = await feedGroupService.isMember(groupId, userId);
    if (alreadyMember) {
      return res.status(409).json({ message: 'You are already a member of this group.' });
    }

    await feedGroupService.joinGroup(groupId, userId);

    res.status(200).json({ message: 'Successfully joined the group.' });
  } catch (error: any) {
    logger.error(`Error joining group ${groupId} for user ${userId}:`, error);

    // Check for foreign key violation (PostgreSQL error code '23503')
    if (error.code === '23503') {
      return res.status(400).json({
        message: 'Failed to join group: The user does not exist.',
        detail: `User with ID ${userId} was not found. Please ensure the user is created first.`
      });
    }

    res.status(500).json({ message: 'Failed to join feed group.', detail: error.message });
  }
};

/**
 * Handles a user leaving a feed group.
 */
export const leaveFeedGroup = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;
  const { id } = req.params;
  const groupId = parseInt(id, 10);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User not logged in.' });
  }

  try {
    const group = await feedGroupService.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Feed group not found.' });
    }

    const isMember = await feedGroupService.isMember(groupId, userId);
    if (!isMember) {
      return res.status(400).json({ message: 'You are not a member of this group.' });
    }

    await feedGroupService.leaveGroup(groupId, userId);

    res.status(200).json({ message: 'Successfully left the group.' });
  } catch (error) {
    logger.error(`Error leaving group ${groupId} for user ${userId}:`, error);
    res.status(500).json({ message: 'Failed to leave feed group.' });
  }
};

/**
 * Handles retrieving all members of a feed group.
 */
/**
 * Handles updating a member's role within a group.
 */
export const updateMemberRole = async (req: Request, res: Response) => {
  // @ts-ignore
  const requesterId = req.user?.id;
  const { id: groupIdString, memberId: targetUserId } = req.params;
  const { role: newRole } = req.body;
  const groupId = parseInt(groupIdString, 10);

  if (!requesterId) {
    return res.status(401).json({ message: 'Unauthorized: User not logged in.' });
  }

  if (!newRole) {
    return res.status(400).json({ message: 'Role is required.' });
  }

  // Optional: Add validation for allowed roles
  // const allowedRoles = ['admin', 'moderator', 'member'];
  // if (!allowedRoles.includes(newRole)) {
  //   return res.status(400).json({ message: 'Invalid role specified.' });
  // }

  try {
    // 1. Check if the group exists
    const group = await feedGroupService.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Feed group not found.' });
    }

    // 2. Authorization: Check if the requester is the group creator
    if (group.creator_id !== requesterId) {
      return res.status(403).json({ message: 'Forbidden: Only the group creator can change member roles.' });
    }

    // 3. Update the role
    const updatedMembership = await feedGroupService.updateMemberRole(groupId, targetUserId, newRole);

    res.status(200).json(updatedMembership);
  } catch (error: any) {
    if (error.message === 'Member not found in the specified group.') {
        return res.status(404).json({ message: error.message });
    }
    logger.error(`Error updating role for user ${targetUserId} in group ${groupId}:`, error);
    res.status(500).json({ message: 'Failed to update member role.' });
  }
};

export const getFeedGroupMembers = async (req: Request, res: Response) => {
  const { id } = req.params;
  const groupId = parseInt(id, 10);

  try {
    const group = await feedGroupService.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Feed group not found.' });
    }

    const members = await feedGroupService.getGroupMembers(groupId);
    res.status(200).json(members);
  } catch (error) {
    logger.error(`Error retrieving members for group ${groupId}:`, error);
    res.status(500).json({ message: 'Failed to retrieve group members.' });
  }
};
