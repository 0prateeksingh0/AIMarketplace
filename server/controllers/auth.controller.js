/**
 * Authentication Controller
 * 
 * Handles user registration, login, password reset, and token management
 * Implements secure authentication with bcrypt and JWT
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/database.js';
import { APIError, catchAsync } from '../middleware/errorHandler.js';
import { createSendToken, verifyRefreshToken, signToken } from '../utils/jwt.js';
import { successResponse } from '../utils/response.js';
import { logger } from '../config/logger.js';

/**
 * Generate random token
 */
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash token for storage
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, image } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return next(new APIError('User with this email already exists', 400));
  }

  // Validate password strength
  if (password.length < 8) {
    return next(new APIError('Password must be at least 8 characters long', 400));
  }

  // Hash password with bcrypt (12 rounds)
  const hashedPassword = await bcrypt.hash(password, 12);

  // Generate email verification token
  const emailVerifyToken = generateToken();
  const hashedEmailToken = hashToken(emailVerifyToken);

  // Create user
  const user = await prisma.user.create({
    data: {
      id: email, // Using email as ID as per schema
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      image: image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=200`,
      cart: {},
      emailVerifyToken: hashedEmailToken,
      isEmailVerified: false
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isEmailVerified: true,
      createdAt: true
    }
  });

  logger.info(`New user registered: ${email}`);

  // TODO: Send verification email
  // await sendVerificationEmail(email, emailVerifyToken);

  // Create and send token
  createSendToken(user, 201, res, 'User registered successfully! Please check your email to verify your account.');
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new APIError('Please provide email and password', 400));
  }

  // Check if user exists and get password
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          username: true,
          status: true,
          isActive: true,
          logo: true
        }
      }
    }
  });

  if (!user) {
    return next(new APIError('Invalid email or password', 401));
  }

  // Check if user has password (for OAuth users)
  if (!user.password) {
    return next(new APIError('Please login with the method you used to sign up', 401));
  }

  // Verify password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    logger.warn(`Failed login attempt for user: ${email}`);
    return next(new APIError('Invalid email or password', 401));
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  // Remove password from output
  const { password: _, emailVerifyToken, resetPasswordToken, resetPasswordExpires, ...userWithoutSensitiveData } = user;

  logger.info(`User logged in: ${email}`);

  // Create and send token
  createSendToken(userWithoutSensitiveData, 200, res, 'Login successful');
});

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new APIError('Refresh token is required', 400));
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isEmailVerified: true
    }
  });

  if (!user) {
    return next(new APIError('User not found', 404));
  }

  // Generate new access token
  const newAccessToken = signToken({ id: user.id });

  logger.info(`Token refreshed for user: ${user.email}`);

  successResponse(res, { token: newAccessToken, user }, 'Token refreshed successfully');
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
export const getMe = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isEmailVerified: true,
      lastLogin: true,
      createdAt: true,
      store: {
        select: {
          id: true,
          name: true,
          username: true,
          logo: true,
          status: true,
          isActive: true,
          description: true
        }
      },
      Address: true
    }
  });

  successResponse(res, { user }, 'User retrieved successfully');
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
export const logout = catchAsync(async (req, res, next) => {
  // In a production app, you might want to:
  // 1. Blacklist the token in Redis
  // 2. Clear any server-side sessions
  // 3. Log the logout event
  
  logger.info(`User logged out: ${req.user.email}`);

  successResponse(res, null, 'Logged out successfully');
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new APIError('Please provide an email address', 400));
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    // Don't reveal if user exists or not (security best practice)
    return successResponse(res, null, 'If an account exists with this email, you will receive password reset instructions.');
  }

  // Generate reset token
  const resetToken = generateToken();
  const hashedResetToken = hashToken(resetToken);

  // Save token and expiry (10 minutes)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedResetToken,
      resetPasswordExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    }
  });

  // TODO: Send email with reset link
  // const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  // await sendPasswordResetEmail(user.email, resetUrl);

  logger.info(`Password reset requested for: ${email}`);

  successResponse(res, null, 'If an account exists with this email, you will receive password reset instructions.');
});

/**
 * @route   POST /api/v1/auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 */
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return next(new APIError('Password must be at least 8 characters long', 400));
  }

  // Hash the token from URL
  const hashedToken = hashToken(token);

  // Find user with valid reset token
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        gt: new Date() // Token not expired
      }
    }
  });

  if (!user) {
    return next(new APIError('Invalid or expired reset token', 400));
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Update password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    }
  });

  logger.info(`Password reset successful for: ${user.email}`);

  successResponse(res, null, 'Password reset successful! You can now login with your new password.');
});

/**
 * @route   PATCH /api/v1/auth/change-password
 * @desc    Change password (when logged in)
 * @access  Private
 */
export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new APIError('Please provide current and new password', 400));
  }

  if (newPassword.length < 8) {
    return next(new APIError('New password must be at least 8 characters long', 400));
  }

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  // Verify current password
  const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordCorrect) {
    return next(new APIError('Current password is incorrect', 401));
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  logger.info(`Password changed for user: ${user.email}`);

  successResponse(res, null, 'Password changed successfully');
});

/**
 * @route   POST /api/v1/auth/verify-email/:token
 * @desc    Verify email with token
 * @access  Public
 */
export const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  // Hash the token
  const hashedToken = hashToken(token);

  // Find user with this token
  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken: hashedToken
    }
  });

  if (!user) {
    return next(new APIError('Invalid verification token', 400));
  }

  // Update user
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerifyToken: null
    }
  });

  logger.info(`Email verified for user: ${user.email}`);

  successResponse(res, null, 'Email verified successfully! You can now access all features.');
});

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend email verification
 * @access  Private
 */
export const resendVerification = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (user.isEmailVerified) {
    return next(new APIError('Email is already verified', 400));
  }

  // Generate new token
  const emailVerifyToken = generateToken();
  const hashedEmailToken = hashToken(emailVerifyToken);

  // Update user
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifyToken: hashedEmailToken }
  });

  // TODO: Send verification email
  // await sendVerificationEmail(user.email, emailVerifyToken);

  logger.info(`Verification email resent to: ${user.email}`);

  successResponse(res, null, 'Verification email sent! Please check your inbox.');
});

export default {
  register,
  login,
  refreshToken,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  resendVerification
};

