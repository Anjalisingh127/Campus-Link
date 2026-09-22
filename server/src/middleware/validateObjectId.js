import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';

export function validateObjectId(req, res, next) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return next(new AppError(400, 'INVALID_EVENT_ID', 'Event ID must be a valid MongoDB ObjectId'));
  }

  return next();
}
