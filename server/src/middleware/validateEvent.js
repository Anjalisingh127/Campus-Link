import { EVENT_CATEGORIES, EVENT_STATUSES } from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

const requiredFields = ['title', 'description', 'category', 'organizer', 'venue', 'eventDate'];

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export function validateEvent(req, res, next) {
  const errors = [];

  for (const field of requiredFields) {
    if (typeof req.body[field] !== 'string' || req.body[field].trim() === '') {
      errors.push({ field, message: `${field} is required` });
    }
  }

  if (req.body.category && !EVENT_CATEGORIES.includes(req.body.category.trim().toLowerCase())) {
    errors.push({ field: 'category', message: `category must be one of: ${EVENT_CATEGORIES.join(', ')}` });
  }

  if (req.body.status && !EVENT_STATUSES.includes(req.body.status.trim().toLowerCase())) {
    errors.push({ field: 'status', message: `status must be one of: ${EVENT_STATUSES.join(', ')}` });
  }

  if (req.body.eventDate && Number.isNaN(Date.parse(req.body.eventDate))) {
    errors.push({ field: 'eventDate', message: 'eventDate must be a valid date' });
  }

  if (req.body.registrationUrl && !isValidHttpUrl(req.body.registrationUrl)) {
    errors.push({ field: 'registrationUrl', message: 'registrationUrl must be a valid HTTP or HTTPS URL' });
  }

  if (req.body.tags !== undefined) {
    if (!Array.isArray(req.body.tags) || req.body.tags.some((tag) => typeof tag !== 'string')) {
      errors.push({ field: 'tags', message: 'tags must be an array of strings' });
    } else if (req.body.tags.length > 10) {
      errors.push({ field: 'tags', message: 'tags can contain at most 10 values' });
    }
  }

  if (errors.length > 0) {
    return next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', errors));
  }

  return next();
}
