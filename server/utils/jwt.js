/**
 * JWT Utility Functions
 * 
 * Token generation and verification
 */

import jwt from 'jsonwebtoken';

/**
 * Sign JWT token
 */
export const signToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
};

/**
 * Sign refresh token
 */
export const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

/**
 * Create and send token response
 */
export const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = signToken({ id: user.id });
  const refreshToken = signRefreshToken({ id: user.id });

  // Remove password from output
  const { password, ...userWithoutPassword } = user;

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    refreshToken,
    data: {
      user: userWithoutPassword
    }
  });
};

export default {
  signToken,
  signRefreshToken,
  verifyToken,
  verifyRefreshToken,
  createSendToken
};

