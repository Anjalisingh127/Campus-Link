import { describe, expect, it } from 'vitest';
import { buildEventFilter, escapeRegularExpression } from '../src/services/eventService.js';

describe('event discovery service helpers', () => {
  it('escapes regular expression control characters', () => {
    expect(escapeRegularExpression('cloud.*(2026)')).toBe('cloud\\.\\*\\(2026\\)');
  });

  it('builds a compound discovery filter', () => {
    const from = new Date('2026-10-01T00:00:00.000Z');
    const to = new Date('2026-12-31T00:00:00.000Z');
    const filter = buildEventFilter({
      search: 'cloud.*',
      category: 'workshop',
      status: 'published',
      from,
      to,
    });

    expect(filter.category).toBe('workshop');
    expect(filter.status).toBe('published');
    expect(filter.eventDate).toEqual({ $gte: from, $lte: to });
    expect(filter.$or).toHaveLength(4);
    expect(filter.$or[0].title.source).toBe('cloud\\.\\*');
  });

  it('omits optional filters when they are absent', () => {
    expect(
      buildEventFilter({ search: '', category: undefined, status: undefined, from: undefined, to: undefined }),
    ).toEqual({});
  });
});
