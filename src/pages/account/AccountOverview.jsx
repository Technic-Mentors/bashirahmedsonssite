import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useAsync } from '../../hooks/useAsync';
import { getMyOrders } from '../../api/orders.api';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency, formatDate } from '../../utils/format';

export default function AccountOverview() {
  const customer = useAuthStore((s) => s.customer);
  const { data: orders, loading } = useAsync(() => getMyOrders(), []);

  const recentOrders = (orders || []).slice(0, 3);
  const totalSpent = (orders || [])
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-charcoal-light">Welcome back,</p>
        <h2 className="font-serif text-2xl text-charcoal">{customer?.name}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Orders" value={loading ? <Spinner size="sm" /> : orders?.length ?? 0} />
        <StatCard label="Total Spent" value={loading ? <Spinner size="sm" /> : formatCurrency(totalSpent)} />
        <Link
          to="/account/wishlist"
          className="flex flex-col items-center justify-center gap-1 rounded-lg border border-stone-200 bg-white p-5 text-center shadow-sm transition-colors hover:border-gold-300"
        >
          <p className="text-sm font-medium text-charcoal">View Wishlist</p>
          <p className="text-xs text-charcoal-light">Saved items</p>
        </Link>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h3 className="font-serif text-lg text-charcoal">Recent Orders</h3>
          <Link to="/account/orders" className="text-sm font-medium text-gold-600 hover:text-gold-700">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-charcoal-light">You haven't placed any orders yet.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 text-sm transition-colors hover:bg-stone-50"
              >
                <div>
                  <p className="font-medium text-charcoal">{order.order_number}</p>
                  <p className="text-xs text-charcoal-light">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-charcoal">{formatCurrency(order.total)}</span>
                  <Badge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 text-center shadow-sm">
      <p className="font-serif text-3xl text-gold-600">{value}</p>
      <p className="mt-1 text-sm text-charcoal-light">{label}</p>
    </div>
  );
}
