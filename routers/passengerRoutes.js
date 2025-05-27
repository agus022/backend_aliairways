import {Router} from 'express';
import * as passengerController from '../controllers/passengerController.js';

import { checkRole }  from '../middlewares/checkRole.js';

const router=Router();
router.get('/dashboard/kpis',checkRole(['administrator']), passengerController.getPassengerStats);
router.get('/dashboard/passenger-by-class',checkRole(['administrator']), passengerController.getPassengerCountByClass);
router.get('/dashboard/passenger-count',checkRole(['administrator']), passengerController.getPassengerCount);

router.get('/',checkRole(['administrator','passenger','employee']),passengerController.getPassengers);
router.get('/:id',checkRole(['administrator','passenger','employee']),passengerController.getPassengerById);
router.get('/:name_passport',checkRole(['administrator','employee']),passengerController.searchPassengers);
router.post('/',checkRole(['administrator','passenger','employee']),passengerController.addPassenger);
router.put('/:id',checkRole(['administrator','passenger']),passengerController.updatePassenger);
router.delete('/:id',checkRole(['administrator','passenger','employee']),passengerController.deletePasanger);
router.get('/historial/:id',checkRole(['passenger']),passengerController.getHistorial);
router.get('/historialFlights/:id',checkRole(['passenger']),passengerController.getFlights);
export default router;