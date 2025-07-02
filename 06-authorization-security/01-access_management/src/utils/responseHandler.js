// src/utils/responseHandler.js

/**
 * Utility functions for handling API responses in Express applications.
 * @param {Response} res - The response object from Express.
 * @param {number} statusCode - The HTTP status code to use for the response.
 * @param {string} message - An optional message to be included in the response body.
 */
exports.successResponse = (res, statusCode, data, message = '') => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Utility functions for handling API responses in Express applications.
 * @param {Response} res - The response object from Express.
 * @param {number} statusCode - The HTTP status code to use for the response.
 * @param {string} message - An optional message to be included in the response body.
 * @param {Error} error - An optional error to be included in the response body (only included if in development mode).
 */

exports.errorResponse = (res, statusCode, message, error = null) => {
  console.error('Error:', error || message);
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
};