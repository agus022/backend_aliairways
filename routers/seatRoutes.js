import express from 'express';
import * as seatController from '../controllers/seatController.js';

const router = express.Router();

router.get('/',seatController.getSeats);
router.post('/',seatController.addSeat);
router.put('/:aircraf_id/:id',seatController.updateSeat);
router.delete('/:aircraf_id/:id',seatController.deleteSeat);
router.get('/:aircraf_id/:id',seatController.getSeatById);


export default router;
