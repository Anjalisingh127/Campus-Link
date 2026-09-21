import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('GET /api/health', () => {
  it('returns service health information', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      service: 'campus-connect-api',
    });
    expect(response.body.timestamp).toBeTypeOf('string');
  });
});

describe('unknown API route', () => {
  it('returns a consistent 404 response', async () => {
    const response = await request(app).get('/api/unknown');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('ROUTE_NOT_FOUND');
  });
});
