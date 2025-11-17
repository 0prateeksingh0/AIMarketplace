/**
 * Order Controller
 * 
 * CRUD operations for orders with pagination
 */

import prisma from '../config/database.js';
import { APIError, catchAsync } from '../middleware/errorHandler.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/response.js';
import { getPaginationParams, getSortParams, getFilterParams } from '../utils/pagination.js';

/**
 * @route   GET /api/v1/orders
 * @desc    Get all orders for authenticated user (paginated)
 * @access  Private
 */
export const getUserOrders = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const sortBy = getSortParams(req, {
    defaultSort: 'createdAt',
    defaultOrder: 'desc',
    allowedFields: ['createdAt', 'total', 'status']
  });

  const where = { userId: req.user.id };

  // Apply filters
  if (req.query.status) {
    where.status = req.query.status;
  }
  if (req.query.storeId) {
    where.storeId = req.query.storeId;
  }
  if (req.query.isPaid !== undefined) {
    where.isPaid = req.query.isPaid === 'true';
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
            username: true
          }
        },
        address: true,
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: sortBy
    }),
    prisma.order.count({ where })
  ]);

  paginatedResponse(res, { orders }, { page, limit, total }, 'Orders retrieved successfully');
});

/**
 * @route   GET /api/v1/orders/store
 * @desc    Get all orders for store owner (paginated)
 * @access  Private (Store owners)
 */
export const getStoreOrders = catchAsync(async (req, res, next) => {
  if (!req.user.store) {
    return next(new APIError('You need to have a store to access this resource', 403));
  }

  const { page, limit, skip } = getPaginationParams(req);
  const sortBy = getSortParams(req, {
    defaultSort: 'createdAt',
    defaultOrder: 'desc',
    allowedFields: ['createdAt', 'total', 'status']
  });

  const where = { storeId: req.user.store.id };

  // Apply filters
  if (req.query.status) {
    where.status = req.query.status;
  }
  if (req.query.isPaid !== undefined) {
    where.isPaid = req.query.isPaid === 'true';
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        address: true,
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: sortBy
    }),
    prisma.order.count({ where })
  ]);

  paginatedResponse(res, { orders }, { page, limit, total }, 'Store orders retrieved successfully');
});

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get single order
 * @access  Private
 */
export const getOrder = catchAsync(async (req, res, next) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      store: true,
      address: true,
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    return next(new APIError('Order not found', 404));
  }

  // Check if user has access to this order
  if (order.userId !== req.user.id && order.storeId !== req.user.store?.id) {
    return next(new APIError('You do not have permission to view this order', 403));
  }

  successResponse(res, { order }, 'Order retrieved successfully');
});

/**
 * @route   POST /api/v1/orders
 * @desc    Create new order
 * @access  Private
 */
export const createOrder = catchAsync(async (req, res, next) => {
  const { storeId, addressId, paymentMethod, items, coupon } = req.body;

  // Validate items
  if (!items || items.length === 0) {
    return next(new APIError('Order must contain at least one item', 400));
  }

  // Get products to calculate total
  const productIds = items.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });

  // Calculate total
  let total = 0;
  const orderItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      throw new APIError(`Product ${item.productId} not found`, 404);
    }
    const itemTotal = product.price * item.quantity;
    total += itemTotal;
    
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price
    };
  });

  // Apply coupon if provided
  let couponData = {};
  let isCouponUsed = false;
  if (coupon) {
    // TODO: Validate and apply coupon
    isCouponUsed = true;
    couponData = coupon;
  }

  // Create order with items
  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      storeId,
      addressId,
      paymentMethod,
      total,
      isCouponUsed,
      coupon: couponData,
      isPaid: paymentMethod === 'COD' ? false : false, // Will be updated by payment webhook
      orderItems: {
        create: orderItems
      }
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      },
      address: true,
      store: true
    }
  });

  createdResponse(res, { order }, 'Order created successfully');
});

/**
 * @route   PATCH /api/v1/orders/:id/status
 * @desc    Update order status (store owners only)
 * @access  Private
 */
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const order = await prisma.order.findUnique({
    where: { id: req.params.id }
  });

  if (!order) {
    return next(new APIError('Order not found', 404));
  }

  // Check if user owns the store
  if (order.storeId !== req.user.store?.id) {
    return next(new APIError('You do not have permission to update this order', 403));
  }

  const updatedOrder = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  successResponse(res, { order: updatedOrder }, 'Order status updated successfully');
});

export default {
  getUserOrders,
  getStoreOrders,
  getOrder,
  createOrder,
  updateOrderStatus
};

