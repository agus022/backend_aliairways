import {Router} from 'express';
import * as aircraftController from '../controllers/aircraftController.js';

const router=Router();

router.get('/',aircraftController.getAllAircrafts);

export default router;