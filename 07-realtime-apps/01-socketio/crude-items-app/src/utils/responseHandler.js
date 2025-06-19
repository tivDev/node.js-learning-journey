exports.successResponse = (res, statusCode, data, message = '') => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

exports.errorResponse = (res, statusCode, message, error = null) => {
  console.error('Error:', error || message);
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
};