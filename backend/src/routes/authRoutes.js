import { Router } from 'express';
import * as AuthController from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.get('/me', authenticate, AuthController.getCurrentUser);
router.post('/logout', AuthController.logoutUser);

export default router;
