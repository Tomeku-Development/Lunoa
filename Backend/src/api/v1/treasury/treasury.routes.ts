import { Router } from 'express';
import { protect } from '../../../middleware/auth.middleware';
import { depositToTreasury, getTreasuryDetails } from './treasury.controller';

const router = Router({ mergeParams: true });

/**
 * @route   POST /api/v1/feed-groups/:groupId/treasury/deposit
 * @desc    Deposit funds into the group's treasury
 * @access  Private
 */
router.post('/deposit', protect, depositToTreasury);

/**
 * @route   GET /api/v1/feed-groups/:groupId/treasury
 * @desc    Get treasury details for a group
 * @access  Private
 */
router.get('/', protect, getTreasuryDetails);

export default router;
