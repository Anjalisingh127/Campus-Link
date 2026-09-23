import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/services/auditService.js', () => ({
  listAuditLogs: vi.fn(),
  getAuditSummary: vi.fn(),
  getAuditLogsForExport: vi.fn(),
  recordEventAction: vi.fn(),
}));

vi.mock('../src/models/User.js', () => ({
  User: { findById: vi.fn() },
  USER_ROLES: ['attendee', 'admin'],
}));

const { env } = await import('../src/config/env.js');
const auditService = await import('../src/services/auditService.js');
const { User } = await import('../src/models/User.js');
const { app } = await import('../src/app.js');

const userId = '68d000000000000000000001';
const admin = { id: userId, name: 'Admin', email: 'admin@example.com', role: 'admin' };
const adminToken = jwt.sign({ email: admin.email, role: admin.role }, env.jwtSecret, {
  subject: userId,
  expiresIn: '1h',
});
const createdAt = new Date('2026-09-23T14:30:00.000Z');
const auditLog = {
  id: '68d000000000000000000002',
  action: 'event.created',
  resourceType: 'event',
  resourceId: '68d000000000000000000003',
  description: 'Event "Cloud Workshop" was created',
  actorSnapshot: { name: admin.name, email: admin.email },
  metadata: { eventTitle: 'Cloud Workshop' },
  createdAt,
};

describe('Audit API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    User.findById.mockResolvedValue(admin);
  });

  it('rejects unauthenticated access', async () => {
    const response = await request(app).get('/api/audit');
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
  });

  it('returns paginated audit history to an administrator', async () => {
    auditService.listAuditLogs.mockResolvedValue({
      logs: [auditLog],
      pagination: { page: 1, limit: 20, total: 1, pages: 1 },
    });
    const response = await request(app).get('/api/audit?action=event.created').set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.meta.total).toBe(1);
    expect(auditService.listAuditLogs).toHaveBeenCalledWith(expect.objectContaining({ action: 'event.created' }));
  });

  it('rejects invalid audit filters', async () => {
    const response = await request(app).get('/api/audit?action=invalid&page=0').set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_AUDIT_QUERY');
    expect(response.body.error.details).toHaveLength(2);
  });

  it('returns an operational action summary', async () => {
    auditService.getAuditSummary.mockResolvedValue({
      total: 3,
      actions: { 'event.created': 1, 'event.updated': 1, 'event.deleted': 1 },
    });
    const response = await request(app).get('/api/audit/summary').set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data.total).toBe(3);
  });

  it('exports the audit trail as CSV', async () => {
    auditService.getAuditLogsForExport.mockResolvedValue([auditLog]);
    const response = await request(app).get('/api/audit/export.csv').set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/csv');
    expect(response.headers['content-disposition']).toContain('event-audit-report.csv');
    expect(response.text).toContain('event.created');
    expect(response.text).toContain('Cloud Workshop');
  });
});
