export default function Pagination({ page, totalPages, total, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-stone-200 px-4 py-3">
      <span className="text-xs text-charcoal-light">
        Page {page} of {totalPages} &middot; {total} total
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-charcoal disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-charcoal disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
