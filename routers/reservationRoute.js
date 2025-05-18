import {Router} from 'express';
import * as reservationController from '../controllers/reservationController.js';
import { checkRole }  from '../middlewares/checkRole.js';


const router=Router();
router.get('/',checkRole(['admin'],['user'],['employee']),reservationController.getAllReservations);
router.get('/verify-seat',reservationController.isSeatTaken);
router.get('/:flight_id',reservationController.getPassagersByIdFlight);
router.get('/passenger/:passenger_id')
router.get('/:id',checkRole(['admin'],['user'],['employee']),reservationController.getReservationById);
router.post('/',checkRole(['admin'],['user'],['employee']),reservationController.createReservation);
router.put('/:id',checkRole(['admin'],['user'],['employee']),reservationController.updateReservation);
router.delete('/:id',checkRole(['admin'],['user'],['employee']),reservationController.deleteReservation);
export default router;