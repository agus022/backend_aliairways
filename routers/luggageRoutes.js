import express from 'express';
import * as luggageController from '../controllers/luggageController.js';

import { checkRole }  from '../middlewares/checkRole.js';

const router = express.Router();

router.get('/',checkRole(['admin'],['employee'],['user']),luggageController.getLuggage);
router.post('/',checkRole(['admin'],['user']),luggageController.createLuggage);
router.put('/:id',checkRole(['admin'],['user']),luggageController.updateLuggage);
router.delete('/:id',checkRole(['admin']),luggageController.deleteLuggage);
router.get('/:id',checkRole(['admin'],['employee'],['user']),luggageController.getLuggageById);


export default router;
