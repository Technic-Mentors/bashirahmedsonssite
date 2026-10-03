import { shopApi, unwrap } from './client';

export function getProductReviews(productId) {
  return unwrap(shopApi.get(`/reviews/product/${productId}`));
}

export function getReviewableOrderItems() {
  return unwrap(shopApi.get('/reviews/reviewable'));
}

export function submitReview(payload) {
  return unwrap(shopApi.post('/reviews', payload));
}
