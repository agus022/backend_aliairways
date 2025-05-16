import {Router} from 'express';
import * as airportController from '../controllers/airportController.js';
import { checkRole }  from '../middlewares/checkRole.js';


const router=Router();

router.get('/',airportController.getAllAirports);
router.get('/:id',airportController.getAirportById);
router.get('/code/:code',airportController.getAirportByCode);
router.get('/city/:city',airportController.getAirportsByCity);
router.get('/count/by-city',airportController.getAirportCountByCity);
router.post('/',checkRole(['admin']),airportController.createAirport);
router.put('/:id',checkRole(['admin']),airportController.updateAirport);
router.delete('/:id',checkRole(['admin']),airportController.deleteAirport);

export default router;