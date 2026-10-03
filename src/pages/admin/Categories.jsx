import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryBanner,
} from '../../api/admin/categories.api';
import { useAsync } from '../../hooks/useAsync';
import { useDisclosure } from '../../hooks/useDisclosure';
import DataTable from '../../components/admin/table/DataTable';
import ImageUploader from '../../components/admin/form/ImageUploader';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorState from '../../components/ui/ErrorState';

const emptyForm = {
  name: '',
  description: '',
  sortOrder: '',
  isActive: true,
};

const PAGE_SIZE = 10;

export default function Categories() {
  const { data: categories, loading, error, refetch } = useAsync(() => listCategories(), []);
  const { isOpen, open, close } = useDisclosure(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);

  const allRows = categories || [];
  // listCategories() is shared with dropdowns elsewhere, so it always returns the full
  // list unpaginated — this page paginates it client-side purely for display.
  const totalPages = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE));
  const rows = allRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function findName(id) {
    const match = allRows.find((c) => String(c.id) === String(id));
    return match?.name || '-';
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    open();
  }

  function openEdit(row) {
    setEditing(row);
    setForm({
      name: row.name || '',
      description: row.description || '',
      sortOrder: String(row.sort_order ?? row.sortOrder ?? ''),
      isActive: Boolean(row.is_active ?? row.isActive ?? true),
    });
    open();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        sortOrder: form.sortOrder === '' ? undefined : Number(form.sortOrder),
      };
      if (editing) {
        await updateCategory(editing.id, { ...payload, isActive: Boolean(form.isActive) });
        toast.success('Category updated.');
      } else {
        await createCategory(payload);
        toast.success('Category created.');
      }
      close();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      toast.success('Category deleted.');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      const message = err.response?.data?.error || 'Something went wrong';
      toast.error(
        err.response?.status === 409
          ? `${message} This category still has products or subcategories.`
          : message,
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleBannerUpload(id, file) {
    try {
      await uploadCategoryBanner(id, file);
      toast.success('Banner uploaded.');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal">Categories</h1>
        <Button variant="gold" onClick={openCreate}>
          Add Category
        </Button>
      </div>

      {error ? (
        <ErrorState message="Could not load categories." onRetry={refetch} />
      ) : (
        <DataTable
          loading={loading}
          rows={rows}
          emptyMessage="No categories yet."
          columns={[
            { key: 'name', label: 'Name' },
            {
              key: 'parent',
              label: 'Parent',
              render: (row) => (row.parent_id ?? row.parentId ? findName(row.parent_id ?? row.parentId) : '-'),
            },
            {
              key: 'is_active',
              label: 'Status',
              render: (row) => <Badge status={(row.is_active ?? row.isActive) ? 'active' : 'inactive'} />,
            },
            {
              key: 'banner',
              label: 'Banner',
              render: (row) => (
                <ImageUploader
                  label="Change banner"
                  existingUrl={row.banner_image}
                  onChange={(file) => handleBannerUpload(row.id, file)}
                  className="w-40"
                />
              ),
            },
            {
              key: 'actions',
              label: '',
              render: (row) => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(row)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleteTarget(row)}>
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          pagination={{ page, pageSize: PAGE_SIZE, total: allRows.length, totalPages, onPageChange: setPage }}
        />
      )}

      <Modal open={isOpen} onClose={close} title={editing ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            minLength={2}
            maxLength={150}
            required
          />
          <Textarea
            label="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <Input
            label="Sort Order"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
          />
          {editing && (
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="h-4 w-4 rounded border-stone-300"
              />
              Active
            </label>
          )}
          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={close} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={submitting}>
              {editing ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete category?"
        description={`This will permanently delete "${deleteTarget?.name}". This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
