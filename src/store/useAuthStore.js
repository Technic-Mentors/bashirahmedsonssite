import { create } from 'zustand';
import { shopApi } from '../api/client';

export const useAuthStore = create((set, get) => ({
  customer: null,
  status: 'idle', // idle | loading | ready

  async fetchMe() {
    set({ status: 'loading' });
    try {
      const { data } = await shopApi.get('/auth/me');
      set({ customer: data.data, status: 'ready' });
    } catch {
      set({ customer: null, status: 'ready' });
    }
  },

  async login(email, password) {
    const { data } = await shopApi.post('/auth/login', { email, password });
    set({ customer: data.data, status: 'ready' });
    return data.data;
  },

  async register(payload) {
    const { data } = await shopApi.post('/auth/register', payload);
    set({ customer: data.data, status: 'ready' });
    return data.data;
  },

  async logout() {
    await shopApi.post('/auth/logout');
    set({ customer: null });
  },

  isAuthenticated() {
    return Boolean(get().customer);
  },
}));
