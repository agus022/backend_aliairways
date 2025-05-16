import express from 'express';
import * as seatController from '../controllers/seatController.js';
import { checkRole }  from '../middlewares/checkRole.js';
const router = express.Router();

router.get('/',checkRole(['admin'],['emmployee'],['user']),seatController.getSeats);
router.post('/',checkRole(['admin'],['emmployee'],['user']),seatController.addSeat);
router.put('/:aircraf_id/:id',checkRole(['admin'],['emmployee'],['user']),seatController.updateSeat);
router.delete('/:aircraf_id/:id',checkRole(['admin'],['emmployee'],['user']),seatController.deleteSeat);
router.get('/:aircraf_id/:id',checkRole(['admin'],['emmployee'],['user']),seatController.getSeatById);


export default router;
