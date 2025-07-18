import { Request, Response } from 'express';
import * as proposalsService from '../../../services/proposals.service';
import * as feedGroupService from '../../../services/feedGroups.service';
import logger from '../../../config/logger';

/**
 * Handles the creation of a new governance proposal.
 */
export const createProposal = async (req: Request, res: Response) => {
  // @ts-ignore
  const creatorId = req.user?.id;
  const { id: groupIdString } = req.params;
  const { title, description, durationDays } = req.body;

  if (!creatorId) {
    return res.status(401).json({ message: 'Unauthorized: User not logged in.' });
  }

  if (!title || !description || !durationDays) {
    return res.status(400).json({ message: 'Group ID, title, description, and duration are required.' });
  }

  const groupIdNum = parseInt(groupIdString, 10);
  if (isNaN(groupIdNum)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  try {
    // 1. Verify the group exists
    const group = await feedGroupService.getGroupById(groupIdNum);
    if (!group) {
      return res.status(404).json({ message: 'Feed group not found.' });
    }

    // 2. Authorization: Check if the creator is a member of the group
    const isMember = await feedGroupService.isMember(groupIdNum, creatorId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You must be a member of the group to create a proposal.' });
    }

    // 3. Create the proposal
    const proposalData = { groupId: groupIdNum, creatorId, title, description, durationDays };
    const newProposal = await proposalsService.createProposal(proposalData);

    res.status(201).json(newProposal);
  } catch (error) {
    logger.error(`Error creating proposal for group ${groupIdNum}:`, error);
    res.status(500).json({ message: 'Failed to create proposal.' });
  }
};

/**
 * Handles casting a vote on a proposal.
 */
export const castVote = async (req: Request, res: Response) => {
  // @ts-ignore
  const voterId = req.user?.id;
  const { groupId: groupIdString, proposalId: proposalIdString } = req.params;
  const { voteOption } = req.body; // Expects a boolean: true for 'yes', false for 'no'

  if (!voterId) {
    return res.status(401).json({ message: 'Unauthorized: User not logged in.' });
  }

  if (typeof voteOption !== 'boolean') {
    return res.status(400).json({ message: 'Vote option is required and must be a boolean.' });
  }

  const groupId = parseInt(groupIdString, 10);
  const proposalId = parseInt(proposalIdString, 10);

  try {
    // 1. Verify the proposal exists and is open for voting
    const proposal = await proposalsService.getProposalById(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found.' });
    }
    if (proposal.status !== 'open') {
      return res.status(403).json({ message: 'Voting on this proposal is closed.' });
    }
    if (proposal.group_id !== groupId) {
        return res.status(400).json({ message: 'Proposal does not belong to the specified group.' });
    }

    // 2. Authorization: Check if the voter is a member of the group
    const isMember = await feedGroupService.isMember(groupId, voterId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You must be a member of the group to vote.' });
    }

    // 3. Cast the vote
    const newVote = await proposalsService.castVote(proposalId, voterId, voteOption);
    res.status(201).json(newVote);

  } catch (error: any) {
    // Handle unique constraint violation (user already voted)
    if (error.code === '23505') { // PostgreSQL unique violation error code
      return res.status(409).json({ message: 'You have already voted on this proposal.' });
    }
    logger.error(`Error casting vote on proposal ${proposalId} by user ${voterId || 'unauthenticated'}:`, error);
    res.status(500).json({ message: 'Failed to cast vote.' });
  }
};
