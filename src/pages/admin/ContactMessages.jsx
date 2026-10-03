import { useState } from 'react';
import { listContactMessages, markContactMessageRead } from '../../api/admin/contactMessages.api';
import { useAsync } from '../../hooks/useAsync';
import { formatDateTime } from '../../utils/format';
import DataTable from '../../components/admin/table/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ErrorState from '../../components/ui/ErrorState';

export default function ContactMessages() {
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);

  const { data, loading, error, refetch } = useAsync(
    () => listContactMessages({ page, pageSize: 10 }),
    [page],
  );

  const rows = data?.data || [];
  const meta = data?.meta;

  async function handleView(row) {
    setViewing(row);
    if (!row.is_read) {
      try {
        await markContactMessageRead(row.id);
        refetch();
      } catch {
        // non-critical — the message is still viewable
      }
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-charcoal">Contact Messages</h1>

      {error ? (
        <ErrorState message="Could not load contact messages." onRetry={refetch} />
      ) : (
        <DataTable
          loading={loading}
          rows={rows}
          onRowClick={handleView}
          emptyMessage="No messages submitted yet."
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            {
              key: 'message',
              label: 'Message',
              render: (row) => (
                <span className="block max-w-sm truncate" title={row.message}>
                  {row.message}
                </span>
              ),
            },
            { key: 'created_at', label: 'Received', render: (row) => formatDateTime(row.created_at) },
            {
              key: 'is_read',
              label: 'Status',
              render: (row) => <Badge status={row.is_read ? 'active' : 'pending'}>{row.is_read ? 'Read' : 'New'}</Badge>,
            },
            {
              key: 'actions',
              label: '',
              render: (row) => (
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleView(row); }}>
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

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Contact Message">
        {viewing && (
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-400">From</p>
              <p className="text-charcoal">{viewing.name} &lt;{viewing.email}&gt;</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-400">Received</p>
              <p className="text-charcoal">{formatDateTime(viewing.created_at)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-400">Message</p>
              <p className="whitespace-pre-wrap text-charcoal">{viewing.message}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
