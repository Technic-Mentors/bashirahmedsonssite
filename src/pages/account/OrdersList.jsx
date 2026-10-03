import { Link } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { getMyOrders } from '../../api/orders.api';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/format';

export default function OrdersList() {
  const { data: orders, loading } = useAsync(() => getMyOrders(), []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }
  if (!orders?.length) {
    return <EmptyState title="No orders yet" description="Your order history will appear here." />;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          to={`/account/orders/${order.id}`}
          className="flex items-center gap-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm transition-shadow hover:border-gold-300 hover:shadow-md"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
            <BagIcon />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-charcoal">{order.order_number}</p>
            <p className="text-xs text-stone-400">{formatDate(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-charcoal">{formatCurrency(order.total)}</span>
            <Badge status={order.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
      <path d="M20 16.5V7.5a2 2 0 0 0-1-1.7l-6-3.5a2 2 0 0 0-2 0l-6 3.5a2 2 0 0 0-1 1.7v9a2 2 0 0 0 1 1.7l6 3.5a2 2 0 0 0 2 0l6-3.5a2 2 0 0 0 1-1.7Z" />
    </svg>
  );
}
