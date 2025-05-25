import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { checkRole }  from '../middlewares/checkRole.js';

const router = Router();

router.get('/',checkRole(['administrator']), paymentController.getAllPayments);
router.get('/:id', checkRole(['administrator','passenger']),paymentController.getPaymentById);
router.post('/',checkRole(['administrator','passenger']), paymentController.createPayment);
router.put('/:id',checkRole(['administrator']),paymentController.updatePayment);
router.delete('/:id', checkRole(['administrator']),paymentController.deletePayment);
router.get('/status/:status',checkRole(['administrator',['passenger']]),paymentController.getPaymentsByStatus);
router.get('/count/total',checkRole(['administrator','passenger']),paymentController.getTotalTransactionAmount);

export default router;
