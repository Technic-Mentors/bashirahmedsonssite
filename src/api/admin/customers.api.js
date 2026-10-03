import { adminApi, unwrap } from '../client';

export function listCustomers(params) {
  return adminApi.get('/customers', { params }).then((res) => res.data);
}

export function getCustomer(id) {
  return unwrap(adminApi.get(`/customers/${id}`));
}

export function blockCustomer(id, isBlocked) {
  return unwrap(adminApi.put(`/customers/${id}/block`, { isBlocked }));
}
