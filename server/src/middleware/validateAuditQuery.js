import { AUDIT_ACTIONS } from '../models/AuditLog.js';
import { AppError } from '../utils/AppError.js';

function parseDate(value, field, details) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    details.push({ field, message: `${field} must be a valid date` });
    return undefined;
  }
  return date;
}

export function validateAuditQuery(req, res, next) {
  const details = [];
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const action = req.query.action?.trim().toLowerCase();
  const from = parseDate(req.query.from, 'from', details);
  const to = parseDate(req.query.to, 'to', details);

  if (!Number.isInteger(page) || page < 1) details.push({ field: 'page', message: 'page must be a positive integer' });
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    details.push({ field: 'limit', message: 'limit must be an integer from 1 to 100' });
  }
  if (action && !AUDIT_ACTIONS.includes(action)) {
    details.push({ field: 'action', message: 'action is not supported' });
  }
  if (from && to && from > to) details.push({ field: 'from', message: 'from cannot be later than to' });

  if (details.length) return next(new AppError(400, 'INVALID_AUDIT_QUERY', 'Audit query validation failed', details));
  req.auditQuery = { page, limit, action, from, to };
  return next();
}
