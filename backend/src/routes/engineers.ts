import { Router } from 'express';
import * as engineersController from '../controllers/engineersController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', engineersController.getAll);
router.get('/:id', engineersController.getById);
router.post('/', engineersController.create);
router.put('/:id', engineersController.update);
router.delete('/:id', engineersController.remove);

export default router;
