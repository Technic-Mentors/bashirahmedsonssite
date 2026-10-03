import toast from 'react-hot-toast';
import { useAsync } from '../../hooks/useAsync';
import { getWishlist, removeFromWishlist } from '../../api/wishlist.api';
import ProductCard from '../../components/product/ProductCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import EmptyState from '../../components/ui/EmptyState';

export default function Wishlist() {
  const { data: wishlist, loading, refetch } = useAsync(() => getWishlist(), []);

  async function handleToggle(product) {
    await removeFromWishlist(product.id);
    toast.success('Removed from wishlist.');
    refetch();
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (!wishlist?.length) {
    return <EmptyState title="Your wishlist is empty" description="Save items you love for later." />;
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
      {wishlist.map((product) => (
        <ProductCard key={product.id} product={product} isWishlisted onToggleWishlist={handleToggle} />
      ))}
    </div>
  );
}
