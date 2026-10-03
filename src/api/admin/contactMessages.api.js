import { adminApi } from '../client';

export function listContactMessages(params) {
  return adminApi.get('/contact-messages', { params }).then((res) => res.data);
}

export function markContactMessageRead(id) {
  return adminApi.put(`/contact-messages/${id}/read`).then((res) => res.data);
}
