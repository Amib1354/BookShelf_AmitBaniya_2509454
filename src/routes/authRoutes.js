import { Router } from 'express';
import * as AuthController from '../controllers/authController.js';

const router = Router();

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);

export default router;
