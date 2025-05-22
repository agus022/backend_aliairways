import { Router } from 'express';
import { sendEmail } from '../controllers/emailController.js';
import { checkRole }  from '../middlewares/checkRole.js';

const router = Router();

router.post('/send',checkRole(['administrator']), sendEmail);

export default router;
