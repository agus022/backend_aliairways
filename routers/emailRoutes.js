import { Router } from 'express';
import { sendEmail } from '../controllers/emailController.js';
import { checkRole }  from '../middlewares/checkRole.js';

const router = Router();

router.post('/send',checkRole(['admin']), sendEmail);

export default router;
