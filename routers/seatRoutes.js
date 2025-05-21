import express from 'express';
import * as seatController from '../controllers/seatController.js';
import { checkRole }  from '../middlewares/checkRole.js';
const router = express.Router();

router.get('/seats/:aircraft_id',seatController.getSeatsByAircraft)
router.get('/available/:aircraft_id', seatController.getAvailableSeats);
router.get('/stats/:aircraft_id', seatController.getSeatAvailabilityStats);
router.get('/class/:aircraft_id/:seat_class', seatController.getSeatsByClass);


router.get('/',checkRole(['administrator'],['emmployee'],['passenger']),seatController.getSeats);
router.post('/',checkRole(['administrator'],['emmployee'],['passenger']),seatController.addSeat);
router.put('/:aircraf_id/:id',checkRole(['administrator'],['emmployee'],['passenger']),seatController.updateSeat);
router.delete('/:aircraf_id/:id',checkRole(['administrator'],['emmployee'],['passenger']),seatController.deleteSeat);
router.get('/:aircraf_id/:id',checkRole(['administrator'],['emmployee'],['passenger']),seatController.getSeatById);



export default router;
