import { adminApi, unwrap } from '../client';

export function listCoupons(params) {
  return adminApi.get('/coupons', { params }).then((res) => res.data);
}

export function getCoupon(id) {
  return unwrap(adminApi.get(`/coupons/${id}`));
}

export function createCoupon(payload) {
  return unwrap(adminApi.post('/coupons', payload));
}

export function updateCoupon(id, payload) {
  return unwrap(adminApi.put(`/coupons/${id}`, payload));
}

export function deleteCoupon(id) {
  return unwrap(adminApi.delete(`/coupons/${id}`));
}
