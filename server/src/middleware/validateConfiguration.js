import { AppError } from '../utils/AppError.js';

const settingKeys = ['siteName', 'eventSubmissionEnabled', 'registrationEnabled', 'defaultPageSize', 'maintenanceMessage'];

function validateReason(value, errors) {
  if (typeof value !== 'string' || value.trim().length < 5 || value.trim().length > 240) {
    errors.push({ field: 'changeReason', message: 'changeReason must contain between 5 and 240 characters' });
  }
}

export function validateConfigurationUpdate(req, res, next) {
  const errors = [];
  const settings = req.body.settings;
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    errors.push({ field: 'settings', message: 'settings must be an object' });
  } else {
    const unknown = Object.keys(settings).filter((key) => !settingKeys.includes(key));
    if (unknown.length) errors.push({ field: 'settings', message: `unsupported settings: ${unknown.join(', ')}` });
    if (typeof settings.siteName !== 'string' || settings.siteName.trim().length < 2 || settings.siteName.trim().length > 80) errors.push({ field: 'siteName', message: 'siteName must contain between 2 and 80 characters' });
    if (typeof settings.eventSubmissionEnabled !== 'boolean') errors.push({ field: 'eventSubmissionEnabled', message: 'eventSubmissionEnabled must be a boolean' });
    if (typeof settings.registrationEnabled !== 'boolean') errors.push({ field: 'registrationEnabled', message: 'registrationEnabled must be a boolean' });
    if (!Number.isInteger(settings.defaultPageSize) || settings.defaultPageSize < 1 || settings.defaultPageSize > 50) errors.push({ field: 'defaultPageSize', message: 'defaultPageSize must be an integer between 1 and 50' });
    if (typeof settings.maintenanceMessage !== 'string' || settings.maintenanceMessage.length > 300) errors.push({ field: 'maintenanceMessage', message: 'maintenanceMessage cannot exceed 300 characters' });
  }
  validateReason(req.body.changeReason, errors);
  return errors.length ? next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', errors)) : next();
}

export function validateRestore(req, res, next) {
  const version = Number(req.params.version);
  const errors = [];
  if (!Number.isInteger(version) || version < 1) errors.push({ field: 'version', message: 'version must be a positive integer' });
  validateReason(req.body.changeReason, errors);
  if (errors.length) return next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed', errors));
  req.configurationVersion = version;
  return next();
}

export function validateHistoryQuery(req, res, next) {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 20 : Number(req.query.limit);
  const errors = [];
  if (!Number.isInteger(page) || page < 1) errors.push({ field: 'page', message: 'page must be a positive integer' });
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) errors.push({ field: 'limit', message: 'limit must be an integer between 1 and 50' });
  if (errors.length) return next(new AppError(400, 'INVALID_QUERY', 'Query validation failed', errors));
  req.configurationQuery = { page, limit };
  return next();
}
