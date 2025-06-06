const ERROR_MESSAGES = {
  MISSING_FIELDS: (fields) =>
    `Missing required field${fields.length > 1 ? 's' : ''} ${fields
      .map((f) => `"${f}"`)
      .join(', ')} in the request.`,

  UNAUTHORIZED: 'Unauthorized: Access is denied due to invalid credentials.',

  INVALID_REQUEST_BODY: 'Invalid request: The request body is missing or malformed.',
  // Add more as needed...
};

module.exports = ERROR_MESSAGES;
