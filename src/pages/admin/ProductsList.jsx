import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { listProducts, deleteProduct } from '../../api/admin/products.api';
import { listCategories } from '../../api/admin/categories.api';
import { useAsync } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import { formatCurrency } from '../../utils/format';
import DataTable from '../../components/admin/table/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import SearchableSelect from '../../components/ui/SearchableSelect';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorState from '../../components/ui/ErrorState';
import { assetUrl } from '../../utils/media';

export default function ProductsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const { data: categories } = useAsync(() => listCategories(), []);
  const { data, loading, error, refetch } = useAsync(
    () =>
      listProducts({
        search: debouncedSearch || undefined,
        categoryId: categoryId || undefined,
        page,
        pageSize: 10,
      }),
    [debouncedSearch, categoryId, page],
  );

  const rows = data?.data || [];
  const meta = data?.meta;

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      toast.success('Product deleted.');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      const message = err.response?.data?.error || 'Something went wrong';
      toast.error(
        err.response?.status === 409
          ? `${message} This product cannot be deleted because it has existing orders. Try marking it inactive instead.`
          : message,
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal">Products</h1>
        <Button variant="gold" onClick={() => navigate('/admin/products/new')}>
          Add Product
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-stone-200 bg-white p-4">
        <div className="w-64">
          <Input
            label="Search"
            placeholder="Search by name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="w-52">
          <SearchableSelect
            label="Category"
            value={categoryId}
            onChange={(val) => {
              setCategoryId(val);
              setPage(1);
            }}
            options={[
              { value: '', label: 'All categories' },
              ...(categories || []).map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>
      </div>

      {error ? (
        <ErrorState message="Could not load products." onRetry={refetch} />
      ) : (
        <DataTable
          loading={loading}
          rows={rows}
          emptyMessage="No products found."
          columns={[
            {
              key: 'image',
              label: '',
              render: (row) =>
                row.primary_image ? (
                  <img src={assetUrl(row.primary_image)} alt="" className="h-10 w-10 rounded object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded bg-stone-100" />
                ),
            },
            { key: 'name', label: 'Name' },
            { key: 'category_name', label: 'Category' },
            { key: 'base_price', label: 'Price', render: (row) => formatCurrency(row.base_price ?? row.basePrice) },
            { key: 'total_stock', label: 'Stock', render: (row) => row.total_stock ?? row.totalStock ?? '-' },
            {
              key: 'is_active',
              label: 'Status',
              render: (row) => <Badge status={row.is_active ? 'active' : 'inactive'} />,
            },
            {
              key: 'is_featured',
              label: 'Featured',
              render: (row) => (row.is_featured ? <Badge status="active">Featured</Badge> : '-'),
            },
            {
              key: 'actions',
              label: '',
              render: (row) => (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/products/${row.id}/edit`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(row);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          pagination={
            meta
              ? { page: meta.page, pageSize: meta.pageSize, total: meta.total, totalPages: meta.totalPages, onPageChange: setPage }
              : undefined
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete product?"
        description={`This will permanently delete "${deleteTarget?.name}". This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
