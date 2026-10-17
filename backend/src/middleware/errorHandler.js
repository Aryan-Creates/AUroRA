/**
 * Centralized Error Handling Middleware
 * Converts Mongoose validation, CastError, duplicate keys, and HTTP errors
 * into predictable, safe JSON error responses without exposing server stack traces.
 */

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource identifier format: ${err.value}`;
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An entry with this ${field} already exists: '${err.keyValue[field]}'`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errorDetails = Object.values(err.errors).map((e) => e.message);
    message = errorDetails.join('. ');
  }

  // JSON Web Token Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Malformed authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  // Log error details internally for development diagnostics
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('[ServerError]', err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`,
    statusCode: 404,
  });
};
