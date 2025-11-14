/**
 * Response Utility Functions
 * 
 * Standardized API responses
 */

/**
 * Success response
 */
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

/**
 * Created response
 */
export const createdResponse = (res, data, message = 'Resource created successfully') => {
  successResponse(res, data, message, 201);
};

/**
 * Paginated response
 */
export const paginatedResponse = (res, data, pagination, message = 'Success') => {
  res.status(200).json({
    status: 'success',
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasMore: pagination.page < Math.ceil(pagination.total / pagination.limit)
    }
  });
};

/**
 * No content response
 */
export const noContentResponse = (res) => {
  res.status(204).send();
};

export default {
  successResponse,
  createdResponse,
  paginatedResponse,
  noContentResponse
};

