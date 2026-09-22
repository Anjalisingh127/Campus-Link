import * as eventService from '../services/eventService.js';

export async function listEvents(req, res) {
  const events = await eventService.listEvents();
  res.status(200).json({ data: events, meta: { count: events.length } });
}

export async function getEvent(req, res) {
  const event = await eventService.getEventById(req.params.id);
  res.status(200).json({ data: event });
}

export async function createEvent(req, res) {
  const event = await eventService.createEvent(req.body);
  res.status(201).json({ data: event });
}

export async function updateEvent(req, res) {
  const event = await eventService.updateEvent(req.params.id, req.body);
  res.status(200).json({ data: event });
}

export async function deleteEvent(req, res) {
  await eventService.deleteEvent(req.params.id);
  res.status(204).send();
}
