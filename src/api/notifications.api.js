import { shopApi, unwrap } from './client';

export function getMyNotifications() {
  return unwrap(shopApi.get('/notifications'));
}

export function markAllNotificationsRead() {
  return unwrap(shopApi.put('/notifications/read-all'));
}

export function markNotificationRead(id) {
  return unwrap(shopApi.put(`/notifications/${id}/read`));
}
