import { adminApi, unwrap } from '../client';

export function getDashboard(params) {
  return unwrap(adminApi.get('/dashboard', { params }));
}
