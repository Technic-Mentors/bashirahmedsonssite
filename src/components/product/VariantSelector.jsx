import { useMemo, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

export default function VariantSelector({ variants = [], onChange }) {
  const sizes = useMemo(() => [...new Set(variants.map((v) => v.size))], [variants]);
  const colors = useMemo(() => [...new Set(variants.map((v) => v.color))], [variants]);

  const [size, setSize] = useState(sizes[0] ?? null);
  const [color, setColor] = useState(colors[0] ?? null);

  const selected = useMemo(
    () => variants.find((v) => v.size === size && v.color === color) ?? null,
    [variants, size, color],
  );

  useEffect(() => {
    onChange?.(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function stockFor(candidateSize, candidateColor) {
    return variants.find((v) => v.size === candidateSize && v.color === candidateColor)?.stock_quantity ?? 0;
  }

  function handleSelectSize(nextSize) {
    setSize(nextSize);
    // Variant combinations aren't always a full grid (e.g. L only comes in Beige) —
    // if the current color has no stock for this size, jump to a color that does.
    if (stockFor(nextSize, color) === 0) {
      const fallback = colors.find((c) => stockFor(nextSize, c) > 0);
      if (fallback) setColor(fallback);
    }
  }

  function handleSelectColor(nextColor) {
    setColor(nextColor);
    if (stockFor(size, nextColor) === 0) {
      const fallback = sizes.find((s) => stockFor(s, nextColor) > 0);
      if (fallback) setSize(fallback);
    }
  }

  return (
    <div className="space-y-4">
      {sizes.length > 1 && (
        <div>
          <p className="mb-2 text-sm font-medium text-charcoal-light">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const disabled = variants.every((v) => v.size !== s || v.stock_quantity === 0);
              return (
                <button
                  key={s}
                  disabled={disabled}
                  onClick={() => handleSelectSize(s)}
                  className={cn(
                    'rounded-md border px-4 py-2 text-sm transition-colors',
                    s === size ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-stone-300 text-charcoal',
                    disabled && 'cursor-not-allowed opacity-40 line-through',
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {colors.length > 1 && (
        <div>
          <p className="mb-2 text-sm font-medium text-charcoal-light">Color</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const disabled = variants.every((v) => v.color !== c || v.stock_quantity === 0);
              return (
                <button
                  key={c}
                  disabled={disabled}
                  onClick={() => handleSelectColor(c)}
                  className={cn(
                    'rounded-md border px-4 py-2 text-sm transition-colors',
                    c === color ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-stone-300 text-charcoal',
                    disabled && 'cursor-not-allowed opacity-40 line-through',
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selected && selected.stock_quantity > 0 && selected.stock_quantity <= 5 && (
        <p className="text-xs font-medium text-amber-600">Only {selected.stock_quantity} left in stock</p>
      )}
      {!selected && (sizes.length > 1 || colors.length > 1) && (
        <p className="text-xs text-charcoal-light">Select a size and color to see availability.</p>
      )}
    </div>
  );
}
