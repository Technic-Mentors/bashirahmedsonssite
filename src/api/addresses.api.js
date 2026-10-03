import { shopApi, unwrap } from './client';

export function getAddresses() {
  return unwrap(shopApi.get('/addresses'));
}

export function createAddress(data) {
  return unwrap(shopApi.post('/addresses', data));
}

export function updateAddress(id, data) {
  return unwrap(shopApi.put(`/addresses/${id}`, data));
}

export function deleteAddress(id) {
  return unwrap(shopApi.delete(`/addresses/${id}`));
}

export function setDefaultAddress(id) {
  return unwrap(shopApi.put(`/addresses/${id}/default`));
}
