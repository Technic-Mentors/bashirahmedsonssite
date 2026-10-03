import { cn } from '../../utils/cn';

const SIZES = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-10 w-10 border-[3px]' };

export default function Spinner({ size = 'md', light = false, className }) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-solid',
        light ? 'border-white/30 border-t-white' : 'border-gold-200 border-t-gold-500',
        SIZES[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
