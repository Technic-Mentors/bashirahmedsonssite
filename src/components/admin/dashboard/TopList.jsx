export default function TopList({ title, items = [], renderLabel, renderValue, emptyMessage = 'No data yet.' }) {
  return (
    <div className="flex flex-col rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-charcoal">{title}</h3>
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-charcoal-light">{emptyMessage}</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-50 text-xs font-semibold text-gold-700">
                {idx + 1}
              </span>
              <span className="flex-1 truncate text-sm text-charcoal">{renderLabel(item)}</span>
              <span className="shrink-0 text-sm font-semibold text-charcoal">{renderValue(item)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
