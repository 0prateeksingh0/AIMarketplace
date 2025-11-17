/**
 * Store Controller
 * 
 * CRUD operations for stores with pagination
 */

import prisma from '../config/database.js';
import { APIError, catchAsync } from '../middleware/errorHandler.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/response.js';
import { getPaginationParams, getSortParams, getSearchParams } from '../utils/pagination.js';

/**
 * @route   GET /api/v1/stores
 * @desc    Get all active stores (paginated)
 * @access  Public
 */
export const getAllStores = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const sortBy = getSortParams(req, {
    defaultSort: 'createdAt',
    defaultOrder: 'desc',
    allowedFields: ['name', 'createdAt', 'username']
  });
  
  const searchQuery = getSearchParams(req, ['name', 'description', 'username']);

  const where = {
    isActive: true,
    status: 'approved',
    ...searchQuery
  };

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        username: true,
        description: true,
        logo: true,
        createdAt: true,
        _count: {
          select: {
            Product: true,
            Order: true
          }
        }
      },
      orderBy: sortBy
    }),
    prisma.store.count({ where })
  ]);

  paginatedResponse(res, { stores }, { page, limit, total }, 'Stores retrieved successfully');
});

/**
 * @route   GET /api/v1/stores/:id
 * @desc    Get single store with products
 * @access  Public
 */
export const getStore = catchAsync(async (req, res, next) => {
  const store = await prisma.store.findUnique({
    where: { id: req.params.id },
    include: {
      Product: {
        where: { inStock: true },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          rating: true
        }
      },
      _count: {
        select: {
          Product: true,
          Order: true
        }
      }
    }
  });

  if (!store) {
    return next(new APIError('Store not found', 404));
  }

  if (!store.isActive || store.status !== 'approved') {
    return next(new APIError('This store is not available', 403));
  }

  successResponse(res, { store }, 'Store retrieved successfully');
});

/**
 * @route   GET /api/v1/stores/username/:username
 * @desc    Get store by username
 * @access  Public
 */
export const getStoreByUsername = catchAsync(async (req, res, next) => {
  const store = await prisma.store.findUnique({
    where: { username: req.params.username },
    include: {
      Product: {
        where: { inStock: true },
        take: 20,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!store) {
    return next(new APIError('Store not found', 404));
  }

  successResponse(res, { store }, 'Store retrieved successfully');
});

/**
 * @route   POST /api/v1/stores
 * @desc    Create new store
 * @access  Private
 */
export const createStore = catchAsync(async (req, res, next) => {
  const { name, username, description, email, contact, address, logo } = req.body;

  // Check if user already has a store
  const existingStore = await prisma.store.findUnique({
    where: { userId: req.user.id }
  });

  if (existingStore) {
    return next(new APIError('You already have a store', 400));
  }

  // Check if username is taken
  const usernameExists = await prisma.store.findUnique({
    where: { username }
  });

  if (usernameExists) {
    return next(new APIError('This username is already taken', 400));
  }

  const store = await prisma.store.create({
    data: {
      userId: req.user.id,
      name,
      username,
      description,
      email,
      contact,
      address,
      logo: logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=400`,
      status: 'pending',
      isActive: false
    }
  });

  createdResponse(res, { store }, 'Store created successfully! Waiting for admin approval.');
});

/**
 * @route   PATCH /api/v1/stores/:id
 * @desc    Update store
 * @access  Private (Store owners)
 */
export const updateStore = catchAsync(async (req, res, next) => {
  const store = await prisma.store.findUnique({
    where: { id: req.params.id }
  });

  if (!store) {
    return next(new APIError('Store not found', 404));
  }

  if (store.userId !== req.user.id) {
    return next(new APIError('You do not have permission to update this store', 403));
  }

  const updatedStore = await prisma.store.update({
    where: { id: req.params.id },
    data: req.body
  });

  successResponse(res, { store: updatedStore }, 'Store updated successfully');
});

/**
 * @route   GET /api/v1/stores/my/store
 * @desc    Get current user's store
 * @access  Private
 */
export const getMyStore = catchAsync(async (req, res, next) => {
  const store = await prisma.store.findUnique({
    where: { userId: req.user.id },
    include: {
      Product: {
        take: 10,
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: {
          Product: true,
          Order: true
        }
      }
    }
  });

  if (!store) {
    return next(new APIError('You do not have a store yet', 404));
  }

  successResponse(res, { store }, 'Store retrieved successfully');
});

export default {
  getAllStores,
  getStore,
  getStoreByUsername,
  createStore,
  updateStore,
  getMyStore
};

