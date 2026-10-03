import { adminApi, unwrap } from '../client';

export function getSettings() {
  return unwrap(adminApi.get('/settings'));
}

export function updateSettings(payload) {
  return unwrap(adminApi.put('/settings', payload));
}
