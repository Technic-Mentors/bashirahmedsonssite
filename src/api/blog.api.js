import { shopApi } from './client';

export function getBlogCategories() {
  return shopApi.get('/blog/categories').then((res) => res.data.data);
}

export function getBlogPosts(params = {}) {
  return shopApi.get('/blog', { params }).then((res) => ({ data: res.data.data, meta: res.data.meta }));
}

export function getBlogPostBySlug(slug) {
  return shopApi.get(`/blog/${slug}`).then((res) => res.data.data);
}
