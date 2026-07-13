import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Helper function to generate a JSON Web Token for a user.
 * 
 * @param {String} userId - The user ID to encode.
 * @returns {String} Signed JWT.
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Register a new user.
 * 
 * ROUTE: POST /api/auth/register
 * ACCESS: Public
 */
export const register = async (req, res, next) => {
  try {
    const { username, mobileNumber, email, password } = req.body;

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return errorResponse(res, 'Email already exists', 409);
    }

    // Create the user (pre-save hook will automatically hash the password)
    const user = await User.create({
      username,
      mobileNumber,
      email,
      password
    });

    // Generate JWT
    const token = generateToken(user._id);

    // Return success response (toJSON is automatically invoked removing password)
    return successResponse(
      res,
      { token, user },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate a user and return a token.
 * 
 * ROUTE: POST /api/auth/login
 * ACCESS: Public
 * 
 * PRODUCTION NOTE:
 * In a production environment, you should mount rate-limiting middleware
 * (e.g., using 'express-rate-limit') on this route to protect against brute-force attacks.
 * Example:
 * const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many login attempts' });
 * router.post('/login', loginLimiter, login);
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Security: Do not reveal whether the email or password is incorrect
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Compare passwords
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check if the user account is active
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // Generate JWT
    const token = generateToken(user._id);

    return successResponse(
      res,
      { token, user },
      'Logged in successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get the current authenticated user's profile.
 * 
 * ROUTE: GET /api/auth/profile
 * ACCESS: Protected
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user is already populated by the protect middleware
    return successResponse(
      res,
      req.user,
      'Profile retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update the current authenticated user's profile.
 * Only allows name update, or secure password change requiring validation of old password.
 * 
 * ROUTE: PUT /api/auth/profile
 * ACCESS: Protected
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { username, mobileNumber, oldPassword, password } = req.body;

    // Find current user with password selected to check credentials
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Update profile fields if provided (email cannot be updated directly)
    if (username) {
      user.username = username;
    }
    if (mobileNumber) {
      user.mobileNumber = mobileNumber;
    }

    // If changing password, validate old password first
    if (password) {
      if (!oldPassword) {
        return errorResponse(
          res,
          'Current password (oldPassword) is required to set a new password',
          400
        );
      }

      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, 'Incorrect current password', 400);
      }

      // Assigning new password - pre-save hook will hash it automatically
      user.password = password;
    }

    // Save modifications
    await user.save();

    // Convert to JSON (removes the password field before returning)
    const updatedUser = user.toJSON();

    return successResponse(
      res,
      updatedUser,
      'Profile updated successfully'
    );
  } catch (error) {
    next(error);
  }
};
