import { env } from '../config/env.js';
import { ApiError } from './eventsApi.js';

function buildQuery(query) {
  const parameters = new URLSearchParams();
  if (query.action) parameters.set('action', query.action);
  if (query.from) parameters.set('from', new Date(`${query.from}T00:00:00`).toISOString());
  if (query.to) parameters.set('to', new Date(`${query.to}T23:59:59.999`).toISOString());
  parameters.set('page', String(query.page));
  parameters.set('limit', String(query.limit));
  return parameters.toString();
}

async function request(path, token, { signal } = {}) {
  const response = await fetch(`${env.apiBaseUrl}/audit${path}`, {
    signal,
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? 'Audit request failed',
      response.status,
      payload?.error?.code ?? 'AUDIT_REQUEST_FAILED',
      payload?.error?.details ?? [],
    );
  }
  return payload;
}

export function getAuditLogs(query, token, options = {}) {
  return request(`?${buildQuery(query)}`, token, options);
}

export function getAuditSummary(token, options = {}) {
  return request('/summary', token, options);
}

export async function downloadAuditReport(token) {
  const response = await fetch(`${env.apiBaseUrl}/audit/export.csv`, {
    headers: { Accept: 'text/csv', Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new ApiError('Unable to download the operational audit report', response.status, 'AUDIT_DOWNLOAD_FAILED');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'event-audit-report.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
