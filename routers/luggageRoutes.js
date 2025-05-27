import express from 'express';
import * as luggageController from '../controllers/luggageController.js';

import { checkRole }  from '../middlewares/checkRole.js';

const router = express.Router();

router.get('/',checkRole(['administrator','employee','passenger']),luggageController.getLuggage);
router.post('/',checkRole(['administrator','passenger']),luggageController.createLuggage);
router.put('/:id',checkRole(['administrator','passenger']),luggageController.updateLuggage);
router.delete('/:id',checkRole(['administrator']),luggageController.deleteLuggage);
router.get('/:id',checkRole(['administrator','employee','passenger']),luggageController.getLuggageById);


export default router;
