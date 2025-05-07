import express from 'express';
import { getEmployees,getEmployeeById,addEmployee,deleteEmployee,updateEmployee } from '../controllers/employee.controller.js';

const router = express.Router();

router.get('/',getEmployees);
router.get('/:id',getEmployeeById);
router.post('/',addEmployee);
router.put('/:id',updateEmployee);
router.delete('/:id',deleteEmployee);


export default router;