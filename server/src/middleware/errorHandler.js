export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const status = Number.isInteger(error.status) ? error.status : 500;
  const isProduction = process.env.NODE_ENV === 'production';

  return res.status(status).json({
    error: {
      code: error.code ?? 'INTERNAL_SERVER_ERROR',
      message: status === 500 && isProduction ? 'An unexpected error occurred' : error.message,
    },
  });
}
