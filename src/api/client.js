import axios from 'axios';

export const API_ORIGIN = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:3008' : 'https://backend.bashirahmedsons.com');

export const shopApi = axios.create({
  baseURL: `${API_ORIGIN}/api/v1/shop`,
  withCredentials: true,
});

export const adminApi = axios.create({
  baseURL: `${API_ORIGIN}/api/v1/admin`,
  withCredentials: true,
});

function attachRefreshInterceptor(client, refreshPath, onAuthFailure) {
  let refreshPromise = null;

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { config, response } = error;
      if (response?.status !== 401 || config._retried || config.url === refreshPath) {
        return Promise.reject(error);
      }
      config._retried = true;

      try {
        refreshPromise ??= client.post(refreshPath).finally(() => {
          refreshPromise = null;
        });
        await refreshPromise;
        return client(config);
      } catch {
        onAuthFailure?.();
        return Promise.reject(error);
      }
    },
  );
}

attachRefreshInterceptor(shopApi, '/auth/refresh');
attachRefreshInterceptor(adminApi, '/auth/refresh');

export function unwrap(promise) {
  return promise.then((res) => res.data.data);
}
