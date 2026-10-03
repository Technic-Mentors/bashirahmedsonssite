import { shopApi, unwrap } from './client';

export function notifyMe({ variantId, email }) {
  return unwrap(shopApi.post('/notify-me', { variantId, email }));
}
