/**
 * Request Validation Middleware
 * 
 * Uses express-validator for input validation
 * Validates and sanitizes user input
 */

import { body, param, query, validationResult } from 'express-validator';
import { APIError } from './errorHandler.js';

/**
 * Validation result checker
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));
    
    return next(new APIError(`Validation failed: ${formattedErrors.map(e => e.message).join(', ')}`, 400));
  }
  
  next();
};

/**
 * User validation rules
 */
export const userValidation = {
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
    validate
  ],
  
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
    validate
  ],
  
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    validate
  ]
};

/**
 * Product validation rules
 */
export const productValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Product name is required')
      .isLength({ min: 3, max: 200 }).withMessage('Product name must be between 3 and 200 characters'),
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
    body('mrp')
      .notEmpty().withMessage('MRP is required')
      .isFloat({ min: 0 }).withMessage('MRP must be a positive number'),
    body('price')
      .notEmpty().withMessage('Price is required')
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category')
      .trim()
      .notEmpty().withMessage('Category is required'),
    body('images')
      .isArray({ min: 1 }).withMessage('At least one image is required'),
    validate
  ],
  
  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 }).withMessage('Product name must be between 3 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
    body('mrp')
      .optional()
      .isFloat({ min: 0 }).withMessage('MRP must be a positive number'),
    body('price')
      .optional()
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    validate
  ]
};

/**
 * Store validation rules
 */
export const storeValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Store name is required')
      .isLength({ min: 3, max: 100 }).withMessage('Store name must be between 3 and 100 characters'),
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
      .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('contact')
      .trim()
      .notEmpty().withMessage('Contact number is required')
      .matches(/^[0-9+\-\s()]+$/).withMessage('Please provide a valid phone number'),
    body('address')
      .trim()
      .notEmpty().withMessage('Address is required'),
    validate
  ]
};

/**
 * Order validation rules
 */
export const orderValidation = {
  create: [
    body('storeId')
      .notEmpty().withMessage('Store ID is required'),
    body('addressId')
      .notEmpty().withMessage('Address ID is required'),
    body('paymentMethod')
      .notEmpty().withMessage('Payment method is required')
      .isIn(['COD', 'STRIPE']).withMessage('Invalid payment method'),
    body('items')
      .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.productId')
      .notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity')
      .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validate
  ]
};

/**
 * Address validation rules
 */
export const addressValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('phone')
      .trim()
      .notEmpty().withMessage('Phone number is required')
      .matches(/^[0-9+\-\s()]+$/).withMessage('Please provide a valid phone number'),
    body('street')
      .trim()
      .notEmpty().withMessage('Street address is required'),
    body('city')
      .trim()
      .notEmpty().withMessage('City is required'),
    body('state')
      .trim()
      .notEmpty().withMessage('State is required'),
    body('zip')
      .trim()
      .notEmpty().withMessage('ZIP code is required'),
    body('country')
      .trim()
      .notEmpty().withMessage('Country is required'),
    validate
  ]
};

/**
 * Rating validation rules
 */
export const ratingValidation = {
  create: [
    body('rating')
      .notEmpty().withMessage('Rating is required')
      .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review')
      .trim()
      .notEmpty().withMessage('Review is required')
      .isLength({ min: 10, max: 1000 }).withMessage('Review must be between 10 and 1000 characters'),
    body('productId')
      .notEmpty().withMessage('Product ID is required'),
    body('orderId')
      .notEmpty().withMessage('Order ID is required'),
    validate
  ]
};

/**
 * ID parameter validation
 */
export const idValidation = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isString().withMessage('ID must be a string'),
  validate
];

/**
 * Pagination validation
 */
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate
];

export default {
  validate,
  userValidation,
  productValidation,
  storeValidation,
  orderValidation,
  addressValidation,
  ratingValidation,
  idValidation,
  paginationValidation
};

