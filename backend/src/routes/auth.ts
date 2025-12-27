import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authController.getCurrentUser);

export default router;
