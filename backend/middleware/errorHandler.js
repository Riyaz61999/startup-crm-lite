/**
 * Global Express error handling middleware.
 * Formats errors uniformly, sanitizes development-only details in production,
 * and handles specific Mongoose, MongoDB, and JSON Web Token error types.
 * 
 * @param {Error} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // Log error for developers
  console.error('Error encountered:', err);

  // 1. Mongoose ValidationError (400) - Field validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = {};
    // Extract user-friendly validation messages for each invalid field
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }

  // 2. Mongoose CastError (404) - E.g., looking up an invalid MongoDB ObjectId
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // 3. MongoDB Duplicate Key Error (409) - E.g., registering an email that already exists
  else if (err.code === 11000) {
    statusCode = 409;
    message = 'Email already exists';
    if (err.keyValue) {
      errors = {};
      Object.keys(err.keyValue).forEach((key) => {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} already exists`;
      });
    }
  }

  // 4. JWT Authentication Errors (401)
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please authenticate.';
  } 
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  }

  // Determine environment
  const isDev = process.env.NODE_ENV === 'development';

  // Construct JSON response
  const responsePayload = {
    success: false,
    message,
    ...(errors && { errors })
  };

  // Only include stack trace in development mode
  if (isDev) {
    responsePayload.stack = err.stack;
  }

  return res.status(statusCode).json(responsePayload);
};

export default errorHandler;
