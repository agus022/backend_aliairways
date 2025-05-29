// routes/bucketRoute.js
import { Router } from 'express';
import * as bucketController from '../controllers/bucketController.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = Router();

router.post(
  '/bucketImagen',
  checkRole(['passenger', 'administrator', 'employee']),
  bucketController.imageBucket
);

export default router;
