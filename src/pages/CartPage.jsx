import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCartStore, cartSubtotal } from '../store/useCartStore';
import CartLineItem from '../components/cart/CartLineItem';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency } from '../utils/format';
import { previewCoupon } from '../api/coupons.api';
import { useAuthStore } from '../store/useAuthStore';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const customer = useAuthStore((s) => s.customer);
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const subtotal = cartSubtotal(items);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    if (!customer) return toast.error('Please log in to apply a coupon.');
    setCheckingCoupon(true);
    try {
      const result = await previewCoupon(couponCode);
      setDiscount(result);
      toast.success(`Coupon applied: -${formatCurrency(result.discountAmount)}`);
    } catch (err) {
      setDiscount(null);
      toast.error(err.response?.data?.error || 'Invalid coupon.');
    } finally {
      setCheckingCoupon(false);
    }
  }

  function goToCheckout() {
    navigate('/checkout', { state: { couponCode: discount ? couponCode : undefined } });
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <EmptyState
          icon={<CartIconLarge />}
          title="Your cart is empty"
          description="Browse our collection to find something you'll love."
          action={
            <Link to="/">
              <Button variant="gold">Continue Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <nav className="mb-4 text-xs text-charcoal-light">
        <Link to="/" className="hover:text-gold-600">Home</Link>
        <span className="mx-1.5 text-stone-300">/</span>
        <span className="text-charcoal">Shopping Cart</span>
      </nav>
      <h1 className="mb-8 font-serif text-3xl text-charcoal">
        Shopping Cart <span className="text-lg font-sans font-normal text-charcoal-light">({itemCount} item{itemCount === 1 ? '' : 's'})</span>
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-lg border border-stone-200 bg-white px-5">
          {items.map((item) => (
            <CartLineItem key={item.variantId} item={item} />
          ))}
        </div>

        <div className="h-fit space-y-5 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-lg text-charcoal">Order Summary</h2>

          <div className="flex gap-2">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={applyCoupon} loading={checkingCoupon}>
              Apply
            </Button>
          </div>

          <div className="space-y-2 border-t border-stone-100 pt-4 text-sm">
            <div className="flex justify-between text-charcoal-light">
              <span>Subtotal</span>
              <span className="font-medium text-charcoal">{formatCurrency(subtotal)}</span>
            </div>
            {discount && (
              <div className="flex justify-between text-green-700">
                <span>Discount ({discount.code})</span>
                <span>-{formatCurrency(discount.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal-light">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>

          <div className="flex justify-between border-t border-stone-100 pt-4 text-base font-semibold text-charcoal">
            <span>Estimated Total</span>
            <span>{formatCurrency(subtotal - (discount?.discountAmount || 0))}</span>
          </div>

          <Button onClick={goToCheckout} variant="gold" className="w-full" size="lg">
            Proceed to Checkout
          </Button>

          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-charcoal-light">
            <TruckIcon /> Cash on Delivery available across Pakistan
          </div>
        </div>
      </div>
    </div>
  );
}

function CartIconLarge() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.5 2.5h2l2.6 12.5a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.5l1.5-7H6" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 6h11v11H2zM13 10h4l4 4v3h-8z" />
      <circle cx="6.5" cy="19" r="1.8" />
      <circle cx="16.5" cy="19" r="1.8" />
    </svg>
  );
}
