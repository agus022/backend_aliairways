import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { checkRole }  from '../middlewares/checkRole.js';

const router = Router();

router.get('/',checkRole(['admin']), paymentController.getAllPayments);
router.get('/:id', checkRole(['admin'],['user']),paymentController.getPaymentById);
router.post('/',checkRole(['admin'],['user']), paymentController.createPayment);
router.put('/:id',checkRole(['admin']),paymentController.updatePayment);
router.delete('/:id', checkRole(['admin']),paymentController.deletePayment);
router.get('/status/:status',checkRole(['admin',['user']]),paymentController.getPaymentsByStatus);
router.get('/count/total',checkRole(['admin'],['user']),paymentController.getTotalTransactionAmount);

export default router;
