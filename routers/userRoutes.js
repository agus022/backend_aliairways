import { Router } from 'express';
import { register, login,getUsers } from '../controllers/userController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/',getUsers);

export default router;
