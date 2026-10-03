import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { useDebounce } from '../hooks/useDebounce';
import { getProducts } from '../api/catalog.api';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const debouncedQuery = useDebounce(query, 300);
  const [page, setPage] = useState(1);

  const { data, loading } = useAsync(
    () =>
      debouncedQuery
        ? getProducts({ search: debouncedQuery, page, pageSize: 15 })
        : Promise.resolve({ data: [], meta: null }),
    [debouncedQuery, page],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <h1 className="mb-2 font-serif text-2xl text-charcoal">
        {query ? `Search results for "${query}"` : 'Search'}
      </h1>
      {!loading && data?.meta && (
        <p className="mb-5 text-sm text-charcoal-light">
          {data.meta.total} product{data.meta.total === 1 ? '' : 's'} found
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : !data?.data?.length ? (
        <EmptyState title="No results found" description="Try a different search term." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {data.meta.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-3">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="flex items-center text-sm text-charcoal-light">
                Page {data.meta.page} of {data.meta.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
