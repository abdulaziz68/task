import { Router } from 'express';
import * as tasksController from '../controllers/tasksController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', tasksController.getAll);
router.get('/:id', tasksController.getById);
router.get('/:id/linked', tasksController.getLinkedItems);
router.post('/', tasksController.create);
router.put('/:id', tasksController.update);
router.delete('/:id', tasksController.remove);

export default router;
