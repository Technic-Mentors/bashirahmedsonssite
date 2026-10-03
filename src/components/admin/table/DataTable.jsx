import Spinner from '../../ui/Spinner';
import EmptyState from '../../ui/EmptyState';
import Pagination from '../../ui/Pagination';
import { cn } from '../../../utils/cn';

export default function DataTable({
  columns,
  rows,
  loading = false,
  emptyMessage = 'Nothing to show yet.',
  pagination,
  onRowClick,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-stone-200 bg-white py-20">
        <Spinner />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white">
        <EmptyState title="No records found" description={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium text-charcoal-light">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id ?? idx}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-b border-stone-100 last:border-0',
                  onRowClick && 'cursor-pointer hover:bg-gold-50/40',
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-4 py-3 text-charcoal">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
