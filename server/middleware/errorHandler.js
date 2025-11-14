/**
 * Global Error Handler Middleware
 * 
 * Centralized error handling for all routes
 * Handles different types of errors and provides consistent responses
 */

import { logger } from '../config/logger.js';
import { Prisma } from '@prisma/client';

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Prisma errors
 */
function handlePrismaError(error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new APIError(`Duplicate field value: ${error.meta?.target}`, 400);
      case 'P2025':
        return new APIError('Record not found', 404);
      case 'P2003':
        return new APIError('Invalid input data', 400);
      default:
        return new APIError('Database error occurred', 500);
    }
  }
  
  if (error instanceof Prisma.PrismaClientValidationError) {
    return new APIError('Invalid data provided', 400);
  }
  
  return error;
}

/**
 * Handle JWT errors
 */
function handleJWTError() {
  return new APIError('Invalid token. Please log in again', 401);
}

function handleJWTExpiredError() {
  return new APIError('Your token has expired. Please log in again', 401);
}

/**
 * Send error response in development
 */
function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}

/**
 * Send error response in production
 */
function sendErrorProd(err, res) {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    // Log error
    logger.error('ERROR 💥', err);
    
    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
}

/**
 * Main error handler middleware
 */
export function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err instanceof Prisma.PrismaClientKnownRequestError || 
        err instanceof Prisma.PrismaClientValidationError) {
      error = handlePrismaError(err);
    }
    
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (err.name === 'ValidationError') {
      error = new APIError('Validation error occurred', 400);
    }

    sendErrorProd(error, res);
  }
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default errorHandler;

