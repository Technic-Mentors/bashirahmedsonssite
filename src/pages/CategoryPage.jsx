import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAsync } from '../hooks/useAsync';
import { useDebounce } from '../hooks/useDebounce';
import { getProducts, getCategories } from '../api/catalog.api';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import PriceRangeSlider from '../components/ui/PriceRangeSlider';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { cn } from '../utils/cn';

const PRICE_MIN = 0;
const PRICE_MAX = 10000;

const EASE = [0.22, 1, 0.36, 1];

export default function CategoryPage() {
  const { slug } = useParams();
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedRange = useDebounce(priceRange, 300);

  const { data: categories } = useAsync(() => getCategories(), []);
  const { data, loading, error, refetch } = useAsync(
    () =>
      getProducts({
        category: slug,
        sort,
        minPrice: debouncedRange[0] > PRICE_MIN ? debouncedRange[0] : undefined,
        maxPrice: debouncedRange[1] < PRICE_MAX ? debouncedRange[1] : undefined,
        page,
        pageSize: 15,
      }),
    [slug, sort, debouncedRange, page],
  );

  const current = categories?.find((c) => c.slug === slug);
  const subcategories = categories?.filter((c) => c.parent_id === current?.id) || [];
  const siblingsOrTop = categories?.filter((c) => !c.parent_id) || [];
  const categoryOptions = subcategories.length > 0 ? subcategories : siblingsOrTop;
  const parentSlug = siblingsOrTop.length > 0 && subcategories.length > 0 ? current?.slug : null;

  function clearFilters() {
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setSort('newest');
    setPage(1);
  }

  const hasActiveFilters = priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX || sort !== 'newest';

  return (
    <div className="bg-white">
      {/* ══════════════ CATEGORY HERO — RED BG with Gold accents ══════════════ */}
      <section className="relative overflow-hidden bg-red-800">
        {/* Radial gold glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(202,138,4,0.2),transparent_65%)]" />

        {/* Subtle gold grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Floating gold dots */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-yellow-400"
            style={{
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              left: `${(i * 12.5) % 100}%`,
              top: `${(i * 17) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 5 + (i % 4),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}

        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:py-20">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-red-100"
          >
            <Link to="/" className="transition-colors hover:text-yellow-300">
              Home
            </Link>
            <span className="text-yellow-400">/</span>
            <span className="font-semibold text-yellow-300">
              {current?.name || (slug === 'all' ? 'All Products' : slug)}
            </span>
          </motion.nav>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              className="h-px w-10 origin-right bg-gradient-to-r from-transparent to-yellow-400"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-300">
              Explore Our Collection
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              className="h-px w-10 origin-left bg-gradient-to-l from-transparent to-yellow-400"
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="font-serif text-4xl capitalize leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            {current?.name || (slug === 'all' ? 'All Products' : slug)}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            className="mx-auto mt-4 max-w-xl text-sm text-red-50 sm:text-base"
          >
            Premium organic groceries, dry fruits, and gift hampers — sourced from trusted farms and delivered
            with care, since 1940.
          </motion.p>

          {/* Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          />
        </div>
      </section>

      {/* ══════════════ FILTERS + PRODUCTS ══════════════ */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md border border-red-700/30 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 lg:hidden"
          >
            <FilterIcon /> Filters
          </motion.button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* ── Sidebar ── */}
          <aside
            className={cn(
              'flex-col rounded-lg border-2 border-yellow-600/25 bg-white p-4 lg:sticky lg:top-16 lg:h-fit',
              filtersOpen ? 'flex' : 'hidden lg:flex',
            )}
          >
            <h2 className="mb-4 flex items-center gap-2 font-serif text-lg text-black">
              <span className="h-px w-3 bg-red-700" />
              Product Filters
            </h2>

            {/* Sort */}
            <div className="border-b border-yellow-600/20 pb-4">
              <Select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full"
              >
                <option value="newest">Default (Newest)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A-Z</option>
              </Select>
            </div>

            {/* ── Category Filter ── */}
            {categoryOptions.length > 0 && (
              <div className="border-b border-yellow-600/20 py-4">
                <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-700">
                  <span className="h-px w-2 bg-red-700" />
                  Category
                </h3>
                <div className="space-y-2">
                  {slug === 'all' && (
                    <FilterRadio
                      as={Link}
                      to="/category/all"
                      label="All Products"
                      checked
                    />
                  )}
                  {parentSlug && (
                    <FilterRadio
                      as={Link}
                      to={`/category/${parentSlug}`}
                      label="All"
                      checked={slug === parentSlug}
                    />
                  )}
                  {categoryOptions.map((cat) => (
                    <FilterRadio
                      key={cat.id}
                      as={Link}
                      to={`/category/${cat.slug}`}
                      label={cat.name}
                      checked={cat.slug === slug}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="py-4">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-700">
                <span className="h-px w-2 bg-red-700" />
                Price Range
              </h3>
              <PriceRangeSlider
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={priceRange}
                onChangeEnd={(lo, hi) => {
                  setPriceRange([lo, hi]);
                  setPage(1);
                }}
              />
            </div>

            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={clearFilters}
                className="mt-1 self-start rounded-full border border-red-700/30 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
              >
                Clear all filters
              </motion.button>
            )}
          </aside>

          {/* ── Products Grid ── */}
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-yellow-600/20 pb-3">
              <motion.p
                key={data?.meta?.total}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-600"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block h-3 w-3 rounded-full border-2 border-red-700 border-t-transparent"
                    />
                    Loading products...
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-red-700">{data?.meta?.total ?? 0}</span>{' '}
                    product{data?.meta?.total === 1 ? '' : 's'} found
                  </>
                )}
              </motion.p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState message="Could not load products." onRetry={refetch} />
            ) : !data?.data?.length ? (
              <EmptyState title="No products found" description="Try adjusting your filters." />
            ) : (
              <>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.05 } },
                  }}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                >
                  <AnimatePresence mode="popLayout">
                    {data.data.map((product, i) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }}
                        whileHover={{ y: -6 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {data.meta.totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8 flex items-center justify-center gap-3"
                  >
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        Previous
                      </Button>
                    </motion.div>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      Page <span className="font-semibold text-red-700">{data.meta.page}</span> of{' '}
                      <span className="font-semibold text-red-700">{data.meta.totalPages}</span>
                    </span>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= data.meta.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ Filter Radio ═══════════════ */
function FilterRadio({ as: Comp = 'div', label, checked, ...props }) {
  return (
    <Comp className="flex cursor-pointer items-center gap-2 text-sm" {...props}>
      <motion.span
        whileHover={{ scale: 1.15 }}
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          checked ? 'border-red-700' : 'border-gray-300',
        )}
      >
        {checked && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="h-2 w-2 rounded-full bg-red-700"
          />
        )}
      </motion.span>
      <span
        className={cn(
          'transition-colors',
          checked ? 'font-semibold text-red-700' : 'text-gray-600 hover:text-red-700',
        )}
      >
        {label}
      </span>
    </Comp>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}