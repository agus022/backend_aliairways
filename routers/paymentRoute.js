import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';


const router = Router();

router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/', paymentController.createPayment);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);
router.get('/status/:status',paymentController.getPaymentsByStatus);
router.get('/count/total',paymentController.getTotalTransactionAmount);

export default router;
