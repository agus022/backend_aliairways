import express from 'express';
import * as seatController from '../controllers/seatController.js';
import { checkRole }  from '../middlewares/checkRole.js';
const router = express.Router();

router.get('/seats/:aircraft_id',seatController.getSeatsByAircraft)
router.get('/available/:aircraft_id', seatController.getAvailableSeats);
router.get('/stats/:aircraft_id', seatController.getSeatAvailabilityStats);
router.get('/class/:aircraft_id/:seat_class', seatController.getSeatsByClass);

router.put('/updateSeatReservation/:reservation_id',checkRole(['administrator','passenger']),seatController.updateSeatsByReservation);
router.get('/',checkRole(['administrator','emmployee','passenger']),seatController.getSeats);
router.post('/',checkRole(['administrator','emmployee','passenger']),seatController.addSeat);
router.put('/:aircraft_id/:id',checkRole(['administrator','emmployee','passenger']),seatController.updateSeat);
router.delete('/:aircraft_id/:id',checkRole(['administrator','emmployee','passenger']),seatController.deleteSeat);
router.get('/getSeatFlight/:flight_id',seatController.getSeatsByFlight);
router.get('/:aircraf_id/:id',checkRole(['administrator','emmployee','passenger']),seatController.getSeatById);





export default router;
