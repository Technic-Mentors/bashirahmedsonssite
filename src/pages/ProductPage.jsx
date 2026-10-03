import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAsync } from '../hooks/useAsync';
import { getProductBySlug, getProducts } from '../api/catalog.api';
import { getProductReviews } from '../api/reviews.api';
import { addToWishlist, removeFromWishlist, getWishlist } from '../api/wishlist.api';
import { notifyMe } from '../api/notifyMe.api';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import ProductGallery from '../components/product/ProductGallery';
import VariantSelector from '../components/product/VariantSelector';
import ReviewList from '../components/product/ReviewList';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import { formatCurrency } from '../utils/format';

export default function ProductPage() {
  const { slug } = useParams();
  const customer = useAuthStore((s) => s.customer);
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, loading, error, refetch } = useAsync(() => getProductBySlug(slug), [slug]);
  const { data: reviewData } = useAsync(
    () => (product ? getProductReviews(product.id) : Promise.resolve(null)),
    [product?.id],
  );
  const { data: related } = useAsync(
    () => (product ? getProducts({ category: product.category_slug, pageSize: 4 }) : Promise.resolve(null)),
    [product?.category_slug],
  );

  useEffect(() => {
    if (customer && product) {
      getWishlist().then((list) => setIsWishlisted(list.some((p) => p.id === product.id)));
    }
  }, [customer, product]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (error || !product) {
    return <ErrorState message="Product not found." onRetry={refetch} />;
  }

  const price = selectedVariant?.price_override ?? product.base_price;
  const allOutOfStock = product.variants.every((v) => v.stock_quantity === 0);

  async function handleAddToCart() {
    if (!selectedVariant) return;
    await addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        size: selectedVariant.size,
        color: selectedVariant.color,
        unitPrice: Number(selectedVariant.price_override ?? product.base_price),
        primaryImage: product.images?.[0]?.image_path,
        stockQuantity: selectedVariant.stock_quantity,
      },
      quantity,
    );
    toast.success('Added to cart');
  }

  async function handleWishlistToggle() {
    if (!customer) return toast.error('Please log in to use your wishlist.');
    if (isWishlisted) {
      await removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      await addToWishlist(product.id);
      setIsWishlisted(true);
    }
  }

  async function handleNotifyMe(e) {
    e.preventDefault();
    if (!selectedVariant) return;
    try {
      await notifyMe({ variantId: selectedVariant.id, email: notifyEmail });
      toast.success("We'll email you when it's back in stock.");
      setNotifyEmail('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong.');
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <nav className="mb-6 text-xs text-charcoal-light">
        <Link to="/" className="hover:text-gold-600">Home</Link>
        <span className="mx-1.5 text-stone-300">/</span>
        <Link to={`/category/${product.category_slug}`} className="hover:text-gold-600">{product.category_name}</Link>
        <span className="mx-1.5 text-stone-300">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <ProductGallery images={product.images} />

        <div>
          <p className="text-xs uppercase tracking-wider text-stone-400">{product.category_name}</p>
          <h1 className="mt-1 font-serif text-3xl text-charcoal">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xl font-medium text-charcoal">{formatCurrency(price)}</span>
            {product.compare_at_price && (
              <span className="text-sm text-stone-400 line-through">{formatCurrency(product.compare_at_price)}</span>
            )}
            {!allOutOfStock && selectedVariant && selectedVariant.stock_quantity <= 5 && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Only {selectedVariant.stock_quantity} left
              </span>
            )}
          </div>

          <div className="mt-6">
            <VariantSelector variants={product.variants} onChange={setSelectedVariant} />
          </div>

          {allOutOfStock ? (
            <form onSubmit={handleNotifyMe} className="mt-6 space-y-3 rounded-md bg-stone-50 p-4">
              <p className="text-sm font-medium text-charcoal">This item is out of stock</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  required
                  placeholder="Your email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Notify Me</Button>
              </div>
            </form>
          ) : (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-md border border-stone-300">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-charcoal-light">
                  −
                </button>
                <span className="min-w-[1.5rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedVariant?.stock_quantity ?? 1, q + 1))}
                  className="px-3 py-2 text-charcoal-light"
                >
                  +
                </button>
              </div>
              <Button onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock_quantity === 0} className="flex-1">
                Add to Cart
              </Button>
              <Button variant="outline" onClick={handleWishlistToggle}>
                {isWishlisted ? '♥ Saved' : '♡ Wishlist'}
              </Button>
            </div>
          )}

          <div className="mt-8 space-y-4 border-t border-stone-200 pt-6 text-sm text-charcoal-light">
            {product.description && (
              <div>
                <h3 className="mb-1 font-medium text-charcoal">Description</h3>
                <p>{product.description}</p>
              </div>
            )}
            {product.fabric && (
              <div>
                <h3 className="mb-1 font-medium text-charcoal">Fabric</h3>
                <p>{product.fabric}</p>
              </div>
            )}
            {product.care_instructions && (
              <div>
                <h3 className="mb-1 font-medium text-charcoal">Care Instructions</h3>
                <p>{product.care_instructions}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {reviewData?.reviews?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mt-16 border-t border-stone-200 pt-10"
        >
          <h2 className="mb-6 font-serif text-2xl text-charcoal">Customer Reviews</h2>
          <ReviewList reviews={reviewData.reviews} summary={reviewData.summary} />
        </motion.div>
      )}

      {related?.data?.filter((p) => p.id !== product.id).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mt-16 border-t border-stone-200 pt-10"
        >
          <h2 className="mb-6 font-serif text-2xl text-charcoal">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.data
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
