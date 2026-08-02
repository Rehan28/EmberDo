const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Daily
  getAllDaily: () => request('/daily'),
  getDaily: (date) => request(`/daily/${date}`),
  putDaily: (date, data) => request(`/daily/${date}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Weekly
  getAllWeekly: () => request('/weekly'),
  putWeekly: (weekStart, data) => request(`/weekly/${weekStart}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Monthly
  getAllMonthly: () => request('/monthly'),
  putMonthly: (month, data) => request(`/monthly/${month}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Habits (singleton)
  getHabits: () => request('/habits'),
  putHabits: (data) => request('/habits', { method: 'PUT', body: JSON.stringify(data) }),

  // Notes (singleton)
  getNotes: () => request('/notes'),
  putNotes: (data) => request('/notes', { method: 'PUT', body: JSON.stringify(data) }),

  // Meta (singleton)
  getMeta: () => request('/meta'),
  putMeta: (data) => request('/meta', { method: 'PUT', body: JSON.stringify(data) }),
};
