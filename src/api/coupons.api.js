import { shopApi, unwrap } from './client';

export function previewCoupon(code) {
  return unwrap(shopApi.post('/coupons/preview', { code }));
}
