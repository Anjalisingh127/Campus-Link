import { Event } from '../models/Event.js';
import { AppError } from '../utils/AppError.js';

export function escapeRegularExpression(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildEventFilter({ search, category, status, from, to }) {
  const filter = {};

  if (search) {
    const pattern = new RegExp(escapeRegularExpression(search), 'i');
    filter.$or = [
      { title: pattern },
      { description: pattern },
      { organizer: pattern },
      { tags: pattern },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (status) {
    filter.status = status;
  }

  if (from || to) {
    filter.eventDate = {};

    if (from) {
      filter.eventDate.$gte = from;
    }

    if (to) {
      filter.eventDate.$lte = to;
    }
  }

  return filter;
}

export async function listEvents(query) {
  const filter = buildEventFilter(query);
  const direction = query.order === 'desc' ? -1 : 1;
  const skip = (query.page - 1) * query.limit;
  const sort = { [query.sort]: direction, _id: direction };

  const [events, total] = await Promise.all([
    Event.find(filter).sort(sort).skip(skip).limit(query.limit),
    Event.countDocuments(filter),
  ]);

  return {
    events,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: total === 0 ? 0 : Math.ceil(total / query.limit),
    },
  };
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
