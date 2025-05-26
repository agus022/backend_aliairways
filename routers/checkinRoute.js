import {Router} from 'express';
import * as checkInController from '../controllers/checkInController.js';
import { checkRole } from '../middlewares/checkRole.js';

const router=Router();
router.get('/:id',checkRole(['administrator','passenger']),checkInController.getCheckIn);
router.post('/getData',checkRole(['admin','passenger']),checkInController.getDataFromCheckIn);
router.post('/',checkRole(['passenger']),checkInController.createChekIn);

export default router;
