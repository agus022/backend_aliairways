import express from 'express';
import * as payrollController from '../controllers/payrollController.js';
import { checkRole }  from '../middlewares/checkRole.js';
const router = express.Router();

router.get('/dataEmployee/:id',checkRole(['administrator','employee']),payrollController.getDataByEmployee);
router.get('/payrollsByEmployee/:id',checkRole(['administrator','employee']),payrollController.getPayrollByEmployee);


export default router;