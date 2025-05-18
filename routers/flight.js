import {Router} from 'express';
import * as flightController from '../controllers/flightController.js';
import { checkRole }  from '../middlewares/checkRole.js';


const router=Router();
router.get('/',flightController.getAllFlights);
router.get('/search/:origin/:destination/:date', flightController.getFlightByOriginAndDestinationAndDate);
router.get('/search/:origin/:destination', flightController.getFlightByOriginAndDestination);
router.get('/search', flightController.getAllFlights);
router.get('/status/:status',checkRole(['admin']), flightController.getFlightsByStatus);
router.get('/:id',flightController.getFlightById);
router.post('/',checkRole(['admin']),flightController.createFlight);
router.put('/:id',checkRole(['admin']),flightController.updateFlight);
router.delete('/:id',checkRole(['admin']),flightController.deleteFlight);

export default router;