import { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion';
import toast from 'react-hot-toast';
import { useAsync } from '../hooks/useAsync';
import { getFeaturedProducts, getCategories, getProducts } from '../api/catalog.api';
import { getBanners } from '../api/banners.api';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import Stars from '../components/ui/Stars';
import { TruckIcon, ReturnIcon, BadgeIcon } from '../components/icons/TrustIcons';
import { assetUrl } from '../utils/media';
import { formatCurrency } from '../utils/format';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';

/* ───────────────────────── DATA ───────────────────────── */
const HERO_SLIDES = [
  { src: '/bashirson-banner1.jfif', alt: 'Bashir Ahmed & Sons – Premium Dry Fruits' },
  { src: '/groceries-banner2.jfif', alt: 'Bashir Ahmed & Sons – Organic Groceries' },
];
const SLIDE_INTERVAL_MS = 6000;
const EASE = [0.22, 1, 0.36, 1];
const LOW_STOCK_THRESHOLD = 5;

const TRUST_POINTS = [
  { icon: BadgeIcon, title: '100% Organic', desc: 'Sourced from trusted farms.' },
  { icon: TruckIcon, title: 'Free Shipping', desc: 'On orders over PKR 1000/-.' },
  { icon: ReturnIcon, title: 'Secure Payment', desc: 'COD & online payment.' },
];

const TESTIMONIALS = [
  { name: 'Ayesha M.', location: 'Lahore', quote: 'The dry fruits are incredibly fresh and the packaging is beautiful. My family loves the gift boxes!', rating: 5 },
  { name: 'Usman T.', location: 'Karachi', quote: 'Bashir Ahmed & Sons has been our family grocer for years. Their quality is unmatched.', rating: 5 },
  { name: 'Fatima R.', location: 'Islamabad', quote: 'Ordered a gift hamper for Eid. It was delivered on time and the presentation was excellent.', rating: 5 },
];

const STEPS = [
  { t: 'Pick your favourites', d: 'Browse 100+ organic products, dry fruits and hampers.', e: '🛒' },
  { t: 'We pack with care', d: 'Hand-checked, sealed fresh and gift-wrapped on request.', e: '📦' },
  { t: 'Delivered to your door', d: 'Nationwide delivery. Pay online or on delivery.', e: '🚚' },
];

const MARQUEE = ['Free shipping over PKR 1000', 'Secure payment', '100% organic', 'Easy returns', 'Since 1940', 'Farm fresh'];

/* ───────────────────────── GLOBAL STYLE ───────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500&family=DM+Sans:wght@400;500;600;700&display=swap');
    .bk-root{font-family:'DM Sans',system-ui,sans-serif}
    .bk-root .font-serif,.bk-display{font-family:'Fraunces',Georgia,serif !important;font-optical-sizing:auto}
    @keyframes bk-marquee{to{transform:translateX(-50%)}}
    @keyframes bk-shine{0%{transform:translateX(-120%) skewX(-20deg)}60%,100%{transform:translateX(320%) skewX(-20deg)}}
    @keyframes bk-float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-14px) rotate(3deg)}}
    @keyframes bk-blob{0%,100%{border-radius:42% 58% 63% 37%/45% 41% 59% 55%}50%{border-radius:61% 39% 38% 62%/57% 62% 38% 43%}}
    @keyframes bk-gradient{0%{background-position:0% 50%}100%{background-position:200% 50%}}
    .bk-marquee{animation:bk-marquee 30s linear infinite}
    .bk-shine::after{content:'';position:absolute;inset:0;width:40%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:bk-shine 3.2s ease-in-out infinite}
    .bk-float{animation:bk-float 6s ease-in-out infinite}
    .bk-blob{animation:bk-blob 14s ease-in-out infinite}
    .bk-gold-text{background:linear-gradient(90deg,#fde68a,#f59e0b,#fde68a,#f59e0b);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:bk-gradient 5s linear infinite}
    .bk-noscroll::-webkit-scrollbar{display:none}.bk-noscroll{scrollbar-width:none}
    @media (prefers-reduced-motion:reduce){.bk-marquee,.bk-shine::after,.bk-float,.bk-blob,.bk-gold-text{animation:none}}
  `}</style>
);

/* ───────────────────────── HELPERS ───────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const stagger = (s = 0.06) => ({ hidden: {}, show: { transition: { staggerChildren: s } } });

/* same price logic as the original ProductCard */
function getPrices(p) {
  const current = Number(p.min_price ?? p.base_price ?? 0) || 0;
  const original = p.compare_at_price ? Number(p.compare_at_price) : 0;
  return { current, original };
}

function Heading({ title, sub, light = false, align = 'center', action }) {
  const isCenter = align === 'center';
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={`mb-5 flex gap-4 ${isCenter ? 'flex-col items-center text-center' : 'items-end justify-between'}`}
    >
      <div>
        <h2 className={`font-serif text-lg font-medium sm:text-xl lg:text-2xl ${light ? 'text-white' : 'text-neutral-900'}`}>{title}</h2>
        {sub && <p className={`mt-1 text-xs sm:text-sm ${light ? 'text-red-100/80' : 'text-neutral-500'}`}>{sub}</p>}
      </div>
      {action}
    </motion.div>
  );
}

function RevealWords({ text, className = '', delay = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', rotate: 6 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: delay + i * 0.09 }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function MagneticLink({ to, children, className = '' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15 });
  const sy = useSpring(y, { stiffness: 220, damping: 15 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.div style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={reset} className="inline-block">
      <Link to={to} className={`relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-xs font-bold sm:px-7 sm:py-3.5 sm:text-sm ${className}`}>
        {children}
      </Link>
    </motion.div>
  );
}

/* ───────────────────────── COMPACT PRODUCT CARD ───────────────────────── */
function CompactCard({ product }) {
  const navigate = useNavigate();
  const customer = useAuthStore((s) => s.customer);
  const { has, toggle, load, loaded } = useWishlistStore();

  useEffect(() => {
    if (customer && !loaded) load();
  }, [customer, loaded, load]);

  const { current: price, original: compareAt } = getPrices(product);
  const off = compareAt > price && price > 0 ? Math.round((1 - price / compareAt) * 100) : 0;
  const totalStock = Number(product.total_stock);
  const outOfStock = totalStock === 0;
  const lowStock = !outOfStock && totalStock > 0 && totalStock <= LOW_STOCK_THRESHOLD;
  const isWishlisted = has(product.id);
  const ratingCount = Number(product.rating_count) || 0;
  const ratingAvg = Number(product.rating_avg) || 0;
  const href = `/product/${product.slug}`;

  async function handleWishlist(e) {
    e.preventDefault();
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

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-red-700/30 hover:shadow-[0_12px_30px_-10px_rgba(185,28,28,0.35)]"
    >
      <Link to={href} className="relative block aspect-square overflow-hidden bg-stone-100">
        {product.primary_image ? (
          <img
            src={assetUrl(product.primary_image)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-xs text-stone-300">No image</span>
        )}

        {outOfStock ? (
          <span className="absolute left-2 top-2 rounded-md bg-neutral-800/85 px-1.5 py-0.5 text-[9px] font-bold text-white">Out of stock</span>
        ) : off > 0 ? (
          <span className="absolute left-2 top-2 rounded-md bg-red-700 px-1.5 py-0.5 text-[9px] font-bold text-white shadow">-{off}%</span>
        ) : null}

        {lowStock && (
          <span className="absolute bottom-2 left-2 rounded-md bg-red-600/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
            Only {totalStock} left
          </span>
        )}
      </Link>

      <motion.button
        type="button"
        aria-label="Toggle wishlist"
        whileTap={{ scale: 0.8 }}
        onClick={handleWishlist}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 shadow backdrop-blur transition hover:scale-110"
      >
        <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-colors ${isWishlisted ? 'fill-red-600 stroke-red-600' : 'fill-none stroke-neutral-500'}`} strokeWidth="2">
          <path d="M12 21s-7-4.6-9.3-9A5.4 5.4 0 0112 6a5.4 5.4 0 019.3 6c-2.3 4.4-9.3 9-9.3 9z" />
        </svg>
      </motion.button>

      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <Link to={href} className="line-clamp-2 min-h-[2rem] text-[11px] font-semibold leading-snug text-neutral-800 transition-colors group-hover:text-red-700 sm:text-[12px]">
          {product.name}
        </Link>

        {ratingCount > 0 && (
          <div className="flex items-center gap-1">
            <Stars value={ratingAvg} size="sm" />
            <span className="text-[9px] text-neutral-400">({ratingCount})</span>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-1 pt-1">
          <div className="leading-tight">
            <p className="text-xs font-bold text-red-700 sm:text-sm">{formatCurrency(price)}</p>
            {compareAt > price && <p className="text-[9px] text-neutral-400 line-through">{formatCurrency(compareAt)}</p>}
          </div>
          {!outOfStock && (
            <Link
              to={href}
              aria-label={`View ${product.name}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-md transition-all duration-300 hover:rotate-90 hover:bg-amber-500 hover:shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProductGrid({ items }) {
  return (
    <motion.div
      variants={stagger(0.05)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6"
    >
      {items.map((p) => (
        <CompactCard key={p.id} product={p} />
      ))}
    </motion.div>
  );
}

/* ───────────────────────── SCROLL BAR ───────────────────────── */
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[100] h-1 w-full origin-left bg-gradient-to-r from-red-700 via-amber-400 to-red-700"
    />
  );
}

/* ───────────────────────── HERO — UNCHANGED ───────────────────────── */
function Hero({ slide, active, onSelect }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-white">
      <motion.div style={{ y: imgY }} className="absolute inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className="h-full w-full object-cover object-center sm:object-right"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      </motion.div>

      {/* ✅ Overlay ONLY on mobile */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white/95 via-white/70 to-white/30 sm:hidden" />

      <motion.div
        style={{ opacity: fade }}
        className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-4 py-14 sm:px-8 lg:min-h-[calc(100vh-180px)] lg:pl-12 xl:pl-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex max-w-xl flex-col items-start gap-5"
        >
          <span className="rounded-full border border-red-700/40 bg-white/80 px-3.5 py-1 text-[11px] font-semibold tracking-wide text-red-700 backdrop-blur-sm">
            The Original House Since 1940
          </span>

          <h1 className="font-serif text-3xl font-medium leading-[1.1] tracking-tight text-neutral-900 sm:text-4xl md:text-5xl lg:text-6xl">
            <RevealWords text="Make Your Special" delay={0.15} />
            <br />
            <RevealWords text="Moments More" delay={0.35} />
            <RevealWords text="Special" className="italic text-red-700" delay={0.55} />
          </h1>

          {/* ✅ Paragraph: bold + smaller on mobile */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="max-w-md text-xs font-bold leading-relaxed text-neutral-800 sm:text-sm sm:font-normal sm:text-neutral-700 md:text-base"
          >
            Premium organic groceries, dry fruits, and gift hampers, sourced directly from trusted farms and
            delivered with love to your doorstep.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 pt-1"
          >
            <MagneticLink to="/category/all" className="bk-shine bg-red-700 text-white shadow-lg shadow-red-700/30">
              Shop Now
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>→</motion.span>
            </MagneticLink>
            <MagneticLink to="/about" className="border border-red-700 bg-white/80 text-red-700 hover:bg-red-700 hover:text-white">
              Our Story
            </MagneticLink>
          </motion.div>

          <div className="flex items-center gap-1.5 pt-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-8 bg-red-700' : 'w-2 bg-gray-400 hover:bg-gray-500'}`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
/* ───────────────────────── MARQUEE ───────────────────────── */
function Marquee() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <section className="overflow-hidden border-y border-amber-500/40 bg-red-700 py-2.5">
      <div className="bk-marquee flex w-max gap-10 whitespace-nowrap">
        {[0, 1].map((d) => (
          <div key={d} className="flex gap-10">
            {row.map((t, i) => (
              <span key={`${d}-${i}`} className="flex items-center gap-3 text-xs font-semibold text-white sm:text-sm">
                <span className="text-amber-300">✦</span>
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── TRUST STRIP ───────────────────────── */
function TrustStrip() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
          <motion.div
            key={title}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-white to-amber-50 p-3 shadow-sm"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-700 text-white shadow-md">
              <Icon />
            </span>
            <div>
              <h3 className="text-xs font-bold text-neutral-900 sm:text-sm">{title}</h3>
              <p className="text-[11px] text-neutral-500 sm:text-xs">{desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ───────────────────────── CATEGORY TILES ───────────────────────── */
function CategoryTiles({ categories }) {
  if (!categories?.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Heading title="Shop by category" sub="Find exactly what your kitchen needs." />
      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {categories.map((cat, i) => (
          <motion.div key={cat.slug} variants={fadeUp} whileHover={{ y: -8 }} className={i === 0 ? 'col-span-2 sm:col-span-1' : ''}>
            <Link to={`/category/${cat.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-amber-50 shadow-md">
              {cat.banner_image ? (
                <img
                  src={assetUrl(cat.banner_image)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <span className="flex h-full items-center justify-center font-serif text-4xl text-amber-300 sm:text-5xl">{cat.name[0]}</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3 sm:p-4">
                <h3 className="font-serif text-sm font-medium text-white sm:text-base">{cat.name}</h3>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-sm text-red-900 transition-transform duration-300 group-hover:-rotate-45 group-hover:scale-110">
                  →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ───────────────────────── CATEGORY CHIPS ───────────────────────── */
function CategoryChips({ categories }) {
  if (!categories?.length) return null;
  return (
    <section className="bg-gradient-to-b from-amber-50/70 to-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="bk-noscroll flex gap-5 overflow-x-auto pb-2 sm:justify-center">
          {categories.slice(0, 8).map((cat, i) => (
            <motion.div
              key={cat.slug || i}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 160, damping: 14, delay: i * 0.07 }}
              whileHover={{ y: -6, scale: 1.08 }}
              className="shrink-0"
            >
              <Link to={`/category/${cat.slug}`} className="group flex w-20 flex-col items-center gap-2 sm:w-24">
                <span className="relative">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-1.5 rounded-full border-2 border-dashed border-amber-500/60"
                  />
                  <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-amber-100 shadow-lg sm:h-20 sm:w-20">
                    {cat.banner_image ? (
                      <img src={assetUrl(cat.banner_image)} alt={cat.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-serif text-xl text-amber-500 sm:text-2xl">{cat.name[0]}</span>
                    )}
                  </span>
                </span>
                <span className="text-center text-[10px] font-semibold leading-tight text-neutral-800 group-hover:text-red-700 sm:text-[11px]">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── FLASH DEALS ───────────────────────── */
function secondsLeft(endDate) {
  const end = endDate
    ? new Date(endDate)
    : (() => { const d = new Date(); d.setHours(24, 0, 0, 0); return d; })();
  return Math.max(0, Math.floor((end - new Date()) / 1000));
}

function useCountdown(endDate) {
  const [left, setLeft] = useState(() => secondsLeft(endDate));
  useEffect(() => {
    setLeft(secondsLeft(endDate));
    const t = setInterval(() => setLeft(secondsLeft(endDate)), 1000);
    return () => clearInterval(t);
  }, [endDate]);
  return { h: Math.floor(left / 3600), m: Math.floor((left % 3600) / 60), s: left % 60 };
}

function TimeBox({ value, label }) {
  const v = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white text-base font-bold text-red-700 shadow-lg sm:h-11 sm:w-11 sm:text-lg">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={v}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1 text-[9px] text-red-100/80">{label}</span>
    </div>
  );
}

function FlashDeals({ items, endDate }) {
  const { h, m, s } = useCountdown(endDate);
  if (!items?.length) return null;
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-800 via-red-700 to-[#4a0a0a] py-12">
      <div className="bk-blob pointer-events-none absolute -right-20 -top-20 h-72 w-72 bg-amber-400/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold text-red-900"
            >
              ⚡ Flash deals
            </motion.span>
            <h2 className="mt-2 font-serif text-xl font-medium text-white sm:text-2xl lg:text-3xl">Today only. Fresh picks, better prices.</h2>
          </div>
          <div className="flex items-center gap-2">
            <TimeBox value={h} label="Hours" />
            <span className="mb-4 text-lg font-bold text-white sm:text-xl">:</span>
            <TimeBox value={m} label="Mins" />
            <span className="mb-4 text-lg font-bold text-white sm:text-xl">:</span>
            <TimeBox value={s} label="Secs" />
          </div>
        </div>

        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bk-noscroll -mx-4 flex gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0"
        >
          {items.slice(0, 8).map((p) => (
            <div key={p.id} className="w-36 shrink-0 sm:w-44">
              <CompactCard product={p} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── HOW IT WORKS ───────────────────────── */
function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Heading title="From our family to yours, in three steps" />
      <div className="relative grid gap-6 md:grid-cols-3">
        <motion.svg
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
          className="pointer-events-none absolute left-[16%] top-8 hidden h-1 w-[68%] md:block"
        >
          <motion.line
            x1="0" y1="2" x2="100" y2="2"
            stroke="#ca8a04" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          />
        </motion.svg>
        {STEPS.map((s, i) => (
          <motion.div
            key={s.t}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.18, ease: EASE }}
            whileHover={{ y: -8 }}
            className="relative rounded-3xl border border-amber-500/30 bg-white p-5 text-center shadow-sm hover:shadow-xl sm:p-6"
          >
            <motion.div
              whileHover={{ rotate: [0, -12, 12, 0] }}
              className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-700 to-red-900 text-2xl shadow-lg"
            >
              {s.e}
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-red-900">
                {i + 1}
              </span>
            </motion.div>
            <h3 className="font-serif text-sm font-medium text-neutral-900 sm:text-base">{s.t}</h3>
            <p className="mt-1 text-xs text-neutral-500 sm:text-sm">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── SPOTLIGHT ───────────────────────── */
function Spotlight({ products }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 50]);
  const rot = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const imgs = (products || []).filter((p) => p.primary_image).slice(0, 3);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#2b0606] py-16 sm:py-24">
      <div className="bk-blob pointer-events-none absolute left-1/3 top-0 h-80 w-80 bg-red-700/30 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <h2 className="font-serif text-2xl font-medium leading-tight text-white sm:text-3xl lg:text-4xl">
            Gift hampers that say <span className="bk-gold-text italic">more than words.</span>
          </h2>
          <p className="mt-4 max-w-md text-xs leading-relaxed text-red-100/80 sm:text-sm">
            Eid, weddings, Ramadan or just because. Hand-packed boxes of premium dry fruits and organic treats, ready to gift.
          </p>
          <div className="mt-6">
            <MagneticLink to="/category/all" className="bk-shine bg-amber-400 text-red-950">
              Build a hamper →
            </MagneticLink>
          </div>
        </motion.div>

        <div className="relative mx-auto h-[22rem] w-full max-w-md sm:h-[26rem]">
          <div className="absolute inset-6 rounded-full border border-dashed border-amber-400/40" />
          {imgs.map((p, i) => {
            const pos = ['left-0 top-4', 'right-0 top-24', 'left-16 bottom-0'][i];
            const motionY = [y1, y2, y1][i];
            return (
              <motion.div
                key={p.id}
                style={{ y: motionY, rotate: i === 1 ? rot : 0 }}
                whileHover={{ scale: 1.1, zIndex: 20 }}
                className={`absolute ${pos} h-40 w-40 overflow-hidden rounded-3xl border border-white/20 bg-white p-2 shadow-2xl sm:h-48 sm:w-48`}
              >
                <img src={assetUrl(p.primary_image)} alt={p.name} className="h-full w-full rounded-2xl object-cover" />
              </motion.div>
            );
          })}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute right-4 top-0 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400 text-center text-[9px] font-extrabold leading-tight text-red-900 shadow-xl"
          >
            100%<br />ORGANIC
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── STATS ───────────────────────── */
function Counter({ value, suffix = '', label }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), o.disconnect()), { threshold: 0.4 });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  useEffect(() => {
    if (!seen) return;
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - t0) / 1600, 1);
      setN(Math.round((p === 1 ? 1 : 1 - Math.pow(2, -10 * p)) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);
  return (
    <motion.div ref={ref} variants={fadeUp} className="text-center">
      <p className="font-serif text-2xl font-medium text-red-700 sm:text-3xl lg:text-4xl">
        {n.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-[10px] font-semibold text-neutral-500 sm:text-xs">{label}</p>
    </motion.div>
  );
}

function Stats() {
  return (
    <section className="border-y-2 border-amber-500/40 bg-gradient-to-r from-amber-50 via-white to-amber-50">
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4"
      >
        <Counter value={80} suffix="+" label="Years of trust" />
        <Counter value={5000} suffix="+" label="Happy customers" />
        <Counter value={100} suffix="+" label="Organic products" />
        <Counter value={30} suffix="+" label="Cities served" />
      </motion.div>
    </section>
  );
}

/* ───────────────────────── TESTIMONIALS ───────────────────────── */
function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[i];
  return (
    <section className="relative overflow-hidden bg-white py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Heading title="Loved by families across Pakistan" />
        <div className="relative">
          <span className="pointer-events-none absolute -top-6 left-2 font-serif text-[6rem] leading-none text-red-700/10">“</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.97 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-br from-white to-amber-50 p-6 shadow-xl sm:p-8"
            >
              <div className="mb-3 flex gap-1">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <motion.svg
                    key={k}
                    viewBox="0 0 20 20"
                    className="h-4 w-4 fill-amber-500"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15 + k * 0.07, type: 'spring' }}
                  >
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                  </motion.svg>
                ))}
              </div>
              <p className="font-serif text-sm italic leading-relaxed text-neutral-800 sm:text-base lg:text-lg">{t.quote}</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-700 font-serif text-sm text-white">{t.name[0]}</span>
                <div>
                  <p className="text-xs font-bold text-neutral-900 sm:text-sm">{t.name}</p>
                  <p className="text-[10px] text-neutral-500 sm:text-xs">{t.location} · Verified buyer</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-5 flex justify-center gap-2">
          {TESTIMONIALS.map((_, k) => (
            <button
              key={k}
              type="button"
              aria-label={`Review ${k + 1}`}
              onClick={() => setI(k)}
              className={`h-2 rounded-full transition-all duration-300 ${k === i ? 'w-10 bg-red-700' : 'w-2.5 bg-neutral-300 hover:bg-neutral-400'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── FINAL CTA ───────────────────────── */
function FinalCTA({ promoBanner }) {
  return (
    <section className="px-4 pb-14 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-700 via-red-800 to-[#3d0808] px-6 py-14 text-center shadow-2xl sm:py-20"
      >
        <div className="bk-blob absolute -left-16 -top-16 h-64 w-64 bg-amber-400/25 blur-2xl" />
        <div className="bk-blob absolute -bottom-16 -right-10 h-72 w-72 bg-white/10 blur-2xl" />
        <h2 className="relative mx-auto max-w-2xl font-serif text-xl font-medium text-white sm:text-2xl lg:text-3xl">
          {promoBanner?.title || 'Fresh, pure and delivered with love.'}
        </h2>
        <p className="relative mx-auto mt-3 max-w-md text-xs text-red-100/85 sm:text-sm">
          Free shipping on orders over PKR 1000 anywhere in Pakistan.
        </p>
        <div className="relative mt-7">
          <MagneticLink
            to={promoBanner?.link_url?.startsWith('/') ? promoBanner.link_url : '/category/all'}
            className="bk-shine bg-amber-400 text-red-950 shadow-xl"
          >
            Explore the collection
          </MagneticLink>
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── MAIN ───────────────────────── */
export default function Home() {
  const { data: promoBanners } = useAsync(() => getBanners('home_promo'), []);
  const { data: featured, loading: featuredLoading } = useAsync(async () => {
    const featuredList = (await getFeaturedProducts(18)) || [];
    if (featuredList.length >= 18) return featuredList;
    const { data: latest } = await getProducts({ limit: 18, sort: 'newest' });
    const merged = [...featuredList];
    for (const p of latest || []) {
      if (merged.length >= 18) break;
      if (!merged.find((m) => m.id === p.id)) merged.push(p);
    }
    return merged;
  }, []);
  const { data: categories } = useAsync(() => getCategories(), []);
  const promoBanner = promoBanners?.[0];

  const topCategories = useMemo(() => (categories || []).filter((c) => !c.parent_id), [categories]);

  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveSlide((i) => (i + 1) % HERO_SLIDES.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  // flash = discounted products first, then fill from featured; trending = the rest (no repeats)
  const { flash, trending } = useMemo(() => {
    const all = featured || [];
    const discounted = all.filter((p) => {
      const { current, original } = getPrices(p);
      return original > current && current > 0;
    });
    const flashList = (discounted.length ? discounted : all).slice(0, 8);
    const ids = new Set(flashList.map((p) => p.id));
    return { flash: flashList, trending: all.filter((p) => !ids.has(p.id)).slice(0, 12) };
  }, [featured]);

  return (
    <div className="bk-root bg-white">
      <GlobalStyle />
      <ScrollBar />

      <Hero slide={HERO_SLIDES[activeSlide]} active={activeSlide} onSelect={setActiveSlide} />
      <Marquee />
      <TrustStrip />
      <CategoryChips categories={topCategories} />
      <CategoryTiles categories={topCategories} />

      <FlashDeals items={flash} endDate={promoBanner?.end_date} />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Heading
          title="Trending right now"
          sub="What other families are adding to their baskets."
          align="left"
          action={
            <Link to="/category/all" className="shrink-0 rounded-full border border-red-700/40 px-4 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-700 hover:text-white">
              View all
            </Link>
          }
        />
        {featuredLoading ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : trending?.length ? (
          <ProductGrid items={trending} />
        ) : featured?.length ? (
          <ProductGrid items={featured} />
        ) : (
          <p className="text-center text-neutral-500">New arrivals coming soon.</p>
        )}
      </section>

      <Spotlight products={featured} />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <FinalCTA promoBanner={promoBanner} />
    </div>
  );
}