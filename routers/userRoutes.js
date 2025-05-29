import { Router } from 'express';
import { register, login,getUsers,getProfile,updateUser,deleteUser,searchUserByEmail } from '../controllers/userController.js';
import { checkRole }  from '../middlewares/checkRole.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = Router();
router.get('/',getUsers);
router.get('/search',verifyToken, checkRole(['administrator']),searchUserByEmail);
router.put('/:id',verifyToken, checkRole(['administrator']),updateUser);
router.delete('/:id',verifyToken, checkRole(['administrator']),deleteUser);
router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id',getProfile)


export default router;
