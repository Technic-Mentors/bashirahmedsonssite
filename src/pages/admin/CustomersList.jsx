import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listCustomers } from '../../api/admin/customers.api';
import { useAsync } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import { formatCurrency } from '../../utils/format';
import DataTable from '../../components/admin/table/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorState from '../../components/ui/ErrorState';

export default function CustomersList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const { data, loading, error, refetch } = useAsync(
    () => listCustomers({ search: debouncedSearch || undefined, page, pageSize: 10 }),
    [debouncedSearch, page],
  );

  const rows = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-charcoal">Customers</h1>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-stone-200 bg-white p-4">
        <div className="w-64">
          <Input
            label="Search"
            placeholder="Search by name, email or phone"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {error ? (
        <ErrorState message="Could not load customers." onRetry={refetch} />
      ) : (
        <DataTable
          loading={loading}
          rows={rows}
          onRowClick={(row) => navigate(`/admin/customers/${row.id}`)}
          emptyMessage="No customers found."
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone', render: (row) => row.phone || '-' },
            { key: 'order_count', label: 'Orders', render: (row) => row.order_count ?? row.orderCount ?? 0 },
            {
              key: 'lifetime_value',
              label: 'Lifetime Value',
              render: (row) => formatCurrency(row.lifetime_value ?? row.lifetimeValue),
            },
            {
              key: 'is_blocked',
              label: 'Status',
              render: (row) => (
                <Badge status={(row.is_blocked ?? row.isBlocked) ? 'inactive' : 'active'}>
                  {(row.is_blocked ?? row.isBlocked) ? 'Blocked' : 'Active'}
                </Badge>
              ),
            },
            {
              key: 'actions',
              label: '',
              render: (row) => (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/customers/${row.id}`);
                  }}
                >
                  View
                </Button>
              ),
            },
          ]}
          pagination={
            meta
              ? {
                  page: meta.page,
                  pageSize: meta.pageSize,
                  total: meta.total,
                  totalPages: meta.totalPages,
                  onPageChange: setPage,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
