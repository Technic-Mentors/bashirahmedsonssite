import { create } from 'zustand';
import { adminApi } from '../api/client';

export const useAdminAuthStore = create((set, get) => ({
  admin: null,
  status: 'idle', // idle | loading | ready

  async fetchMe() {
    set({ status: 'loading' });
    try {
      const { data } = await adminApi.get('/auth/me');
      set({ admin: data.data, status: 'ready' });
    } catch {
      set({ admin: null, status: 'ready' });
    }
  },

  async login(email, password) {
    const { data } = await adminApi.post('/auth/login', { email, password });
    set({ admin: data.data, status: 'ready' });
    return data.data;
  },

  async logout() {
    await adminApi.post('/auth/logout');
    set({ admin: null });
  },

  async changePassword(currentPassword, newPassword) {
    await adminApi.put('/auth/password', { currentPassword, newPassword });
  },

  async updateProfile(name, email) {
    const { data } = await adminApi.put('/auth/profile', { name, email });
    set({ admin: data.data });
    return data.data;
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await adminApi.post('/auth/avatar', formData);
    set({ admin: data.data });
    return data.data;
  },

  isAuthenticated() {
    return Boolean(get().admin);
  },
}));
