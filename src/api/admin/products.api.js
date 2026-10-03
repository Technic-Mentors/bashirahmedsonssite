import { adminApi, unwrap } from '../client';

export function listProducts(params) {
  return adminApi.get('/products', { params }).then((res) => res.data);
}

export function getLowStock() {
  return unwrap(adminApi.get('/products/low-stock'));
}

export function getProduct(id) {
  return unwrap(adminApi.get(`/products/${id}`));
}

export function createProduct(payload) {
  return unwrap(adminApi.post('/products', payload));
}

export function updateProduct(id, payload) {
  return unwrap(adminApi.put(`/products/${id}`, payload));
}

export function deleteProduct(id) {
  return unwrap(adminApi.delete(`/products/${id}`));
}

export function addVariant(productId, payload) {
  return unwrap(adminApi.post(`/products/${productId}/variants`, payload));
}

export function updateVariant(productId, variantId, payload) {
  return unwrap(adminApi.put(`/products/${productId}/variants/${variantId}`, payload));
}

export function deleteVariant(productId, variantId) {
  return unwrap(adminApi.delete(`/products/${productId}/variants/${variantId}`));
}

export function addProductImage(productId, file, { variantId, isPrimary } = {}) {
  const formData = new FormData();
  formData.append('image', file);
  if (variantId !== undefined && variantId !== null && variantId !== '') {
    formData.append('variantId', variantId);
  }
  if (isPrimary !== undefined) {
    formData.append('isPrimary', isPrimary ? 'true' : 'false');
  }
  return unwrap(adminApi.post(`/products/${productId}/images`, formData));
}

export function deleteProductImage(productId, imageId) {
  return unwrap(adminApi.delete(`/products/${productId}/images/${imageId}`));
}

export function setPrimaryImage(productId, imageId) {
  return unwrap(adminApi.put(`/products/${productId}/images/${imageId}/primary`));
}
