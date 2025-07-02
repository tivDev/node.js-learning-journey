const ERROR_MESSAGES = {
  MISSING_FIELDS: (fields) =>
    `Missing required field${fields.length > 1 ? 's' : ''} ${fields
      .map((f) => `"${f}"`)
      .join(', ')} in the request.`,

  UNAUTHORIZED: 'Unauthorized: Access is denied due to invalid credentials.',
  FORBIDDEN: 'Forbidden: Access is denied due to insufficient permissions.',
  INVALID_REQUEST_BODY: 'Invalid request: The request body is missing or malformed.',
  
};

module.exports = ERROR_MESSAGES;
