import { Router } from 'express';
import * as rfisController from '../controllers/rfisController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticateToken);

router.get('/', rfisController.getAll);
router.get('/:id', rfisController.getById);
router.post('/', upload.array('files', 10), rfisController.create);
router.put('/:id', rfisController.update);
router.delete('/:id', rfisController.remove);
router.post('/:id/attachments', upload.single('file'), rfisController.addAttachment);
router.delete('/attachments/:attachmentId', rfisController.deleteAttachment);
router.get('/attachments/:attachmentId/download', rfisController.downloadAttachment);

export default router;
