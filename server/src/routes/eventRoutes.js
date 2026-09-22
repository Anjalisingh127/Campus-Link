import { Router } from 'express';
import * as eventController from '../controllers/eventController.js';
import { validateEvent } from '../middleware/validateEvent.js';
import { validateEventQuery } from '../middleware/validateEventQuery.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router
  .route('/')
  .get(validateEventQuery, asyncHandler(eventController.listEvents))
  .post(validateEvent, asyncHandler(eventController.createEvent));

router
  .route('/:id')
  .get(validateObjectId, asyncHandler(eventController.getEvent))
  .put(validateObjectId, validateEvent, asyncHandler(eventController.updateEvent))
  .delete(validateObjectId, asyncHandler(eventController.deleteEvent));

export default router;
