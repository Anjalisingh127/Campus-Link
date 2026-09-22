import { env } from '../config/env.js';

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

function buildQueryString(query) {
  const parameters = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') parameters.set(key, String(value));
  });
  return parameters.toString();
}

export async function getEvents(query, { signal } = {}) {
  const response = await fetch(`${env.apiBaseUrl}/events?${buildQueryString(query)}`, {
    headers: { Accept: 'application/json' },
    signal,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? 'Unable to load events',
      response.status,
      payload?.error?.code ?? 'REQUEST_FAILED',
    );
  }
  return payload;
}
