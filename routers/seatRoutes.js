import express from 'express';
import * as seatController from '../controllers/seatController.js';

const router = express.Router();

router.get('/',seatController.getSeats);
router.get('/aircraft/:aircraft_id', seatController.getSeatsByAircraft);
router.get('/available/:aircraft_id', seatController.getAvailableSeats);
router.get('/stats/:aircraft_id', seatController.getSeatAvailabilityStats);
router.get('/class/:aircraft_id/:seat_class', seatController.getSeatsByClass);
router.post('/',seatController.addSeat);
router.put('/:id',seatController.updateSeat);
router.delete('/:id',seatController.deleteSeat);
router.get('/:id',seatController.getSeatById);


export default router;
