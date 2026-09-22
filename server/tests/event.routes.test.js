import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '../src/utils/AppError.js';

vi.mock('../src/services/eventService.js', () => ({
  listEvents: vi.fn(),
  getEventById: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
}));

const eventService = await import('../src/services/eventService.js');
const { app } = await import('../src/app.js');

const eventId = '68d000000000000000000001';
const eventPayload = {
  title: 'Cloud Computing Workshop',
  description: 'A practical workshop covering cloud computing fundamentals.',
  category: 'workshop',
  organizer: 'Cloud Computing Club',
  venue: 'Engineering Block A',
  eventDate: '2026-11-20T10:00:00.000Z',
  registrationUrl: 'https://example.com/register',
  tags: ['cloud', 'workshop'],
  status: 'published',
};

describe('Event API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns an event collection', async () => {
    eventService.listEvents.mockResolvedValue({
      events: [{ id: eventId, ...eventPayload }],
      pagination: { page: 1, limit: 10, total: 1, pages: 1 },
    });

    const response = await request(app).get('/api/events');

    expect(response.status).toBe(200);
    expect(response.body.meta.total).toBe(1);
  });

  it('normalizes discovery query parameters', async () => {
    eventService.listEvents.mockResolvedValue({
      events: [],
      pagination: { page: 2, limit: 5, total: 0, pages: 0 },
    });

    const response = await request(app).get(
      '/api/events?search=cloud&category=WORKSHOP&status=PUBLISHED&page=2&limit=5&sort=title&order=desc',
    );

    expect(response.status).toBe(200);
    expect(eventService.listEvents).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'cloud',
        category: 'workshop',
        status: 'published',
        page: 2,
        limit: 5,
        sort: 'title',
        order: 'desc',
      }),
    );
  });

  it('rejects an unsupported category filter', async () => {
    const response = await request(app).get('/api/events?category=invalid');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_QUERY');
  });

  it('rejects an invalid date range', async () => {
    const response = await request(app).get('/api/events?from=2026-12-01&to=2026-11-01');

    expect(response.status).toBe(400);
    expect(response.body.error.details).toContainEqual({
      field: 'from',
      message: 'from cannot be later than to',
    });
  });

  it('rejects invalid pagination', async () => {
    const response = await request(app).get('/api/events?page=0&limit=100');

    expect(response.status).toBe(400);
    expect(response.body.error.details).toHaveLength(2);
  });

  it('returns one event by ID', async () => {
    eventService.getEventById.mockResolvedValue({ id: eventId, ...eventPayload });

    const response = await request(app).get(`/api/events/${eventId}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(eventId);
  });

  it('rejects an invalid event ID', async () => {
    const response = await request(app).get('/api/events/not-an-object-id');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_EVENT_ID');
  });

  it('returns 404 when an event does not exist', async () => {
    eventService.getEventById.mockRejectedValue(new AppError(404, 'EVENT_NOT_FOUND', 'Event was not found'));

    const response = await request(app).get(`/api/events/${eventId}`);

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('EVENT_NOT_FOUND');
  });

  it('creates a valid event', async () => {
    eventService.createEvent.mockResolvedValue({ id: eventId, ...eventPayload });

    const response = await request(app).post('/api/events').send(eventPayload);

    expect(response.status).toBe(201);
    expect(response.body.data.id).toBe(eventId);
  });

  it('rejects an invalid creation request', async () => {
    const response = await request(app).post('/api/events').send({ ...eventPayload, title: '' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details).toContainEqual({ field: 'title', message: 'title is required' });
  });

  it('updates a valid event', async () => {
    const updatedEvent = { id: eventId, ...eventPayload, venue: 'Main Auditorium' };
    eventService.updateEvent.mockResolvedValue(updatedEvent);

    const response = await request(app)
      .put(`/api/events/${eventId}`)
      .send({ ...eventPayload, venue: 'Main Auditorium' });

    expect(response.status).toBe(200);
    expect(response.body.data.venue).toBe('Main Auditorium');
  });

  it('deletes an event', async () => {
    eventService.deleteEvent.mockResolvedValue();

    const response = await request(app).delete(`/api/events/${eventId}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});
