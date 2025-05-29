import express from 'express';
import * as shiftController from '../controllers/shiftController.js';
import { checkRole }  from '../middlewares/checkRole.js';
import { verifyToken } from '../middlewares/verifyToken.js';
// import { checkRole }  from '../middlewares/checkRole.js';
const router = express.Router();


router.get('/employee/horario/:id',verifyToken,checkRole(['employee','administrator']), shiftController.getShiftByEmployee);
router.get('/',checkRole(['administrator','employee']),shiftController.getShift);
router.get('/:desc',checkRole(['administrator','employee']),shiftController.getShiftsByDesc);
router.get('/:id',checkRole(['administrator','employee']),shiftController.getShiftById);
router.post('/',checkRole(['administrator']),shiftController.createShift);
router.put('/:id',checkRole(['administrator']),shiftController.updateShift);
router.delete('/:id',checkRole(['administrator']),shiftController.deleteShift);


export default router;