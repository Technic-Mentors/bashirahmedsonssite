import { useParams, Link } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { getMyOrder } from '../api/orders.api';
import { useAuthStore } from '../store/useAuthStore';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/format';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const customer = useAuthStore((s) => s.customer);
  const { data: order, loading, error, refetch } = useAsync(() => getMyOrder(id), [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (error || !order) return <ErrorState message="Order not found." onRetry={refetch} />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
      <div className="mb-4 text-5xl">🎉</div>
      <h1 className="mb-2 font-serif text-3xl text-charcoal">Thank you for your order!</h1>
      <p className="mb-2 text-charcoal-light">
        Order <span className="font-medium text-charcoal">{order.order_number}</span> has been placed. We'll call you
        shortly to confirm.
      </p>
      {customer?.email && (
        <p className="mb-8 text-sm text-charcoal-light">
          A confirmation email has been sent to <span className="font-medium text-charcoal">{customer.email}</span>.
        </p>
      )}

      <div className="rounded-md border border-stone-200 p-6 text-left">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-charcoal-light">Status</span>
          <Badge status={order.status} />
        </div>
        <div className="space-y-2 border-t border-stone-100 pt-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.product_name} ({item.size}/{item.color}) × {item.quantity}
              </span>
              <span>{formatCurrency(item.line_total)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-stone-100 pt-4 font-medium text-charcoal">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link to="/account/orders">
          <Button variant="outline">View My Orders</Button>
        </Link>
        <Link to="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
