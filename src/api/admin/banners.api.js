import { adminApi, unwrap } from '../client';

export function listBanners(params) {
  return adminApi.get('/banners', { params }).then((res) => res.data);
}

export function createBanner(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    formData.append(key, value);
  });
  return unwrap(adminApi.post('/banners', formData));
}

export function updateBanner(id, payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    formData.append(key, value);
  });
  return unwrap(adminApi.put(`/banners/${id}`, formData));
}

export function deleteBanner(id) {
  return unwrap(adminApi.delete(`/banners/${id}`));
}
