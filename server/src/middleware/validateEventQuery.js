import { EVENT_CATEGORIES, EVENT_STATUSES } from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

const SORT_FIELDS = ['eventDate', 'createdAt', 'title'];
const SORT_ORDERS = ['asc', 'desc'];

function parsePositiveInteger(value, fallback, maximum) {
  if (value === undefined) {
    return fallback;
  }

  if (!/^\d+$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  return parsed >= 1 && parsed <= maximum ? parsed : null;
}

export function validateEventQuery(req, res, next) {
  const errors = [];
  const search = req.query.search?.trim() ?? '';
  const category = req.query.category?.trim().toLowerCase();
  const status = req.query.status?.trim().toLowerCase();
  const sort = req.query.sort?.trim() ?? 'eventDate';
  const order = req.query.order?.trim().toLowerCase() ?? 'asc';
  const page = parsePositiveInteger(req.query.page, 1, 1_000_000);
  const limit = parsePositiveInteger(req.query.limit, 10, 50);
  const from = req.query.from ? new Date(req.query.from) : undefined;
  const to = req.query.to ? new Date(req.query.to) : undefined;

  if (search.length > 100) {
    errors.push({ field: 'search', message: 'search cannot exceed 100 characters' });
  }

  if (category && !EVENT_CATEGORIES.includes(category)) {
    errors.push({ field: 'category', message: `category must be one of: ${EVENT_CATEGORIES.join(', ')}` });
  }

  if (status && !EVENT_STATUSES.includes(status)) {
    errors.push({ field: 'status', message: `status must be one of: ${EVENT_STATUSES.join(', ')}` });
  }

  if (from && Number.isNaN(from.getTime())) {
    errors.push({ field: 'from', message: 'from must be a valid date' });
  }

  if (to && Number.isNaN(to.getTime())) {
    errors.push({ field: 'to', message: 'to must be a valid date' });
  }

  if (from && to && !Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && from > to) {
    errors.push({ field: 'from', message: 'from cannot be later than to' });
  }

  if (!SORT_FIELDS.includes(sort)) {
    errors.push({ field: 'sort', message: `sort must be one of: ${SORT_FIELDS.join(', ')}` });
  }

  if (!SORT_ORDERS.includes(order)) {
    errors.push({ field: 'order', message: `order must be one of: ${SORT_ORDERS.join(', ')}` });
  }

  if (page === null) {
    errors.push({ field: 'page', message: 'page must be a positive integer' });
  }

  if (limit === null) {
    errors.push({ field: 'limit', message: 'limit must be an integer between 1 and 50' });
  }

  if (errors.length > 0) {
    return next(new AppError(400, 'INVALID_QUERY', 'Query validation failed', errors));
  }

  req.eventQuery = { search, category, status, from, to, sort, order, page, limit };
  return next();
}
