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


// Flight search
router.get('/search/flights', flightController.getFlightFull);
router.get('/search', flightController.getAllFlights);
router.get('/search/:origin/:destination/:date', flightController.getFlightByOriginAndDestinationAndDate);
router.get('/search/:origin/:destination', flightController.getFlightByOriginAndDestination);

// Employee
router.get('/employee/flightsNow/:id',verifyToken,  checkRole(['administrator', 'employee']), flightController.getFlightByEmployeNow);
router.get('/employee/flightsAfter/:id',verifyToken, checkRole(['employee']), flightController.getFlightByEmployePosterior);
router.get('/employee/flightsBefore/:id',verifyToken, checkRole(['employee']), flightController.getFlightByEmployeAnteriores);
// General
router.get('/', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);
router.post('/', checkRole(['administrator']), flightController.createFlight);
router.put('/:id', checkRole(['administrator']), flightController.updateFlight);
router.delete('/:id', checkRole(['administrator']), flightController.deleteFlight);

export default router;