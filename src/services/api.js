import * as mock from './mock';

const BASE = import.meta.env.VITE_API_BASE || '/api';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export class ApiError extends Error {
  constructor(status, error) {
    super(error?.message || 'Something went wrong. Try again.');
    this.status = status;
    this.code = error?.code;
    this.requestId = error?.requestId;
  }
}

// Session lives in an HttpOnly cookie set by the server: we never touch tokens in JS.
// X-Requested-With is a custom header that cross-site forms cannot send (basic CSRF defence;
// the backend should also require it on state-changing routes).
async function request(method, path, body, extraHeaders = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...extraHeaders },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, { code: 'NETWORK', message: 'Could not reach the server. Check your connection.' });
  }
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data?.error);
  return data;
}

const real = {
  register: (p) => request('POST', '/auth/register', p),
  login: (p) => request('POST', '/auth/login', p),
  logout: () => request('POST', '/auth/logout'),
  me: () => request('GET', '/auth/me'),
  accounts: () => request('GET', '/accounts/me'),
  transactions: () => request('GET', '/transactions'),
  createTransfer: ({ idempotencyKey, ...p }) => request('POST', '/transfers', p, { 'Idempotency-Key': idempotencyKey }),
  updateProfile: (p) => request('PATCH', '/profile', p),
};

export const api = USE_MOCK ? mock.api : real;
