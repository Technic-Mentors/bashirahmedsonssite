import { shopApi, unwrap } from './client';

export function getWishlist() {
  return unwrap(shopApi.get('/wishlist'));
}

export function addToWishlist(productId) {
  return unwrap(shopApi.post(`/wishlist/${productId}`));
}

export function removeFromWishlist(productId) {
  return unwrap(shopApi.delete(`/wishlist/${productId}`));
}
