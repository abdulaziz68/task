import { Router } from 'express';
import * as notificationsController from '../controllers/notificationsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', notificationsController.getAll);
router.get('/unread-count', notificationsController.getUnreadCount);
router.put('/:id/read', notificationsController.markAsRead);
router.put('/read-all', notificationsController.markAllAsRead);
router.delete('/:id', notificationsController.remove);

export default router;
