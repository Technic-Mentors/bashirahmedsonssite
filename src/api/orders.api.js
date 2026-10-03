import { shopApi, unwrap } from './client';

export function checkout(payload) {
  return unwrap(shopApi.post('/orders', payload));
}

export function trackOrder({ orderNumber, phone }) {
  return unwrap(shopApi.post('/track-order', { orderNumber, phone }));
}

export function getMyOrders() {
  return unwrap(shopApi.get('/orders'));
}

export function getMyOrder(id) {
  return unwrap(shopApi.get(`/orders/${id}`));
}

export function cancelOrder(id, reason) {
  return unwrap(shopApi.post(`/orders/${id}/cancel`, { reason }));
}
