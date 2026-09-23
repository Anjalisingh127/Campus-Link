import { AppError } from '../utils/AppError.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistration(req, res, next) {
  const errors = [];
  if (typeof req.body.name !== 'string' || req.body.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'name must contain at least 2 characters' });
  }
  if (typeof req.body.email !== 'string' || !emailPattern.test(req.body.email.trim())) {
    errors.push({ field: 'email', message: 'email must be valid' });
  }
  if (typeof req.body.password !== 'string' || req.body.password.length < 8 || req.body.password.length > 72) {
    errors.push({ field: 'password', message: 'password must contain between 8 and 72 characters' });
  }
  return errors.length
    ? next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', errors))
    : next();
}

export function validateLogin(req, res, next) {
  const errors = [];
  if (typeof req.body.email !== 'string' || !emailPattern.test(req.body.email.trim())) {
    errors.push({ field: 'email', message: 'email must be valid' });
  }
  if (typeof req.body.password !== 'string' || req.body.password.length === 0) {
    errors.push({ field: 'password', message: 'password is required' });
  }
  return errors.length
    ? next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', errors))
    : next();
}
