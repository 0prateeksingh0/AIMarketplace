/**
 * Authentication Middleware
 * 
 * JWT-based authentication
 * Protects routes and manages user access
 */

import jwt from 'jsonwebtoken';
import { APIError, catchAsync } from './errorHandler.js';
import prisma from '../config/database.js';

/**
 * Verify JWT token
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * Protect routes - Verify user is authenticated
 */
export const protect = catchAsync(async (req, res, next) => {
  // 1. Get token from header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new APIError('You are not logged in. Please log in to access this route.', 401));
  }

  // 2. Verify token
  const decoded = verifyToken(token);

  // 3. Check if user still exists
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      store: {
        select: {
          id: true,
          name: true,
          username: true,
          status: true,
          isActive: true
        }
      }
    }
  });

  if (!user) {
    return next(new APIError('The user belonging to this token no longer exists.', 401));
  }

  // 4. Grant access to protected route
  req.user = user;
  next();
});

/**
 * Restrict routes to specific roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array: ['admin', 'vendor']
    if (!roles.includes(req.user.role)) {
      return next(
        new APIError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

/**
 * Check if user has an active store
 */
export const hasActiveStore = catchAsync(async (req, res, next) => {
  if (!req.user.store) {
    return next(new APIError('You need to create a store to access this resource', 403));
  }

  if (!req.user.store.isActive) {
    return next(new APIError('Your store is not active yet. Please wait for admin approval.', 403));
  }

  req.store = req.user.store;
  next();
});

/**
 * Check if user is the owner of a resource
 */
export const isOwner = (resourceName) => {
  return catchAsync(async (req, res, next) => {
    const resourceId = req.params.id;
    
    // Get the resource
    const resource = await prisma[resourceName].findUnique({
      where: { id: resourceId },
      select: { userId: true }
    });

    if (!resource) {
      return next(new APIError(`${resourceName} not found`, 404));
    }

    // Check if user is the owner
    if (resource.userId !== req.user.id) {
      return next(new APIError('You do not have permission to perform this action', 403));
    }

    next();
  });
};

/**
 * Optional auth - doesn't require authentication but adds user if available
 */
export const optionalAuth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      });
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid, continue without user
    }
  }

  next();
});

export default { protect, restrictTo, hasActiveStore, isOwner, optionalAuth };

