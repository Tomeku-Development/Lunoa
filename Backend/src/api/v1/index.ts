import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import mediaRoutes from './media/media.routes';
import usersRoutes from './users/users.routes';
import questRoutes from './quests/quests.routes';
import vibesRoutes from './vibes/vibes.routes';
import feedGroupsRoutes from './feed-groups/feedGroups.routes';
import treasuryRoutes from './treasury/treasury.routes';
import proposalsRoutes from './proposals/proposals.routes';
import blockchainRoutes from './blockchain/blockchain.routes';
import analyticsRoutes from './analytics/analytics.routes';
import notificationsRoutes from './notifications/notifications.routes';
import tokensRoutes from './tokens/tokens.routes';

const router = Router();

// Core authentication and user management
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

// Quest and activity management
router.use('/quests', questRoutes);
router.use('/feed-groups', feedGroupsRoutes);

// Token economy and blockchain
router.use('/tokens', tokensRoutes);
router.use('/blockchain', blockchainRoutes);
router.use('/treasury', treasuryRoutes);

// Content and media
router.use('/media', mediaRoutes);
router.use('/vibes', vibesRoutes);

// Governance and proposals
router.use('/proposals', proposalsRoutes);

// Dashboard and platform features
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationsRoutes);

export default router;
