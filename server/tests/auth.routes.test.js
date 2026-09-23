import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/services/authService.js', () => ({
  register: vi.fn(),
  login: vi.fn(),
  getPublicUser: vi.fn((user) => user),
}));

const authService = await import('../src/services/authService.js');
const { app } = await import('../src/app.js');

describe('Auth API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('registers a valid attendee account', async () => {
    authService.register.mockResolvedValue({ token: 'token', user: { id: '1', role: 'attendee' } });
    const response = await request(app).post('/api/auth/register').send({
      name: 'Anjali Singh', email: 'anjali@example.com', password: 'StrongPass123',
    });
    expect(response.status).toBe(201);
    expect(response.body.data.user.role).toBe('attendee');
  });

  it('rejects invalid registration data', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'A', email: 'invalid', password: 'short',
    });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details).toHaveLength(3);
  });

  it('logs in with valid input', async () => {
    authService.login.mockResolvedValue({ token: 'token', user: { id: '1', role: 'admin' } });
    const response = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com', password: 'StrongPass123',
    });
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBe('token');
  });

  it('rejects a protected request without a token', async () => {
    const response = await request(app).get('/api/auth/me');
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
  });
});
