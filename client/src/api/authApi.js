import { env } from '../config/env.js';
import { ApiError } from './eventsApi.js';

async function authRequest(path, options = {}) {
  const response = await fetch(`${env.apiBaseUrl}/auth${path}`, {
    ...options,
    headers: { Accept: 'application/json', ...options.headers },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? 'Authentication request failed',
      response.status,
      payload?.error?.code ?? 'AUTH_REQUEST_FAILED',
      payload?.error?.details ?? [],
    );
  }
  return payload;
}

export function login(credentials) {
  return authRequest('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
}

export function register(account) {
  return authRequest('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  });
}

export function getCurrentUser(token, { signal } = {}) {
  return authRequest('/me', {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
}
