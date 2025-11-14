/**
 * Product Controller
 * 
 * CRUD operations for products
 */

import prisma from '../config/database.js';
import { APIError, catchAsync } from '../middleware/errorHandler.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/response.js';
import { getPaginationParams } from '../utils/pagination.js';

/**
 * @route   GET /api/v1/products
 * @desc    Get all products with filters
 * @access  Public
 */
export const getAllProducts = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { category, search, minPrice, maxPrice, storeId, inStock } = req.query;

  const where = {};

  if (category) where.category = category;
  if (storeId) where.storeId = storeId;
  if (inStock === 'true') where.inStock = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            username: true,
            logo: true
          }
        },
        rating: {
          select: {
            rating: true,
            review: true,
            userId: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ]);

  paginatedResponse(res, { products }, { page, limit, total }, 'Products retrieved successfully');
});

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get single product
 * @access  Public
 */
export const getProduct = catchAsync(async (req, res, next) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          username: true,
          logo: true,
          email: true,
          contact: true
        }
      },
      rating: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) {
    return next(new APIError('Product not found', 404));
  }

  successResponse(res, { product }, 'Product retrieved successfully');
});

/**
 * @route   POST /api/v1/products
 * @desc    Create new product
 * @access  Private (Store owners)
 */
export const createProduct = catchAsync(async (req, res, next) => {
  const { name, description, mrp, price, images, category, inStock } = req.body;

  if (!req.user.store) {
    return next(new APIError('You must have a store to create products', 403));
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      mrp: parseFloat(mrp),
      price: parseFloat(price),
      images,
      category,
      inStock: inStock !== undefined ? inStock : true,
      storeId: req.user.store.id
    },
    include: {
      store: true
    }
  });

  createdResponse(res, { product }, 'Product created successfully');
});

/**
 * @route   PATCH /api/v1/products/:id
 * @desc    Update product
 * @access  Private (Store owners)
 */
export const updateProduct = catchAsync(async (req, res, next) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id }
  });

  if (!product) {
    return next(new APIError('Product not found', 404));
  }

  if (product.storeId !== req.user.store?.id) {
    return next(new APIError('You are not authorized to update this product', 403));
  }

  const updatedProduct = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body,
    include: {
      store: true,
      rating: true
    }
  });

  successResponse(res, { product: updatedProduct }, 'Product updated successfully');
});

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product
 * @access  Private (Store owners)
 */
export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id }
  });

  if (!product) {
    return next(new APIError('Product not found', 404));
  }

  if (product.storeId !== req.user.store?.id) {
    return next(new APIError('You are not authorized to delete this product', 403));
  }

  await prisma.product.delete({
    where: { id: req.params.id }
  });

  successResponse(res, null, 'Product deleted successfully');
});

/**
 * @route   GET /api/v1/products/categories
 * @desc    Get all categories
 * @access  Public
 */
export const getCategories = catchAsync(async (req, res) => {
  const categories = await prisma.product.findMany({
    select: {
      category: true
    },
    distinct: ['category']
  });

  const categoryList = categories.map(c => c.category);

  successResponse(res, { categories: categoryList }, 'Categories retrieved successfully');
});

export default {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};
