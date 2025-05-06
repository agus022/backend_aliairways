import express from 'express';
import { getEmployees,getEmployeeById,addEmployee } from '../controllers/employee.controller.js';

const router = express.Router();

router.get('/',getEmployees);
router.get('/:id',getEmployeeById);
router.post('/',addEmployee);


export default router;