import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAsync } from '../hooks/useAsync';
import { getBlogPosts } from '../api/blog.api';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/format';
import { assetUrl } from '../utils/media';

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
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

export default function BlogListPage() {
  const [page, setPage] = useState(1);
  const { data, loading } = useAsync(() => getBlogPosts({ page, pageSize: 9 }), [page]);

  return (
    <div className="bg-white">
      {/* ══════════════ HERO — RED-800 with Golden accents ══════════════ */}
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
            <span className="font-semibold text-yellow-300">Blog</span>
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
              Recipes, Tips &amp; Stories
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
            Our <span className="italic text-yellow-300">Journal</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mx-auto mt-4 max-w-lg text-sm text-red-50 sm:text-base"
          >
            Discover healthy recipes, organic living tips, and gifting inspiration from our family to yours.
          </motion.p>

          {/* Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          />
        </div>
      </section>

      {/* ══════════════ BLOG GRID ══════════════ */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState title="No articles yet" description="Check back soon for guides and tips." />
        ) : (
          <>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"
            >
              {data.data.map((post) => (
                <motion.div key={post.id} variants={fadeUp}>
                  <Link to={`/blog/${post.slug}`} className="group block">
                    {/* Image */}
                    <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-yellow-50 shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
                      {post.featured_image && (
                        <motion.img
                          src={assetUrl(post.featured_image)}
                          alt={post.title}
                          className="h-full w-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.6, ease: EASE }}
                        />
                      )}
                      {/* Red overlay on hover */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-red-800/40 via-red-800/10 to-transparent"
                      />
                    </div>

                    {/* Category */}
                    {post.category_name && (
                      <span className="inline-block rounded-full border border-yellow-600/40 bg-yellow-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-800">
                        {post.category_name}
                      </span>
                    )}

                    {/* Title */}
                    <h2 className="mt-2 font-serif text-lg text-black transition-colors group-hover:text-red-800">
                      {post.title}
                    </h2>

                    {/* Meta */}
                    <p className="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatDate(post.published_at)}</span>
                      <span className="h-1 w-1 rounded-full bg-red-700" />
                      <span className="text-red-800 transition-transform duration-300 group-hover:translate-x-1">
                        Read more →
                      </span>
                    </p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {data.meta.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10 flex items-center justify-center gap-3"
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
                  Page <span className="font-semibold text-red-800">{data.meta.page}</span> of{' '}
                  <span className="font-semibold text-red-800">{data.meta.totalPages}</span>
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

      {/* ══════════════ FINAL CTA ══════════════ */}
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
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-800">
              Ready to Taste the Difference?
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
            Explore Our <span className="text-red-800">Purity Range</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base"
          >
            Browse our premium organic groceries, dry fruits, and gift hampers — with free shipping over PKR 1000
            and cash on delivery across Pakistan.
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
    </div>
  );
}