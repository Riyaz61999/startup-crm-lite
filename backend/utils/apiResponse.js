/**
 * Sends a standardized success API response.
 * 
 * @param {Object} res - Express response object.
 * @param {*} data - The payload to send back.
 * @param {String} message - A user-friendly success message.
 * @param {Number} [statusCode=200] - HTTP status code (defaults to 200).
 * @returns {Object} Express response.
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Sends a standardized error API response.
 * 
 * @param {Object} res - Express response object.
 * @param {String} message - A user-friendly error message.
 * @param {Number} [statusCode=500] - HTTP status code (defaults to 500).
 * @param {*} [errors=null] - Additional validation or error details.
 * @returns {Object} Express response.
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

/**
 * Sends a standardized paginated API response.
 * 
 * @param {Object} res - Express response object.
 * @param {Array} data - The array of paginated data.
 * @param {Number} total - The total count of documents matching the query.
 * @param {Number} page - The current page number.
 * @param {Number} limit - The page size limit.
 * @returns {Object} Express response.
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const pages = limit > 0 ? Math.ceil(total / limit) : 0;
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages
    }
  });
};
