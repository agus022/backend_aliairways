import { Router } from 'express';
import { register, login,getUsers,getProfile } from '../controllers/userController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id',getProfile)
router.get('/',getUsers);

export default router;
