import express from 'express';
import * as shiftController from '../controllers/shiftController.js';
import { checkRole }  from '../middlewares/checkRole.js';
// import { checkRole }  from '../middlewares/checkRole.js';
const router = express.Router();

router.get('/',checkRole(['admin','employee']),shiftController.getShift);
router.get('/:desc',checkRole(['admin','employee']),shiftController.getShiftsByDesc);
router.get('/:id',checkRole(['admin','employee']),shiftController.getShiftById);
router.post('/',checkRole(['admin']),shiftController.createShift);
router.put('/:id',checkRole(['admin']),shiftController.updateShift);
router.delete('/:id',checkRole(['admin']),shiftController.deleteShift);


export default router;