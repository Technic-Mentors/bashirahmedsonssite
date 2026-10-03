import { adminApi, unwrap } from '../client';

export function getShipping() {
  return unwrap(adminApi.get('/shipping'));
}

export function updateShipping(payload) {
  return unwrap(adminApi.put('/shipping', payload));
}

export function createShippingZone(payload) {
  return unwrap(adminApi.post('/shipping/zones', payload));
}

export function updateShippingZone(id, payload) {
  return unwrap(adminApi.put(`/shipping/zones/${id}`, payload));
}

export function deleteShippingZone(id) {
  return unwrap(adminApi.delete(`/shipping/zones/${id}`));
}
