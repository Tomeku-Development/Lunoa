import { Router } from 'express';
import { createFeedGroup, getAllFeedGroups, getFeedGroupById, updateFeedGroup, deleteFeedGroup, joinFeedGroup, leaveFeedGroup, getFeedGroupMembers, updateMemberRole } from './feedGroups.controller';
import { protect } from '../../../middleware/auth.middleware';
import proposalsRouter from '../proposals/proposals.routes';
import treasuryRouter from '../treasury/treasury.routes';
import questsRouter from '../quests/quests.routes';


const router = Router();

/**
 * @route   POST /api/v1/feed-groups
 * @desc    Create a new feed group
 * @access  Private
 */
router.post('/', protect, createFeedGroup);

/**
 * @route   GET /api/v1/feed-groups
 * @desc    Get all feed groups
 * @access  Public
 */
router.get('/', getAllFeedGroups);

/**
 * @route   GET /api/v1/feed-groups/:id
 * @desc    Get a single feed group by ID
 * @access  Public
 */
router.get('/:id', getFeedGroupById);

/**
 * @route   PUT /api/v1/feed-groups/:id
 * @desc    Update a feed group
 * @access  Private (only creator)
 */
router.put('/:id', protect, updateFeedGroup);

/**
 * @route   DELETE /api/v1/feed-groups/:id
 * @desc    Delete a feed group
 * @access  Private (only creator)
 */
router.delete('/:id', protect, deleteFeedGroup);

/**
 * @route   POST /api/v1/feed-groups/:id/join
 * @desc    Join a feed group
 * @access  Private
 */
router.post('/:id/join', protect, joinFeedGroup);

/**
 * @route   POST /api/v1/feed-groups/:id/leave
 * @desc    Leave a feed group
 * @access  Private
 */
router.post('/:id/leave', protect, leaveFeedGroup);

/**
 * @route   GET /api/v1/feed-groups/:id/members
 * @desc    Get all members of a feed group
 * @access  Public
 */
router.get('/:id/members', getFeedGroupMembers);

/**
 * @route   PATCH /api/v1/feed-groups/:id/members/:memberId
 * @desc    Update a member's role in a group
 * @access  Private
 */
router.patch('/:id/members/:memberId', protect, updateMemberRole);

// Delegate proposal-related routes to the proposals router
router.use('/:groupId/proposals', proposalsRouter);

// Delegate treasury-related routes to the treasury router
router.use('/:groupId/treasury', treasuryRouter);

// Delegate quest-related routes to the quests router
router.use('/:groupId/quests', questsRouter);

export default router;
