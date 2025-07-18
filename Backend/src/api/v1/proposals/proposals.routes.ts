import { Router } from 'express';
import { createProposal, castVote } from './proposals.controller';
import { protect } from '../../../middleware/auth.middleware';

const router = Router({ mergeParams: true });

/**
 * @route   POST /api/v1/feed-groups/:groupId/proposals
 * @desc    Create a new proposal in a group
 * @access  Private
 */
router.post('/', protect, createProposal);

/**
 * @route   POST /api/v1/feed-groups/:groupId/proposals/:proposalId/vote
 * @desc    Cast a vote on a proposal
 * @access  Private
 */
router.post('/:proposalId/vote', protect, castVote);

export default router;
