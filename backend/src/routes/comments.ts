import { Router } from 'express';
import * as commentsController from '../controllers/commentsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/:entityType/:entityId', commentsController.getByEntity);
router.post('/', commentsController.create);
router.put('/:id', commentsController.update);
router.delete('/:id', commentsController.remove);

export default router;
