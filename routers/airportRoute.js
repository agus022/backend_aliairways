import {Router} from 'express';
import * as airportController from '../controllers/airportController.js';

const router=Router();

router.get('/',airportController.getAllAirports);
router.get('/:id',airportController.getAirportById);
router.get('/code/:code',airportController.getAirportByCode);
router.get('/city/:city',airportController.getAirportsByCity);
router.get('/count/by-city',airportController.getAirportCountByCity);
router.post('/',airportController.createAirport);
router.put('/:id',airportController.updateAirport);
router.delete('/:id',airportController.deleteAirport);

export default router;