import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateLogin, validateRegistration } from '../middleware/validateAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/register', validateRegistration, asyncHandler(authController.register));
router.post('/login', validateLogin, asyncHandler(authController.login));
router.get('/me', asyncHandler(authenticate), authController.getMe);

export default router;
