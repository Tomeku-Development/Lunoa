import { Router, Request, Response } from 'express';
import { protect } from '../../../middleware/auth.middleware';
import {
  getTokenBalance,
  getTokenTransactionHistory,
  getTokenStatistics,
  getStakingInfo,
  getTopTokenHolders
} from '../../../services/tokenEconomy.service';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tokens
 *   description: Token economy and transaction management endpoints
 */

/**
 * @swagger
 * /api/v1/tokens/balance/{address}:
 *   get:
 *     summary: Get token balance for a wallet address
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet address
 *     responses:
 *       200:
 *         description: Token balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                     balance:
 *                       type: number
 *                     lockedBalance:
 *                       type: number
 *                     availableBalance:
 *                       type: number
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Internal server error
 */
router.get('/balance/:address', protect, async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const balance = await getTokenBalance(address);
    
    res.json({
      success: true,
      data: balance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve token balance',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/v1/tokens/history/{address}:
 *   get:
 *     summary: Get token transaction history for an address
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet address
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of transactions to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of transactions to skip
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [quest_reward, quest_payment, vibe_boost, transfer, staking_reward, governance_reward, system_mint, marketplace_purchase]
 *         description: Filter by transaction type
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           from:
 *                             type: string
 *                           to:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           type:
 *                             type: string
 *                           status:
 *                             type: string
 *                           description:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           direction:
 *                             type: string
 *                     totalCount:
 *                       type: integer
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.get('/history/:address', protect, async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const type = req.query.type as any;
    
    const result = await getTokenTransactionHistory(address, limit, offset, type);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transaction history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/v1/tokens/statistics:
 *   get:
 *     summary: Get platform token statistics
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCirculation:
 *                       type: number
 *                     totalRewards:
 *                       type: number
 *                     activeAddresses:
 *                       type: integer
 *                     volume30d:
 *                       type: number
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.get('/statistics', protect, async (req: Request, res: Response) => {
  try {
    const stats = await getTokenStatistics();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve token statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/v1/tokens/staking/{address}:
 *   get:
 *     summary: Get staking information for an address
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet address
 *     responses:
 *       200:
 *         description: Staking information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                     stakedAmount:
 *                       type: number
 *                     rewards:
 *                       type: number
 *                     stakingPeriod:
 *                       type: integer
 *                     lastRewardClaim:
 *                       type: string
 *                       format: date-time
 *                     apy:
 *                       type: number
 *       401:
 *         description: Not authorized
 *       404:
 *         description: No staking position found
 *       500:
 *         description: Internal server error
 */
router.get('/staking/:address', protect, async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const stakingInfo = await getStakingInfo(address);
    
    if (!stakingInfo) {
      return res.status(404).json({
        success: false,
        message: 'No staking position found for this address'
      });
    }
    
    res.json({
      success: true,
      data: stakingInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve staking information',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/v1/tokens/top-holders:
 *   get:
 *     summary: Get top token holders
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top holders to retrieve
 *     responses:
 *       200:
 *         description: Top token holders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                       balance:
 *                         type: number
 *                       lastUpdated:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.get('/top-holders', protect, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const topHolders = await getTopTokenHolders(limit);
    
    res.json({
      success: true,
      data: topHolders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve top token holders',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
