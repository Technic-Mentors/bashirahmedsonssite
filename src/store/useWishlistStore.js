import { create } from 'zustand';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlist.api';

export const useWishlistStore = create((set, get) => ({
  productIds: new Set(),
  loaded: false,

  async load() {
    try {
      const list = await getWishlist();
      set({ productIds: new Set(list.map((p) => p.id)), loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  has(productId) {
    return get().productIds.has(productId);
  },

  async toggle(product) {
    const isWishlisted = get().productIds.has(product.id);
    if (isWishlisted) {
      await removeFromWishlist(product.id);
      set((s) => {
        const next = new Set(s.productIds);
        next.delete(product.id);
        return { productIds: next };
      });
    } else {
      await addToWishlist(product.id);
      set((s) => {
        const next = new Set(s.productIds);
        next.add(product.id);
        return { productIds: next };
      });
    }
  },

  reset() {
    set({ productIds: new Set(), loaded: false });
  },
}));
