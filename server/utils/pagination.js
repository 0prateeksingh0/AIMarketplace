/**
 * Pagination Utility
 * 
 * Helper functions for paginating database queries
 * Follows best practices for API pagination
 */

/**
 * Get pagination parameters from request
 * @param {Object} req - Express request object
 * @param {Object} options - Optional configuration
 * @returns {Object} Pagination parameters
 */
export const getPaginationParams = (req, options = {}) => {
  const {
    defaultPage = 1,
    defaultLimit = 10,
    maxLimit = 100
  } = options;

  let page = parseInt(req.query.page) || defaultPage;
  let limit = parseInt(req.query.limit) || defaultLimit;

  // Ensure positive values
  page = Math.max(1, page);
  limit = Math.min(Math.max(1, limit), maxLimit);

  const skip = (page - 1) * limit;

  return { 
    page, 
    limit, 
    skip,
    offset: skip // Alias for skip
  };
};

/**
 * Create pagination metadata
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} Pagination metadata
 */
export const createPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
    firstPage: 1,
    lastPage: totalPages,
    from: total > 0 ? (page - 1) * limit + 1 : 0,
    to: Math.min(page * limit, total)
  };
};

/**
 * Get sort parameters from request
 * @param {Object} req - Express request object
 * @param {Object} options - Sort options
 * @returns {Object} Prisma orderBy object
 */
export const getSortParams = (req, options = {}) => {
  const {
    defaultSort = 'createdAt',
    defaultOrder = 'desc',
    allowedFields = []
  } = options;

  let sortBy = req.query.sortBy || defaultSort;
  let order = req.query.order || defaultOrder;

  // Validate sort field
  if (allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
    sortBy = defaultSort;
  }

  // Validate order
  if (!['asc', 'desc'].includes(order.toLowerCase())) {
    order = defaultOrder;
  }

  return {
    [sortBy]: order.toLowerCase()
  };
};

/**
 * Get filter parameters from request
 * @param {Object} req - Express request object
 * @param {Array} allowedFilters - Array of allowed filter field names
 * @returns {Object} Filter object for Prisma where clause
 */
export const getFilterParams = (req, allowedFilters = []) => {
  const filters = {};

  allowedFilters.forEach(field => {
    if (req.query[field]) {
      // Handle different filter types
      const value = req.query[field];
      
      // Boolean conversion
      if (value === 'true' || value === 'false') {
        filters[field] = value === 'true';
      }
      // Numeric range filters (e.g., minPrice, maxPrice)
      else if (field.startsWith('min') || field.startsWith('max')) {
        const baseField = field.replace(/^(min|max)/, '').toLowerCase();
        if (!filters[baseField]) filters[baseField] = {};
        
        if (field.startsWith('min')) {
          filters[baseField].gte = parseFloat(value);
        } else {
          filters[baseField].lte = parseFloat(value);
        }
      }
      // String filters
      else {
        filters[field] = value;
      }
    }
  });

  return filters;
};

/**
 * Create paginated response with links
 * @param {Object} data - Response data
 * @param {Object} pagination - Pagination metadata
 * @param {string} baseUrl - Base URL for links
 * @returns {Object} Complete paginated response
 */
export const createPaginatedResponse = (data, pagination, baseUrl = '') => {
  const { page, limit, total, totalPages } = pagination;
  
  const links = {};
  
  if (baseUrl) {
    links.self = `${baseUrl}?page=${page}&limit=${limit}`;
    links.first = `${baseUrl}?page=1&limit=${limit}`;
    links.last = `${baseUrl}?page=${totalPages}&limit=${limit}`;
    
    if (page > 1) {
      links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
    }
    
    if (page < totalPages) {
      links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
    }
  }

  return {
    data,
    pagination,
    links
  };
};

/**
 * Paginate array (for in-memory pagination)
 * @param {Array} array - Array to paginate
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Paginated data and metadata
 */
export const paginateArray = (array, page = 1, limit = 10) => {
  const total = array.length;
  const skip = (page - 1) * limit;
  const data = array.slice(skip, skip + limit);
  const pagination = createPagination(page, limit, total);

  return {
    data,
    pagination
  };
};

/**
 * Get search parameters
 * @param {Object} req - Express request object
 * @param {Array} searchFields - Fields to search in
 * @returns {Object} Prisma OR search query
 */
export const getSearchParams = (req, searchFields = []) => {
  const search = req.query.search || req.query.q;
  
  if (!search || searchFields.length === 0) {
    return {};
  }

  return {
    OR: searchFields.map(field => ({
      [field]: {
        contains: search,
        mode: 'insensitive'
      }
    }))
  };
};

export default {
  getPaginationParams,
  createPagination,
  getSortParams,
  getFilterParams,
  createPaginatedResponse,
  paginateArray,
  getSearchParams
};
