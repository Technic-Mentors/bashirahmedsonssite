import { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/format';

const THUMB = '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 ' +
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-charcoal ' +
  '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full ' +
  '[&::-moz-range-thumb]:bg-charcoal [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow';

/** A two-handle price range slider. `min`/`max` are the absolute bounds; `value` is [lo, hi]. */
export default function PriceRangeSlider({ min, max, value, onChangeEnd }) {
  const [lo, setLo] = useState(value?.[0] ?? min);
  const [hi, setHi] = useState(value?.[1] ?? max);

  useEffect(() => {
    setLo(value?.[0] ?? min);
    setHi(value?.[1] ?? max);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.[0], value?.[1]]);

  function commit(nextLo, nextHi) {
    onChangeEnd?.(nextLo, nextHi);
  }

  const loPct = ((lo - min) / (max - min)) * 100;
  const hiPct = ((hi - min) / (max - min)) * 100;

  return (
    <div className="pt-1">
      <div className="relative h-4">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-stone-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-charcoal"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => {
            const next = Math.min(Number(e.target.value), hi);
            setLo(next);
            commit(next, hi);
          }}
          className={`pointer-events-none absolute inset-0 h-4 w-full cursor-pointer appearance-none bg-transparent ${THUMB}`}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => {
            const next = Math.max(Number(e.target.value), lo);
            setHi(next);
            commit(lo, next);
          }}
          className={`pointer-events-none absolute inset-0 h-4 w-full cursor-pointer appearance-none bg-transparent ${THUMB}`}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-charcoal-light">
        <span>{formatCurrency(lo)}</span>
        <span>{formatCurrency(hi)}</span>
      </div>
    </div>
  );
}
