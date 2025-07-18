import { Request, Response } from 'express';
import * as treasuryService from '../../../services/treasury.service';
import * as feedGroupService from '../../../services/feedGroups.service';
import logger from '../../../config/logger';

/**
 * @route   POST /api/v1/feed-groups/:groupId/treasury/deposit
 * @desc    Deposit funds into the group's treasury
 * @access  Private (requires authentication and group membership)
 */
export const depositToTreasury = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;
  const { groupId: groupIdString } = req.params;
  const { amount, description } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User not logged in.' });
  }


  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'A valid positive amount is required.' });
  }

  const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  try {
    // 1. Verify the user is a member of the group
    const isMember = await feedGroupService.isMember(groupId, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this group.' });
    }

    // 2. Perform the deposit
    const depositPayload: treasuryService.DepositPayload = { groupId, userId, amount, description };
    const newTransaction = await treasuryService.depositToTreasury(depositPayload);

    res.status(201).json(newTransaction);
  } catch (error) {
    logger.error(`Error in depositToTreasury controller for group ${groupId}:`, error);
    res.status(500).json({ message: 'Failed to process deposit.' });
  }
};

/**
 * @route   GET /api/v1/feed-groups/:groupId/treasury
 * @desc    Get the treasury balance and transaction history for a group
 * @access  Private (requires group membership)
 */
export const getTreasuryDetails = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user?.id;
  const { groupId: groupIdString } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User not logged in.' });
  }

  const groupId = parseInt(groupIdString, 10);
  if (isNaN(groupId)) {
    return res.status(400).json({ message: 'Invalid Group ID.' });
  }

  try {
    // 1. Verify the user is a member of the group
    const isMember = await feedGroupService.isMember(groupId, userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Forbidden: You are not a member of this group.' });
    }

    // 2. Fetch balance and transactions in parallel
    const [balance, transactions] = await Promise.all([
      treasuryService.getTreasuryBalance(groupId),
      treasuryService.getTreasuryTransactions(groupId),
    ]);

    res.status(200).json({ balance, transactions });
  } catch (error) {
    logger.error(`Error in getTreasuryDetails controller for group ${groupId}:`, error);
    res.status(500).json({ message: 'Failed to retrieve treasury details.' });
  }
};
