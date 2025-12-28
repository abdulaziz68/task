import { Router } from 'express';
import * as shopDrawingsController from '../controllers/shopDrawingsController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticateToken);

router.get('/', shopDrawingsController.getAll);
router.get('/:id', shopDrawingsController.getById);
router.post('/', upload.single('file'), shopDrawingsController.create);
router.put('/:id', upload.single('file'), shopDrawingsController.update);
router.delete('/:id', shopDrawingsController.remove);
router.get('/:id/download', shopDrawingsController.downloadFile);

export default router;
