import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/models/User.js', () => ({
  User: { findById: vi.fn() },
  USER_ROLES: ['attendee', 'admin'],
}));

vi.mock('../src/services/configurationService.js', () => ({
  getConfiguration: vi.fn(),
  updateConfiguration: vi.fn(),
  listHistory: vi.fn(),
  restoreConfiguration: vi.fn(),
}));

const { env } = await import('../src/config/env.js');
const { User } = await import('../src/models/User.js');
const configurationService = await import('../src/services/configurationService.js');
const { app } = await import('../src/app.js');

const userId = '68d000000000000000000001';
const adminUser = { id: userId, name: 'Admin', email: 'admin@example.com', role: 'admin' };
const adminToken = jwt.sign({ role: 'admin' }, env.jwtSecret, { subject: userId, expiresIn: '1h' });
const settings = {
  siteName: 'CampusConnect',
  eventSubmissionEnabled: true,
  registrationEnabled: true,
  defaultPageSize: 6,
  maintenanceMessage: '',
};

describe('Configuration API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(adminUser);
  });

  it('returns public configuration', async () => {
    configurationService.getConfiguration.mockResolvedValue({ version: 1, settings });
    const response = await request(app).get('/api/config');
    expect(response.status).toBe(200);
    expect(response.body.data.settings.siteName).toBe('CampusConnect');
  });

  it('rejects updates without authentication', async () => {
    const response = await request(app).put('/api/config').send({ settings, changeReason: 'Update defaults' });
    expect(response.status).toBe(401);
  });

  it('validates configuration updates', async () => {
    const response = await request(app)
      .put('/api/config')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ settings: { ...settings, defaultPageSize: 100 }, changeReason: 'Update defaults' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('updates configuration as an administrator', async () => {
    configurationService.updateConfiguration.mockResolvedValue({ version: 2, settings });
    const response = await request(app)
      .put('/api/config')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ settings, changeReason: 'Update platform defaults' });
    expect(response.status).toBe(200);
    expect(configurationService.updateConfiguration).toHaveBeenCalledWith(settings, 'Update platform defaults', userId);
  });

  it('returns configuration history', async () => {
    configurationService.listHistory.mockResolvedValue({
      versions: [{ version: 2, action: 'updated' }],
      pagination: { page: 1, limit: 20, total: 1, pages: 1 },
    });
    const response = await request(app).get('/api/config/history').set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.meta.total).toBe(1);
  });

  it('restores a previous configuration version', async () => {
    configurationService.restoreConfiguration.mockResolvedValue({ version: 3, settings });
    const response = await request(app)
      .post('/api/config/restore/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ changeReason: 'Restore stable configuration' });
    expect(response.status).toBe(200);
    expect(configurationService.restoreConfiguration).toHaveBeenCalledWith(1, 'Restore stable configuration', userId);
  });
});
