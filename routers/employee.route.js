import express from 'express';
import { getEmployees,getEmployeeById,addEmployee,deleteEmployee,updateEmployee, getEmployeesByJob } from '../controllers/employee.controller.js';
import { checkRole }  from '../middlewares/checkRole.js';


const router = express.Router();

router.get('/',getEmployees);
router.get('/:job_id',getEmployeesByJob);
router.get('/:id',checkRole(['admin'],['employee']),getEmployeeById);
router.post('/',checkRole(['admin']),addEmployee);
router.put('/:id',checkRole(['admin']),updateEmployee);
router.delete('/:id',checkRole(['admin']),deleteEmployee);


export default router;