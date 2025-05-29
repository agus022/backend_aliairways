import {Router} from 'express';
import * as aircraftController from '../controllers/aircraftController.js';

const router=Router();
router.get('/search/:model',aircraftController.searchAircraftByModel);

router.get('/',aircraftController.getAllAircrafts);
router.get('/count_aircraft',aircraftController.getAircraftCount);

router.post('/',aircraftController.createAircraft);
router.get('/:id',aircraftController.getAircraftById);
router.put('/:id',aircraftController.updateAircraft);
router.delete('/:id',aircraftController.deleteAircraft);

export default router;