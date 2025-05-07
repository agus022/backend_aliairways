import {Router} from 'express';
import * as flightController from '../controllers/flightController.js';

const router=Router();

router.get('/search/:origin/:destination/:date', flightController.getFlightByOriginAndDestinationAndDate);
router.get('/search/:origin/:destination', flightController.getFlightByOriginAndDestination);
router.get('/search', flightController.getAllFlights);
router.get('/:id',flightController.getFlightById);
router.post('/',flightController.createFlight);
router.put('/:id',flightController.updateFlight);
router.delete('/:id',flightController.deleteFlight);

export default router;