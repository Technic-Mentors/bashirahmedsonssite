import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAsync } from '../hooks/useAsync';
import { getProducts } from '../api/catalog.api';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/* ═══════════════ Floating Particles ═══════════════ */
function FloatingParticles({ count = 10 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-yellow-400"
          style={{
            width: 3 + (i % 3) * 2,
            height: 3 + (i % 3) * 2,
            left: `${(i * 11.3) % 100}%`,
            top: `${(i * 17.7) % 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 6 + (i % 4),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}

export default function OffersPage() {
  const { data, loading } = useAsync(() => getProducts({ pageSize: 40 }), []);
  const offers = data?.data?.filter(
    (p) => p.compare_at_price && Number(p.compare_at_price) > Number(p.min_price)
  );

  const maxDiscount = offers?.length
    ? Math.max(
        ...offers.map((p) =>
          Math.round(((Number(p.compare_at_price) - Number(p.min_price)) / Number(p.compare_at_price)) * 100)
        )
      )
    : 0;

  return (
    <div className="bg-white">
      {/* ══════════════ HERO — RED BG with Golden accents ══════════════ */}
      <section className="relative overflow-hidden bg-red-800">
        <FloatingParticles count={12} />

        {/* Gold radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(202,138,4,0.2),transparent_65%)]" />

        {/* Subtle white grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

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
            <span className="font-semibold text-yellow-300">Offers</span>
          </motion.nav>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
              className="h-px w-10 origin-right bg-gradient-to-r from-transparent to-yellow-400"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-300">
              Limited Time Deals
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
              className="h-px w-10 origin-left bg-gradient-to-l from-transparent to-yellow-400"
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Special <span className="italic text-yellow-300">Offers</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mx-auto mt-4 max-w-lg text-sm text-red-50 sm:text-base"
          >
            Exclusive savings on premium organic groceries, dry fruits, and gift hampers — handpicked for you and
            your family.
          </motion.p>

          {/* Deal count pill */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/60 bg-white/10 px-4 py-1.5 backdrop-blur-sm"
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-1.5 w-1.5 rounded-full bg-yellow-300"
            />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
              {loading ? 'Loading deals...' : `${offers?.length || 0} Deal${offers?.length === 1 ? '' : 's'} Available`}
            </span>
            {maxDiscount > 0 && !loading && (
              <>
                <span className="text-yellow-300/70">·</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-300">
                  Up to {maxDiscount}% Off
                </span>
              </>
            )}
          </motion.div>

          {/* Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          />
        </div>
      </section>

      {/* ══════════════ OFFERS GRID ══════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : !offers?.length ? (
          <EmptyState
            title="No offers right now"
            description="Check back soon for limited-time deals across our collection."
          />
        ) : (
          <>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mb-6 flex flex-col items-center text-center"
            >
              <span className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-700">
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
                  className="h-px w-5 origin-right bg-yellow-600"
                />
                Save on Your Favorites
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
                  className="h-px w-5 origin-left bg-yellow-600"
                />
              </span>
              <h2 className="font-serif text-xl text-black sm:text-2xl">On-Sale Products</h2>
              <p className="mt-1.5 max-w-md text-sm text-gray-600">
                Handpicked products with special pricing — while stocks last.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
            >
              {offers.map((product) => {
                const discount = product.compare_at_price && product.min_price
                  ? Math.round(
                      ((Number(product.compare_at_price) - Number(product.min_price)) /
                        Number(product.compare_at_price)) *
                        100
                    )
                  : 0;
                return (
                  <motion.div
                    key={product.id}
                    variants={fadeUp}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="relative"
                  >
                    {discount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
                        whileHover={{ scale: 1.15, rotate: -12 }}
                        className="pointer-events-none absolute left-2 top-2 z-10 rounded-full bg-red-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md"
                      >
                        -{discount}%
                      </motion.div>
                    )}
                    <ProductCard product={product} />
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      {offers?.length > 0 && !loading && (
        <section className="relative overflow-hidden bg-white">
          <FloatingParticles count={8} />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6"
          >
            <div className="mb-1 flex items-center justify-center gap-3">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                className="h-px w-10 origin-right bg-gradient-to-r from-transparent to-yellow-600"
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-700">
                Explore the Full Collection
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                className="h-px w-10 origin-left bg-gradient-to-l from-transparent to-yellow-600"
              />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
              className="font-serif text-2xl leading-tight text-black sm:text-3xl lg:text-4xl"
            >
              Looking for <span className="text-red-700">Something Else?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
              className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base"
            >
              Browse our entire collection of premium dry fruits, organic groceries, and gift hampers — with free
              shipping on orders over PKR 1000 and cash on delivery across Pakistan.
            </motion.p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/category/all">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Button variant="gold" size="lg">Shop Now</Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}