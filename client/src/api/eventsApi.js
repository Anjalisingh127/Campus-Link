import { env } from '../config/env.js';

export class ApiError extends Error {
  constructor(message, status, code, details = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function buildQueryString(query) {
  const parameters = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') parameters.set(key, String(value));
  });
  return parameters.toString();
}

async function request(path, options = {}) {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers: { Accept: 'application/json', ...options.headers },
  });
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? 'The request could not be completed',
      response.status,
      payload?.error?.code ?? 'REQUEST_FAILED',
      payload?.error?.details ?? [],
    );
  }
  return payload;
}

export function getEvents(query, { signal } = {}) {
  return request(`/events?${buildQueryString(query)}`, { signal });
}

export function getEvent(eventId, { signal } = {}) {
  return request(`/events/${eventId}`, { signal });
}

export function createEvent(event, token) {
  return request('/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(event),
  });
}
