/**
 * Pagination Utility
 * 
 * Helper functions for paginating database queries
 */

/**
 * Get pagination parameters from request
 */
export const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Create pagination object
 */
export const createPagination = (page, limit, total) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasMore: page < Math.ceil(total / limit),
    hasPrev: page > 1
  };
};

export default {
  getPaginationParams,
  createPagination
};

