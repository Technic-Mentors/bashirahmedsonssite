import { shopApi } from './client';

export function getCategories() {
  return shopApi.get('/categories').then((res) => res.data.data);
}

export function getProducts(params = {}) {
  return shopApi.get('/products', { params }).then((res) => ({ data: res.data.data, meta: res.data.meta }));
}

export function getFeaturedProducts(limit) {
  return shopApi.get('/products/featured', { params: limit ? { limit } : {} }).then((res) => res.data.data);
}

export function getProductBySlug(slug) {
  return shopApi.get(`/products/${slug}`).then((res) => res.data.data);
}
