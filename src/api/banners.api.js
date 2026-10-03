import { shopApi, unwrap } from './client';

export function getBanners(placement) {
  return unwrap(shopApi.get('/banners', { params: { placement } }));
}
