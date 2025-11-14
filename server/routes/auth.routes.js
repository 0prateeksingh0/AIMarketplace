/**
 * Authentication Routes
 */

import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { userValidation } from '../middleware/validation.js';
import { protect } from '../middleware/auth.js';
import { authLimiter, createAccountLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes with rate limiting
router.post('/register', createAccountLimiter, userValidation.register, authController.register);
router.post('/login', authLimiter, userValidation.login, authController.login);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);

export default router;

