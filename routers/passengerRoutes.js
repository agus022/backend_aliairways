import {Router} from 'express';
import * as passengerController from '../controllers/passengerController.js';

import { checkRole }  from '../middlewares/checkRole.js';

const router=Router();
router.get('/',checkRole(['admin'],['user'],['employee']),passengerController.getPassengers);
router.get('/:id',checkRole(['admin'],['user'],['employee']),passengerController.getPassengerById);
router.post('/',checkRole(['admin'],['user'],['employee']),passengerController.addPassenger);
router.put('/:id',checkRole(['admin'],['user'],['employee']),passengerController.updatePassenger);
router.delete('/:id',checkRole(['admin'],['user'],['employee']),passengerController.deletePasanger);
export default router;