export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  let normalizedError = error;

  if (error.name === 'ValidationError') {
    normalizedError = {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Database validation failed',
      details: Object.values(error.errors).map((entry) => ({
        field: entry.path,
        message: entry.message,
      })),
    };
  } else if (error.name === 'CastError') {
    normalizedError = {
      status: 400,
      code: 'INVALID_VALUE',
      message: `Invalid value for ${error.path}`,
    };
  }

  const status = Number.isInteger(normalizedError.status) ? normalizedError.status : 500;
  const isProduction = process.env.NODE_ENV === 'production';

  return res.status(status).json({
    error: {
      code: normalizedError.code ?? 'INTERNAL_SERVER_ERROR',
      message: status === 500 && isProduction ? 'An unexpected error occurred' : normalizedError.message,
      ...(normalizedError.details && { details: normalizedError.details }),
    },
  });
}
