import { Router } from 'express';
import * as configurationController from '../controllers/configurationController.js';
import { authenticate, authorize } from '../middleware/authenticate.js';
import { validateConfigurationUpdate, validateHistoryQuery, validateRestore } from '../middleware/validateConfiguration.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const adminOnly = [asyncHandler(authenticate), authorize('admin')];

router.get('/', asyncHandler(configurationController.getConfiguration));
router.put('/', ...adminOnly, validateConfigurationUpdate, asyncHandler(configurationController.updateConfiguration));
router.get('/history', ...adminOnly, validateHistoryQuery, asyncHandler(configurationController.listHistory));
router.post('/restore/:version', ...adminOnly, validateRestore, asyncHandler(configurationController.restoreConfiguration));

export default router;
