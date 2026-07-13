import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Authentication protector middleware.
 * Verifies JWT tokens from Authorization header and retrieves current user.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Return 401 if token is missing
  if (!token) {
    return errorResponse(res, 'No token provided, access denied', 401);
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // 4. Check if user still exists in the database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User belonging to this token no longer exists', 401);
    }

    // 5. Attach user to request object and proceed
    req.user = user;
    next();
  } catch (error) {
    // 6. Differentiate expired tokens from generic invalid tokens
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired, please login again', 401);
    }
    return errorResponse(res, 'Token is invalid', 401);
  }
};

export default protect;
