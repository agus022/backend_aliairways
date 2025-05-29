import { Router } from 'express';
import { sendEmail,sendEmailWithReservation } from '../controllers/emailController.js';
import { checkRole }  from '../middlewares/checkRole.js';

const router = Router();

router.post('/send',checkRole(['administrator']), sendEmail);
router.post('/sendReservation/:id',checkRole(['administrator','employee','passenger']), sendEmailWithReservation);

export default router;
