import express from 'express';
import * as jobController from '../controllers/jobController.js';

const router = express.Router();

router.get('/',jobController.getJobs);
router.post('/',jobController.createJobs);
router.get('/employees_count',jobController.getJobsWithEmployees);
router.put('/:id',jobController.updateJobs);
router.delete('/:id',jobController.deleteJobs);
router.get('/:id',jobController.getJobById);


export default router;
