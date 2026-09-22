import { Event } from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

export async function listEvents() {
  return Event.find().sort({ eventDate: 1, createdAt: -1 });
}

export async function getEventById(id) {
  const event = await Event.findById(id);

  if (!event) {
    throw new AppError(404, 'EVENT_NOT_FOUND', 'Event was not found');
  }

  return event;
}

export function createEvent(payload) {
  return Event.create(payload);
}

export async function updateEvent(id, payload) {
  const event = await Event.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    throw new AppError(404, 'EVENT_NOT_FOUND', 'Event was not found');
  }

  return event;
}

export async function deleteEvent(id) {
  const event = await Event.findByIdAndDelete(id);

  if (!event) {
    throw new AppError(404, 'EVENT_NOT_FOUND', 'Event was not found');
  }
}
