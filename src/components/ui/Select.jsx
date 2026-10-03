import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Select = forwardRef(function Select({ label, error, className, id, children, ...props }, ref) {
  const selectId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-charcoal-light">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'rounded-md border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-charcoal',
          'focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-100',
          error && 'border-red-400',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Select;
