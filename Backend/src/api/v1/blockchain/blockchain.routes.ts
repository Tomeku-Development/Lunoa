import { Router } from 'express';
import { protect } from '../../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Blockchain
 *   description: Blockchain transaction and interaction endpoints
 */

/**
 * @swagger
 * /api/v1/blockchain/status:
 *   get:
 *     summary: Get blockchain connection status
 *     tags: [Blockchain]
 *     responses:
 *       200:
 *         description: Blockchain status information
 */
router.get('/status', (req, res) => {
  res.json({ 
    status: 'connected',
    network: 'testnet',
    message: 'Blockchain endpoints coming soon'
  });
});

/**
 * @swagger
 * /api/v1/blockchain/gas-estimate:
 *   get:
 *     summary: Get gas fee estimates
 *     tags: [Blockchain]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gas fee estimates
 */
router.get('/gas-estimate', protect, (req, res) => {
  res.json({ 
    message: 'Gas estimation endpoint coming soon',
    standard: 1000,
    fast: 1500,
    instant: 2000
  });
});

export default router;
