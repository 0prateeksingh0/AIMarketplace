/**
 * Authentication Routes
 * 
 * Secure authentication endpoints with rate limiting
 */

import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { userValidation, validate } from '../middleware/validation.js';
import { protect } from '../middleware/auth.js';
import { authLimiter, createAccountLimiter } from '../middleware/rateLimiter.js';
import { body } from 'express-validator';

const router = express.Router();

/**
 * Public routes with rate limiting
 */

// Registration
router.post(
  '/register',
  createAccountLimiter,
  userValidation.register,
  authController.register
);

// Login
router.post(
  '/login',
  authLimiter,
  userValidation.login,
  authController.login
);

// Refresh token
router.post('/refresh', authController.refreshToken);

// Forgot password
router.post(
  '/forgot-password',
  authLimiter,
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    validate
  ],
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password/:token',
  authLimiter,
  [
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
    validate
  ],
  authController.resetPassword
);

// Verify email
router.post('/verify-email/:token', authController.verifyEmail);

/**
 * Protected routes
 */

// Get current user
router.get('/me', protect, authController.getMe);

// Logout
router.post('/logout', protect, authController.logout);

// Change password
router.patch(
  '/change-password',
  protect,
  [
    body('currentPassword')
      .notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .notEmpty().withMessage('New password is required')
      .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('New password must contain uppercase, lowercase, and number'),
    validate
  ],
  authController.changePassword
);

// Resend verification email
router.post('/resend-verification', protect, authController.resendVerification);

export default router;

