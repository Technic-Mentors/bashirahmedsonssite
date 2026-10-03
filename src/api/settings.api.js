import { shopApi, unwrap } from './client';

export function getPublicSettings() {
  return unwrap(shopApi.get('/settings'));
}

export function getShippingQuote(city, subtotal) {
  return unwrap(shopApi.get('/settings/shipping-quote', { params: { city, subtotal } }));
}
