import express from 'express';
import * as luggageController from '../controllers/luggageController.js';

const router = express.Router();

router.get('/',luggageController.getLuggage);
router.post('/',luggageController.createLuggage);
router.put('/:id',luggageController.updateLuggage);
router.delete('/:id',luggageController.deleteLuggage);
router.get('/:id',luggageController.getLuggageById);


export default router;
