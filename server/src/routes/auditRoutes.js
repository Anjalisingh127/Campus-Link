import { Router } from 'express';
import * as auditController from '../controllers/auditController.js';
import { authenticate, authorize } from '../middleware/authenticate.js';
import { validateAuditQuery } from '../middleware/validateAuditQuery.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const adminOnly = [asyncHandler(authenticate), authorize('admin')];

router.get('/', ...adminOnly, validateAuditQuery, asyncHandler(auditController.listAuditLogs));
router.get('/summary', ...adminOnly, asyncHandler(auditController.getAuditSummary));
router.get('/export.csv', ...adminOnly, asyncHandler(auditController.exportAuditCsv));

export default router;
