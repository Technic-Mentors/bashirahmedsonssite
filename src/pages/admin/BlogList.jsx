import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { listBlogPosts, deleteBlogPost } from '../../api/admin/blog.api';
import { useAsync } from '../../hooks/useAsync';
import { formatDate } from '../../utils/format';
import DataTable from '../../components/admin/table/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorState from '../../components/ui/ErrorState';

export default function BlogList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useAsync(() => listBlogPosts({ page, pageSize: 10 }), [page]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const rows = data?.data || [];
  const meta = data?.meta;

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteBlogPost(deleteTarget.id);
      toast.success('Post deleted.');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-charcoal">Blog</h1>
        <Button variant="gold" onClick={() => navigate('/admin/blog/new')}>
          New Post
        </Button>
      </div>

      {error ? (
        <ErrorState message="Could not load blog posts." onRetry={refetch} />
      ) : (
        <DataTable
          loading={loading}
          rows={rows}
          emptyMessage="No blog posts yet."
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'category_name', label: 'Category', render: (row) => row.category_name || row.categoryName || '-' },
            { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> },
            {
              key: 'published_at',
              label: 'Published',
              render: (row) =>
                row.published_at || row.publishedAt ? formatDate(row.published_at || row.publishedAt) : '-',
            },
            {
              key: 'actions',
              label: '',
              render: (row) => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/admin/blog/${row.id}/edit`)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleteTarget(row)}>
                    Delete
                  </Button>
                </div>
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

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete post?"
        description={`This will permanently delete "${deleteTarget?.title}". This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
