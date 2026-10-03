import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Textarea = forwardRef(function Textarea({ label, error, className, id, ...props }, ref) {
  const textareaId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-charcoal-light">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          'rounded-md border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-stone-400',
          'focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-100',
          error && 'border-red-400',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Textarea;
