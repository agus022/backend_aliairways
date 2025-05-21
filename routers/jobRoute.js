import express from 'express';
import * as jobController from '../controllers/jobController.js';
import { checkRole }  from '../middlewares/checkRole.js';


const router = express.Router();

router.get('/',checkRole(['administrator'],['employee']),jobController.getJobs);
router.post('/',checkRole(['administrator']),jobController.createJobs);
router.get('/employees_count',checkRole(['administrator'],['employee']),jobController.getJobsWithEmployees);
router.put('/:id',checkRole(['administrator'],['employee']),jobController.updateJobs);
router.delete('/:id',checkRole(['administrator'],['employe']),jobController.deleteJobs);
router.get('/:id',checkRole(['administrator'],['employee']),jobController.getJobById);


export default router;
