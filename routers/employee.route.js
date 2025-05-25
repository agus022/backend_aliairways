import express from 'express';
import { getEmployees,getEmployeeById,addEmployee,deleteEmployee,updateEmployee, getEmployeesByJob } from '../controllers/employee.controller.js';
import { checkRole }  from '../middlewares/checkRole.js';


const router = express.Router();

router.get('/',getEmployees);
router.get('/:job_id',getEmployeesByJob);
router.get('/:id',checkRole(['administrator','employee']),getEmployeeById);
router.post('/',checkRole(['administrator']),addEmployee);
router.put('/:id',checkRole(['administrator']),updateEmployee);
router.delete('/:id',checkRole(['administrator']),deleteEmployee);


export default router;