import { Router } from 'express';
import { body } from 'express-validator';

// Import controller functions
import {
  register,
  login,
  getProfile,
  updateProfile
} from '../controllers/authController.js';

// Import middlewares
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

/**
 * Validation rules for registration
 */
const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 2, max: 50 }).withMessage('Username must be between 2 and 50 characters'),
  body('mobileNumber')
    .trim()
    .notEmpty().withMessage('Mobile number is required'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

/**
 * Validation rules for login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Validation rules for profile updates
 */
const updateValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Username must be between 2 and 50 characters'),
  body('mobileNumber')
    .optional()
    .trim(),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  body('oldPassword')
    .optional()
    .notEmpty().withMessage('Current password is required to change password')
];

/**
 * Authentication Routes definitions
 */

// POST /api/auth/register
router.post('/register', validate(registerValidation), register);

// POST /api/auth/login
router.post('/login', validate(loginValidation), login);

// GET /api/auth/profile
router.get('/profile', protect, getProfile);

// PUT /api/auth/profile
router.put('/profile', protect, validate(updateValidation), updateProfile);

export default router;
