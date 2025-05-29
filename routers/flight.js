import {Router} from 'express';
import * as flightController from '../controllers/flightController.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { checkRole }  from '../middlewares/checkRole.js';

const router=Router();

router.get('/dashboard/kpis',verifyToken,checkRole(['administrator']), flightController.getFlightKPIs);
router.get('/dashboard/current-flights', verifyToken, checkRole(['administrator']), flightController.getCurrentFlightsStatus);
router.get('/dashboard/flights-count',verifyToken,checkRole(['administrator']),flightController.getAllCountFlights);
router.get('/dashboard/flights-over-time', verifyToken, checkRole(['administrator']), flightController.getFlightTotalsOverTime);
router.get('/dashboard/financials', verifyToken, checkRole(['administrator']), flightController.getFinancialSummary);


router.get('/search/flights',flightController.getFlightFull);
router.get('/enriched', flightController.getEnrichedFlights);
router.get('/',flightController.getAllFlights);
router.get('/search/:origin/:destination/:date', flightController.getFlightByOriginAndDestinationAndDate);
router.get('/search/:origin/:destination', flightController.getFlightByOriginAndDestination);
router.get('/search', flightController.getAllFlights);
router.get('/:id',flightController.getFlightById);
router.post('/',verifyToken,checkRole(['administrator']),flightController.createFlight);
router.put('/:id',verifyToken,checkRole(['administrator']),flightController.updateFlight);
router.delete('/:id',verifyToken,checkRole(['administrator']),flightController.deleteFlight);

export default router;