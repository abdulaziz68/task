import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is healthy' });
});

router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

export default router;
