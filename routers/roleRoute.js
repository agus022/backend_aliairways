import express from 'express';
import * as roleController from '../controllers/roleController.js';

const router = express.Router();

router.get('/',roleController.getRoles);
router.post('/',roleController.createRole);
router.put('/:id',roleController.updateRole);
router.delete('/:id',roleController.deleteRole);
router.get('/:id',roleController.getRolById);


export default router;
