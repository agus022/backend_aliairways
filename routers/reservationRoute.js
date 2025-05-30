import {Router} from 'express';
import * as reservationController from '../controllers/reservationController.js';
import { checkRole }  from '../middlewares/checkRole.js';


const router=Router();
router.post('/crear_reservacion',checkRole(['passenger','administrator']),reservationController.reservacionTransaccion);

router.get('/',checkRole(['administrator','passenger','employee']),reservationController.getAllReservations);
router.get('/verify-seat',reservationController.isSeatTaken);
router.get('/:flight_id',reservationController.getPassagersByIdFlight);
router.get('/passenger/:passenger_id',reservationController.getReservationsByPassenger);
router.get('/:id',checkRole(['administrator','passenger','employee']),reservationController.getReservationById);
router.post('/',checkRole(['administrator','passenger','employee']),reservationController.createReservation);
router.put('/:id',checkRole(['administrator','passenger','employee']),reservationController.updateReservation);
router.delete('/:id',checkRole(['administrator','passenger','employee']),reservationController.deleteReservation);
router.get('/reservationsByUser/:user_id',checkRole(['administrator','passenger']),reservationController.getReservationsByUser);
router.get('/cancelReservation/:id',checkRole(['administrator','passenger']),reservationController.cancelReservation);
export default router;