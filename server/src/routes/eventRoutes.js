import { Router } from 'express';
import * as eventController from '../controllers/eventController.js';
import { authenticate, authorize } from '../middleware/authenticate.js';
import { validateEvent } from '../middleware/validateEvent.js';
import { validateEventQuery } from '../middleware/validateEventQuery.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import { requireEventSubmissions } from '../middleware/requireEventSubmissions.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const adminOnly = [asyncHandler(authenticate), authorize('admin')];

router
  .route('/')
  .get(validateEventQuery, asyncHandler(eventController.listEvents))
  .post(...adminOnly, asyncHandler(requireEventSubmissions), validateEvent, asyncHandler(eventController.createEvent));

router
  .route('/:id')
  .get(validateObjectId, asyncHandler(eventController.getEvent))
  .put(...adminOnly, validateObjectId, validateEvent, asyncHandler(eventController.updateEvent))
  .delete(...adminOnly, validateObjectId, asyncHandler(eventController.deleteEvent));

export default router;
