import { adminApi, unwrap } from '../client';

export function listCategories() {
  return unwrap(adminApi.get('/categories'));
}

export function getCategory(id) {
  return unwrap(adminApi.get(`/categories/${id}`));
}

export function createCategory(payload) {
  return unwrap(adminApi.post('/categories', payload));
}

export function updateCategory(id, payload) {
  return unwrap(adminApi.put(`/categories/${id}`, payload));
}

export function deleteCategory(id) {
  return unwrap(adminApi.delete(`/categories/${id}`));
}

export function uploadCategoryBanner(id, file) {
  const formData = new FormData();
  formData.append('image', file);
  return unwrap(adminApi.post(`/categories/${id}/banner`, formData));
}
