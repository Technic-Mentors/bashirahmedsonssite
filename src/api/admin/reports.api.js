import { adminApi } from '../client';

export async function getSalesReport({ dateFrom, dateTo, topLimit, status } = {}) {
  const { data } = await adminApi.get('/reports/sales', { params: { dateFrom, dateTo, topLimit, status } });
  return data.data;
}

export function getSalesExportUrl({ dateFrom, dateTo, status } = {}) {
  const params = new URLSearchParams();
  if (dateFrom) params.set('dateFrom', dateFrom);
  if (dateTo) params.set('dateTo', dateTo);
  if (status) params.set('status', status);
  return `/api/v1/admin/reports/sales/export?${params.toString()}`;
}
