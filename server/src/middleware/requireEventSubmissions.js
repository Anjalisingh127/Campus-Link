import * as configurationService from '../services/configurationService.js';
import { AppError } from '../utils/AppError.js';

export async function requireEventSubmissions(req, res, next) {
  const configuration = await configurationService.getConfiguration();
  if (!configuration.settings.eventSubmissionEnabled) {
    return next(new AppError(503, 'EVENT_SUBMISSIONS_DISABLED', 'Event submissions are currently disabled by platform configuration'));
  }
  return next();
}
