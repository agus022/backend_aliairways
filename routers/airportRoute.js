import {Router} from 'express';
import * as airportController from '../controllers/airportController.js';
import { checkRole }  from '../middlewares/checkRole.js';


const router=Router();

router.get('/',airportController.getAllAirports);
router.get('/:id',airportController.getAirportById);
router.get('/code/:code',airportController.getAirportByCode);
router.get('/city/:city',airportController.getAirportsByCity);
router.get('/count/by-city',airportController.getAirportCountByCity);
router.post('/',checkRole(['administrator']),airportController.createAirport);
router.put('/:id',checkRole(['administrator']),airportController.updateAirport);
router.delete('/:id',checkRole(['administrator']),airportController.deleteAirport);

export default router;