import { cn } from '../../utils/cn';

const STATUS_STYLES = {
  placed: 'bg-blue-50 text-blue-700',
  confirmed: 'bg-indigo-50 text-indigo-700',
  packed: 'bg-purple-50 text-purple-700',
  shipped: 'bg-amber-50 text-amber-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  returned: 'bg-stone-100 text-stone-700',
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  draft: 'bg-stone-100 text-stone-600',
  published: 'bg-green-50 text-green-700',
  active: 'bg-green-50 text-green-700',
  inactive: 'bg-stone-100 text-stone-600',
};

export default function Badge({ status, children, className }) {
  const style = STATUS_STYLES[status] || 'bg-stone-100 text-stone-700';
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', style, className)}>
      {children ?? status}
    </span>
  );
}
