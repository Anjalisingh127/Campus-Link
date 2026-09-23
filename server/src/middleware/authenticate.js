import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export async function authenticate(req, res, next) {
  const [scheme, token] = (req.get('authorization') ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'AUTHENTICATION_REQUIRED', 'A valid Bearer token is required'));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) return next(new AppError(401, 'INVALID_TOKEN', 'The authentication token is no longer valid'));
    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    return next(new AppError(401, 'INVALID_TOKEN', 'The authentication token is invalid or expired'));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'FORBIDDEN', 'You do not have permission to perform this action'));
    }
    return next();
  };
}
