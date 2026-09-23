import * as eventService from '../services/eventService.js';
import * as auditService from '../services/auditService.js';

export async function listEvents(req, res) {
  const result = await eventService.listEvents(req.eventQuery);
  res.status(200).json({ data: result.events, meta: result.pagination });
}

export async function getEvent(req, res) {
  const event = await eventService.getEventById(req.params.id);
  res.status(200).json({ data: event });
}

export async function createEvent(req, res) {
  const event = await eventService.createEvent(req.body);
  await auditService.recordEventAction({ action: 'event.created', event, actor: req.user });
  res.status(201).json({ data: event });
}

export async function updateEvent(req, res) {
  const event = await eventService.updateEvent(req.params.id, req.body);
  await auditService.recordEventAction({
    action: 'event.updated',
    event,
    actor: req.user,
    changes: Object.keys(req.body).sort(),
  });
  res.status(200).json({ data: event });
}

export async function deleteEvent(req, res) {
  const event = await eventService.deleteEvent(req.params.id);
  await auditService.recordEventAction({ action: 'event.deleted', event, actor: req.user });
  res.status(204).send();
}
