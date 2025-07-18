import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import mediaRoutes from './media/media.routes';
import usersRoutes from './users/users.routes';

import vibesRoutes from './vibes/vibes.routes';
import feedGroupsRoutes from './feed-groups/feedGroups.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

router.use('/media', mediaRoutes);
router.use('/vibes', vibesRoutes);
router.use('/feed-groups', feedGroupsRoutes);

export default router;
