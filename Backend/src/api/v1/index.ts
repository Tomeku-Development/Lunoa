import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import usersRoutes from './users/users.routes';
import questsRoutes from './quests/quests.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/quests', questsRoutes);

export default router;
