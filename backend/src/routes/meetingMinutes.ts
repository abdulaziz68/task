import { Router } from 'express';
import * as meetingMinutesController from '../controllers/meetingMinutesController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticateToken);

router.get('/', meetingMinutesController.getAll);
router.get('/:id', meetingMinutesController.getById);
router.post('/', upload.array('files', 10), meetingMinutesController.create);
router.put('/:id', meetingMinutesController.update);
router.delete('/:id', meetingMinutesController.remove);
router.post('/:id/attachments', upload.single('file'), meetingMinutesController.addAttachment);
router.delete('/attachments/:attachmentId', meetingMinutesController.deleteAttachment);
router.get('/attachments/:attachmentId/download', meetingMinutesController.downloadAttachment);

export default router;
