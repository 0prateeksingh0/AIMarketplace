/**
 * Authentication Controller
 * 
 * Handles user registration, login, and token management
 */

import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { APIError, catchAsync } from '../middleware/errorHandler.js';
import { createSendToken, verifyRefreshToken, signToken } from '../utils/jwt.js';
import { successResponse } from '../utils/response.js';

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

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      id: email, // Using email as ID as per schema
      name,
      email,
      image: image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`,
      cart: {}
    }
  });

  // Create and send token
  createSendToken(user, 201, res, 'User registered successfully');
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      store: true
    }
  });

  if (!user) {
    return next(new APIError('Invalid email or password', 401));
  }

  // Note: Since the schema doesn't have password field, 
  // you'll need to add password storage or integrate with OAuth
  // For now, this is a placeholder

  // Create and send token
  createSendToken(user, 200, res, 'Login successful');
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
    where: { id: decoded.id }
  });

  if (!user) {
    return next(new APIError('User not found', 404));
  }

  // Generate new access token
  const newAccessToken = signToken({ id: user.id });

  successResponse(res, { token: newAccessToken }, 'Token refreshed successfully');
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
export const getMe = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      store: true,
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
  // In a real app, you might want to blacklist the token
  // For now, we'll just send a success response
  // Client should remove the token from storage

  successResponse(res, null, 'Logged out successfully');
});

export default {
  register,
  login,
  refreshToken,
  getMe,
  logout
};

