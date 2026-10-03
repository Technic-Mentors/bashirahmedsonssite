import { cn } from '../../utils/cn';

const SIZES = { sm: 14, md: 18, lg: 24 };

export default function Stars({ value = 0, size = 'md', interactive = false, onChange }) {
  const px = SIZES[size];
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={cn(!interactive && 'cursor-default')}
        >
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill={n <= Math.round(value) ? '#a67c34' : 'none'}
            stroke="#a67c34"
            strokeWidth="1.5"
          >
            <path d="M12 2.5l2.9 6.1 6.6.6-5 4.5 1.5 6.6L12 16.9l-5.9 3.4L7.6 13.7l-5-4.5 6.6-.6z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
