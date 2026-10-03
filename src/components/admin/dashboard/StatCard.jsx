import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

export default function StatCard({ label, value, changePercent, icon, highlight = false, to, delay = 0, className }) {
  const hasChange = changePercent !== undefined && changePercent !== null;
  const positive = hasChange && changePercent >= 0;

  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-charcoal-light">{label}</span>
        {icon && <span className="text-gold-500">{icon}</span>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold text-charcoal">{value}</span>
        {hasChange && (
          <span
            className={cn(
              'mb-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
              positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
            )}
          >
            {positive ? '+' : ''}
            {Number(changePercent).toFixed(1)}%
          </span>
        )}
      </div>
      {to && <span className="text-xs font-medium text-gold-600">View details &rarr;</span>}
    </>
  );

  const cardClass = cn(
    'flex h-full flex-col gap-2 rounded-lg border p-5 shadow-sm transition-shadow',
    highlight ? 'border-gold-300 bg-gold-50' : 'border-stone-200 bg-white',
    to && 'cursor-pointer hover:shadow-md',
    className,
  );

  const motionProps = to
    ? { whileHover: { y: -3, scale: 1.015 }, whileTap: { scale: 0.98 } }
    : {};

  if (to) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="h-full"
        {...motionProps}
      >
        <Link to={to} className={cn('block h-full', cardClass)}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn('h-full', cardClass)}
    >
      {content}
    </motion.div>
  );
}
