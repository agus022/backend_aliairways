import {Router} from 'express';
import * as passengerController from '../controllers/passengerController.js';

const router=Router();
router.get('/',passengerController.getPassengers);
router.get('/:id',passengerController.getPassengerById);
router.post('/',passengerController.addPassenger);
router.put('/:id',passengerController.updatePassenger);
router.delete('/:id',passengerController.deletePasanger);
export default router;