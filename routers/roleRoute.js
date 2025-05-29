import express from 'express';
import * as roleController from '../controllers/roleController.js';
import { checkRole }  from '../middlewares/checkRole.js';
import { verifyToken } from '../middlewares/verifyToken.js';
const router = express.Router();

router.get('/search', verifyToken, checkRole(['administrator']), roleController.searchRolesByName);

router.get('/',verifyToken, checkRole(['administrator']),roleController.getRoles);
router.post('/',verifyToken, checkRole(['administrator']),roleController.createRole);
router.put('/:id',verifyToken, checkRole(['administrator']),roleController.updateRole);
router.delete('/:id',verifyToken, checkRole(['administrator']),roleController.deleteRole);
router.get('/:id',verifyToken, checkRole(['administrator']),roleController.getRolById);

export default router;
