import { Router } from 'express';
import * as activityLogsController from '../controllers/activityLogsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', activityLogsController.getAll);
router.get('/:entityType/:entityId', activityLogsController.getByEntity);

export default router;
