import { describe, expect, it } from 'vitest';
import { Event } from '../src/models/Event.js';

const validEvent = {
  title: 'Cloud Computing Workshop',
  description: 'A practical workshop covering cloud computing fundamentals.',
  category: 'workshop',
  organizer: 'Cloud Computing Club',
  venue: 'Engineering Block A',
  eventDate: '2026-11-20T10:00:00.000Z',
  registrationUrl: 'https://example.com/register',
  tags: ['Cloud', 'Workshop', 'cloud'],
  status: 'published',
};

describe('Event model', () => {
  it('accepts a valid event and normalizes tags', async () => {
    const event = new Event(validEvent);

    await expect(event.validate()).resolves.toBeUndefined();
    expect(event.tags).toEqual(['cloud', 'workshop']);
  });

  it('rejects a missing required title', async () => {
    const event = new Event({ ...validEvent, title: undefined });

    await expect(event.validate()).rejects.toMatchObject({ name: 'ValidationError' });
  });

  it('rejects an unsupported category', async () => {
    const event = new Event({ ...validEvent, category: 'career-fair' });

    await expect(event.validate()).rejects.toMatchObject({ name: 'ValidationError' });
  });

  it('rejects more than ten tags', async () => {
    const tags = Array.from({ length: 11 }, (_, index) => `tag-${index}`);
    const event = new Event({ ...validEvent, tags });

    await expect(event.validate()).rejects.toMatchObject({ name: 'ValidationError' });
  });
});
