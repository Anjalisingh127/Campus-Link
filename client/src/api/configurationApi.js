import { env } from '../config/env.js';
import { ApiError } from './eventsApi.js';

async function request(path, token, options = {}) {
  const response = await fetch(`${env.apiBaseUrl}/config${path}`, {
    ...options,
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? 'Configuration request failed',
      response.status,
      payload?.error?.code ?? 'CONFIGURATION_REQUEST_FAILED',
      payload?.error?.details ?? [],
    );
  }
  return payload;
}

export function getConfiguration(token, { signal } = {}) {
  return request('', token, { signal });
}

export function getConfigurationHistory(token, { signal } = {}) {
  return request('/history?page=1&limit=50', token, { signal });
}

export function updateConfiguration(settings, changeReason, token) {
  return request('', token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ settings, changeReason }),
  });
}

export function restoreConfiguration(version, changeReason, token) {
  return request(`/restore/${version}`, token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ changeReason }),
  });
}

export async function downloadConfigurationAudit(token) {
  const response = await fetch(`${env.apiBaseUrl}/config/history.csv`, {
    headers: { Accept: 'text/csv', Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new ApiError('Unable to download the audit report', response.status, 'AUDIT_DOWNLOAD_FAILED');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'configuration-history.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
