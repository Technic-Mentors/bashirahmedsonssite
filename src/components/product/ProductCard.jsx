import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/format';
import { useAuthStore } from '../../store/useAuthStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { assetUrl } from '../../utils/media';
import Stars from '../ui/Stars';

const LOW_STOCK_THRESHOLD = 5;

export default function ProductCard({ product, onToggleWishlist, isWishlisted: isWishlistedOverride }) {
  const navigate = useNavigate();
  const customer = useAuthStore((s) => s.customer);
  const { has, toggle, load, loaded } = useWishlistStore();

  useEffect(() => {
    if (customer && !loaded && !onToggleWishlist) load();
  }, [customer, loaded, onToggleWishlist, load]);

  const price = Number(product.min_price ?? product.base_price);
  const compareAt = product.compare_at_price ? Number(product.compare_at_price) : null;
  const totalStock = Number(product.total_stock);
  const outOfStock = totalStock === 0;
  const lowStock = !outOfStock && totalStock > 0 && totalStock <= LOW_STOCK_THRESHOLD;
  const isWishlisted = onToggleWishlist ? isWishlistedOverride : has(product.id);
  const ratingCount = Number(product.rating_count) || 0;
  const ratingAvg = Number(product.rating_avg) || 0;

  async function handleWishlistClick(e) {
    e.preventDefault();
    if (onToggleWishlist) return onToggleWishlist(product);
    if (!customer) {
      toast.error('Please log in to use your wishlist.');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    try {
      await toggle(product);
    } catch {
      toast.error('Something went wrong.');
    }
  }

  function handleCartClick(e) {
    e.preventDefault();
    navigate(`/product/${product.slug}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-stone-100 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
          {product.primary_image ? (
            <img
              src={assetUrl(product.primary_image)}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone-300">No image</div>
          )}
          {outOfStock && (
            <span className="absolute left-2 top-2 rounded-full bg-charcoal/80 px-2.5 py-1 text-[11px] font-medium text-white">
              Out of stock
            </span>
          )}
          {compareAt && compareAt > price && !outOfStock && (
            <span className="absolute left-2 top-2 rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-medium text-white">
              Sale
            </span>
          )}
          {lowStock && (
            <span className="absolute left-2 bottom-2 rounded-full bg-red-600/90 px-2.5 py-1 text-[11px] font-medium text-white">
              Only {totalStock} left
            </span>
          )}

          <div className="absolute right-1.5 top-1.5 flex flex-col gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <button
              onClick={handleWishlistClick}
              aria-label="Toggle wishlist"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-sm transition-colors hover:text-gold-600"
            >
              <HeartIcon filled={isWishlisted} />
            </button>
            {!outOfStock && (
              <button
                onClick={handleCartClick}
                aria-label="View and add to cart"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-sm transition-colors hover:text-gold-600"
              >
                <CartIcon />
              </button>
            )}
          </div>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <h3 className="truncate font-serif text-sm text-charcoal">{product.name}</h3>
          {compareAt && compareAt > price && (
            <span className="shrink-0 text-[11px] text-stone-400 line-through">{formatCurrency(compareAt)}</span>
          )}
        </div>
        {ratingCount > 0 && (
          <div className="mt-0.5 flex items-center gap-1.5">
            <Stars value={ratingAvg} size="sm" />
            <span className="text-[11px] text-stone-400">({ratingCount})</span>
          </div>
        )}
        <span className="text-sm font-semibold text-gold-700">{formatCurrency(price)}</span>
      </Link>
    </motion.div>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.65 12 21 12 21z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.5 2.5h2l2.6 12.5a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.5l1.5-7H6" />
    </svg>
  );
}
