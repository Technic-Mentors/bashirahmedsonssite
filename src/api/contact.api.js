import { shopApi } from './client';

export function submitContactMessage(payload) {
  return shopApi.post('/contact', payload).then((res) => res.data);
}
