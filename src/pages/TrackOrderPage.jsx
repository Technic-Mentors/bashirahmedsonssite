import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { trackOrder } from '../api/orders.api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import Badge from '../components/ui/Badge';
import { formatCurrency, formatDateTime } from '../utils/format';

const schema = z.object({
  orderNumber: z.string().trim().min(1, 'Order number is required'),
  phone: z.string().trim().min(8, 'Enter a valid phone number'),
});

export default function TrackOrderPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setLoading(true);
    setError(null);
    try {
      const result = await trackOrder({
        orderNumber: values.orderNumber,
        phone: values.phone,
      });
      setOrder(result.data || result);
    } catch (err) {
      const message = err.response?.data?.error || 'Order not found.';
      setError(message);
      setOrder(null);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl text-charcoal">Track Your Order</h1>
        <p className="mt-2 text-sm text-charcoal-light">Enter your order number and phone number to check its status.</p>
      </div>

      <div className="mx-auto max-w-md rounded-md border border-stone-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Order Number"
            placeholder="LEH-000001"
            {...register('orderNumber')}
            error={errors.orderNumber?.message}
          />
          <Input
            label="Phone Number"
            placeholder="03XXXXXXXXX"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <Button type="submit" className="w-full" loading={loading}>
            Track Order
          </Button>
        </form>
      </div>

      {loading && (
        <div className="mt-8 flex justify-center">
          <Spinner />
        </div>
      )}

      {error && !loading && <div className="mt-8"><ErrorState message={error} /></div>}

      {order && (
        <div className="mt-8 rounded-md border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl text-charcoal">{order.order_number}</h2>
              <p className="text-sm text-charcoal-light">Placed on {formatDateTime(order.created_at)}</p>
            </div>
            <Badge status={order.status} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-md bg-stone-50 p-4 text-sm text-charcoal-light">
              <p className="mb-2 font-medium text-charcoal">Shipping Address</p>
              <p>{order.shipping_full_name}</p>
              <p>{order.shipping_phone}</p>
              <p>{order.shipping_address_line1}</p>
              {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
              <p>{order.shipping_city}</p>
            </div>

            <div className="rounded-md bg-stone-50 p-4 text-sm text-charcoal-light">
              <p className="mb-2 font-medium text-charcoal">Payment</p>
              <p>Method: {order.payment_method === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery'}</p>
              <p>Status: {order.payment_status === 'collected' ? 'Paid' : 'Pending'}</p>
              <p>Total: {formatCurrency(order.total)}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-medium text-charcoal">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between border-b border-stone-100 py-2 text-sm">
                  <span>
                    {item.product_name} ({item.size}/{item.color}) × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.line_total)}</span>
                </div>
              ))}
            </div>
          </div>

          {order.history?.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 font-medium text-charcoal">Status History</h3>
              <div className="space-y-3">
                {order.history.map((event) => (
                  <div key={event.id} className="rounded-md border border-stone-200 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium capitalize text-charcoal">{event.status}</span>
                      <span className="text-stone-400">{formatDateTime(event.created_at)}</span>
                    </div>
                    {event.note && <p className="mt-1 text-charcoal-light">{event.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
