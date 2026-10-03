import { adminApi, unwrap } from '../client';

export function listReviews(params) {
  return adminApi.get('/reviews', { params }).then((res) => res.data);
}

export function createReview(payload) {
  return unwrap(adminApi.post('/reviews', payload));
}

export function approveReview(id) {
  return unwrap(adminApi.put(`/reviews/${id}/approve`));
}

export function rejectReview(id) {
  return unwrap(adminApi.put(`/reviews/${id}/reject`));
}

export function deleteReview(id) {
  return unwrap(adminApi.delete(`/reviews/${id}`));
}
