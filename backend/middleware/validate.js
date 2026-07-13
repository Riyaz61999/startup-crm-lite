import { validationResult } from 'express-validator';

/**
 * Higher-order middleware function to run express-validator check chains
 * and standardise bad request errors.
 * 
 * @param {Array} validations - Array of validation rules (e.g. body(), param()).
 * @returns {Function} Express middleware.
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations asynchronously
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors to match: { success: false, errors: [{ field, message }] }
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors
    });
  };
};

export default validate;
