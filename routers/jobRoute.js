import express from 'express';
import * as jobController from '../controllers/jobController.js';
import { checkRole }  from '../middlewares/checkRole.js';


const router = express.Router();

router.get('/',checkRole(['admin'],['employee']),jobController.getJobs);
router.post('/',checkRole(['admin']),jobController.createJobs);
router.get('/employees_count',checkRole(['admin'],['employee']),jobController.getJobsWithEmployees);
router.put('/:id',checkRole(['admin'],['employee']),jobController.updateJobs);
router.delete('/:id',checkRole(['admin'],['employe']),jobController.deleteJobs);
router.get('/:id',checkRole(['admin'],['employee']),jobController.getJobById);


export default router;
