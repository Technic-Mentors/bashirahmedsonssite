import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getFeaturedProducts } from '../api/catalog.api';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import Button from '../components/ui/Button';
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

/* ═══════════════ Inline Icons ═══════════════ */
const IconQuality = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.9l-4.8 2.5.9-5.4L4.2 8.2l5.4-.8L12 2z" />
  </svg>
);
const IconLeaf = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <path d="M20 4C11 4 4 11 4 20c9 0 16-7 16-16zM4 20l8-8" />
  </svg>
);
const IconTruck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z" />
    <circle cx="5.5" cy="18.5" r="2" />
    <circle cx="18.5" cy="18.5" r="2" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
const IconGift = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <rect x="3" y="8" width="18" height="13" rx="1" />
    <path d="M12 8v13M3 12h18M7 8a3 3 0 1 1 5-3 3 3 0 1 1 5 3" />
  </svg>
);
const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
    <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.65 12 21 12 21z" />
  </svg>
);

/* ═══════════════ Data ═══════════════ */
const VALUES = [
  {
    icon: IconLeaf,
    title: '100% Organic',
    desc: 'Every product is sourced from trusted farms and undergoes strict quality checks before it reaches your table.',
  },
  {
    icon: IconGift,
    title: 'Perfect Gift Hampers',
    desc: 'Beautifully packaged dry fruit and grocery hampers — the thoughtful gift for every occasion.',
  },
  {
    icon: IconTruck,
    title: 'Free Shipping',
    desc: 'Enjoy free nationwide delivery on all orders over PKR 1000. Cash on Delivery available.',
  },
  {
    icon: IconPin,
    title: '3 Branches in Gujranwala',
    desc: 'Visit us at Said Nagri Bazar, DC Colony, or Wapda Town — our doors are always open.',
  },
];

const VISION_MISSION = [
  {
    key: 'vision',
    eyebrow: 'Our Vision',
    title: "To be Pakistan's most trusted name in organic foods & premium dry fruits.",
    desc: 'We envision a future where every Pakistani family enjoys authentic, farm-fresh produce — sourced with integrity and delivered with the warmth of our 80-year-old family legacy.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    key: 'mission',
    eyebrow: 'Our Mission',
    title: 'Bringing purity from farm to family, since 1940.',
    desc: 'We source directly from organic farms, ensure fair prices, and deliver with care — so every family can enjoy healthy, delicious food without compromise.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
];

const INTRO_PARAGRAPHS = [
  'Bashir Ahmed & Sons was founded in 1940 with a simple promise: to bring the finest quality groceries, dry fruits, and spices to families across Pakistan. What began as a small family store in Gujranwala has grown into one of the region\'s most trusted names in premium organic foods.',
  'For over 80 years, we have stayed true to our roots — sourcing directly from trusted farms, hand-selecting every product, and packaging each order with the same care our grandfathers would have.',
  'From premium dates, almonds, pistachios, and cashews to organic spices, rice, and beautifully curated gift hampers — every product that leaves our shelves carries the Bashir Ahmed & Sons promise of purity, freshness, and honesty.',
  'Today, we deliver nationwide with free shipping on orders over PKR 1000, and we still believe that quality food should be a joy for every family, not a privilege.',
];

const DIFFERENTIATORS = [
  {
    icon: IconQuality,
    title: 'Hand-Selected Quality',
    desc: 'Every batch of dry fruits and groceries is personally inspected before it reaches our shelves — no exceptions.',
  },
  {
    icon: IconLeaf,
    title: 'Farm-Direct Sourcing',
    desc: 'We cut out the middlemen, dealing directly with organic farms for freshness and fair prices.',
  },
  {
    icon: IconHeart,
    title: 'Family-Owned, Family-Loved',
    desc: "Three generations of the same family running this business with the care we'd give our own kitchen.",
  },
];

const STATS = [
  { value: 80, suffix: '+', label: 'Years of Trust' },
  { value: 5000, suffix: '+', label: 'Happy Families' },
  { value: 100, suffix: '+', label: 'Organic Products' },
  { value: 98, suffix: '%', label: 'Satisfaction Rate' },
];

const MILESTONES = [
  { year: '1940', title: 'The Beginning', desc: 'Bashir Ahmed opens his first grocery store in Gujranwala, Punjab.' },
  { year: '1975', title: 'Second Generation', desc: 'His sons expand the business, adding premium dry fruits and spices.' },
  { year: '2000', title: 'Modern Era', desc: 'Packaged organic goods, gift hampers, and the first branded products.' },
  { year: '2024', title: 'Nationwide Reach', desc: 'Online delivery across Pakistan with the same family promise.' },
];

/* ═══════════════ Section Heading ═══════════════ */
function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="mb-6 flex flex-col items-center text-center"
    >
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-700"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="h-px w-5 origin-right bg-yellow-600"
        />
        {eyebrow}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="h-px w-5 origin-left bg-yellow-600"
        />
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="font-serif text-xl text-black sm:text-2xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-1.5 max-w-md text-sm text-gray-600"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ═══════════════ Stat Counter ═══════════════ */
function StatCounter({ value, suffix = '', label, delay = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center text-center"
    >
      <motion.span
        initial={{ letterSpacing: '0.2em' }}
        whileInView={{ letterSpacing: '0em' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.2, ease: EASE }}
        className="font-serif text-3xl text-red-700 sm:text-4xl lg:text-5xl"
      >
        {count.toLocaleString()}
        {suffix}
      </motion.span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600 sm:text-xs">
        {label}
      </span>
    </motion.div>
  );
}

/* ═══════════════ Stats Section ═══════════════ */
function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(185,28,28,0.05), rgba(202,138,4,0.06), transparent)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-6 border-y-2 border-yellow-600/40 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:py-8">
        {STATS.map((s, i) => (
          <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════ Numbers Strip (NEW) ═══════════════ */
function NumbersStrip() {
  const facts = [
    { num: '80+', text: 'Years of Family Legacy' },
    { num: '1000+', text: 'Organic Products Delivered Daily' },
    { num: '30+', text: 'Cities Across Pakistan' },
  ];
  return (
    <section className="relative overflow-hidden bg-red-800 py-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-yellow-500"
          style={{ top: `${20 + i * 12}%` }}
          animate={{ x: ['-10vw', '110vw'] }}
          transition={{ duration: 12 + i * 2, repeat: Infinity, ease: 'linear', delay: i * 1.5 }}
        />
      ))}
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:px-6">
        {facts.map((f, i) => (
          <motion.div
            key={f.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: EASE }}
            className="text-center"
          >
            <motion.p
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              className="font-serif text-3xl text-white sm:text-4xl"
            >
              {f.num}
            </motion.p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-yellow-200">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════ Timeline (NEW) ═══════════════ */
function TimelineSection() {
  return (
    <section className="relative overflow-hidden bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Our Journey"
          title="A Legacy Since 1940"
          subtitle="Four generations, one promise — purity, trust, and quality."
        />
        <div className="relative mt-10">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
            className="absolute left-4 top-0 h-full w-0.5 origin-top bg-gradient-to-b from-red-700 via-yellow-600 to-red-700 md:left-1/2 md:-translate-x-1/2"
          />
          <div className="space-y-8">
            {MILESTONES.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: EASE }}
                  className={`relative flex items-center gap-6 pl-12 md:pl-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 + 0.3, type: 'spring' }}
                    className="absolute left-4 top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-red-800 shadow-lg md:left-1/2"
                  />
                  <motion.span
                    className="absolute left-4 top-1/2 z-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-800/50 md:left-1/2"
                    animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: i * 0.3 }}
                  />
                  <div className={`w-full md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                    <motion.div
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-2xl border-2 border-yellow-600/25 bg-white p-5 shadow-md hover:border-red-700/40 hover:shadow-xl"
                    >
                      <span className="inline-block rounded-full bg-red-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        {m.year}
                      </span>
                      <h3 className="mt-3 font-serif text-lg text-black sm:text-xl">{m.title}</h3>
                      <p className="mt-1.5 text-sm text-gray-600">{m.desc}</p>
                    </motion.div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ Differentiators (NEW) ═══════════════ */
function DifferentiatorsSection() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="What Makes Us Different"
          subtitle="Three reasons families have trusted us since 1940."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {DIFFERENTIATORS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="group relative overflow-hidden rounded-xl border-2 border-yellow-600/25 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:border-red-700/40 hover:shadow-xl"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-800/10 text-red-700"
              >
                <Icon />
              </motion.div>
              <h3 className="font-serif text-lg text-black sm:text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{desc}</p>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                className="mx-auto mt-4 block h-px w-16 bg-red-800/40"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════ Main About Page ═══════════════ */
export default function AboutPage() {
  const { data: featured, loading: featuredLoading } = useAsync(() => getFeaturedProducts(8), []);

  return (
    <div className="bg-white">
      {/* ══════════════ HERO — RED BG with Golden accents ══════════════ */}
      <section className="relative overflow-hidden bg-red-800">
        <FloatingParticles count={12} />

        <motion.div
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(202,138,4,0.2),transparent_65%)]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 1.5, ease: EASE }}
          className="pointer-events-none absolute inset-0"
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
            <span className="font-semibold text-yellow-300">About</span>
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
              Our Story
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
            About Bashir Ahmed &amp; Sons
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mx-auto mt-4 max-w-lg text-sm text-red-50 sm:text-base"
          >
            Purity from farm to family — delivering Pakistan's finest organic groceries and dry fruits since 1940.
          </motion.p>

          {/* Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            className="mx-auto mt-6 h-px w-24 origin-center bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          />
        </div>
      </section>

      {/* ══════════════ INTRO — text left, collage right ══════════════ */}
      <section className="relative overflow-hidden bg-white py-10 sm:py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex h-full flex-col justify-center"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-700"
            >
              <span className="h-px w-5 bg-yellow-600" />
              Our Journey
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="font-serif text-2xl leading-tight text-black sm:text-3xl lg:text-4xl"
            >
              Rooted in Family, <span className="text-red-700">Crafted with Purity.</span>
            </motion.h2>

            <div className="mt-4 space-y-3">
              {INTRO_PARAGRAPHS.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: EASE }}
                  className="text-sm leading-relaxed text-gray-600"
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: 2×2 collage */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="relative mx-auto flex w-full max-w-[420px] items-center lg:h-full"
          >
            <div className="relative grid aspect-square h-full w-full grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-2xl bg-yellow-600/15 p-0.5 shadow-lg ring-1 ring-yellow-600/20">
              {[0, 1, 2, 3].map((idx) => {
                const product = featured?.[idx];
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 1.25 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.25 + idx * 0.1, ease: EASE }}
                    className="group relative flex items-center justify-center overflow-hidden rounded-lg bg-white"
                  >
                    {product?.primary_image ? (
                      <motion.img
                        src={assetUrl(product.primary_image)}
                        alt={product.name}
                        className="h-full w-full object-contain p-1.5"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                    ) : (
                      <span className="font-serif text-2xl text-yellow-400">
                        {product?.name?.[0] || '·'}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Handpicked badge */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
              whileHover={{ scale: 1.06 }}
              className="absolute -bottom-3 left-4 z-20 flex items-center gap-2 rounded-full border border-yellow-600/50 bg-red-800 px-3 py-1.5 shadow-md"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="h-1.5 w-1.5 rounded-full bg-yellow-400"
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                Farm-to-Family
              </span>
            </motion.div>

            {/* Rating chip */}
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
              whileHover={{ scale: 1.08, rotate: -3 }}
              className="absolute -top-3 -right-3 z-20 flex flex-col items-center rounded-xl border border-yellow-600/40 bg-white px-3 py-1.5 shadow-md"
            >
              <span className="flex items-center gap-1 font-serif text-sm text-black">
                4.9 <span className="text-yellow-600">★</span>
              </span>
              <span className="text-[8px] font-semibold uppercase tracking-wider text-gray-600">
                Rated
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ VALUES ══════════════ */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="What We Stand For" title="Our Values" />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="group flex flex-col items-center rounded-xl border-2 border-yellow-600/25 bg-white p-5 text-center shadow-sm transition-shadow duration-300 hover:border-red-700/40 hover:shadow-xl"
              >
                <motion.span
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-800/10 text-red-700"
                >
                  <Icon />
                </motion.span>
                <h3 className="mb-2 font-serif text-base text-black">{title}</h3>
                <p className="text-xs leading-relaxed text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ VISION & MISSION ══════════════ */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Our Vision & Mission"
            subtitle="Two guiding principles behind every product we deliver."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {VISION_MISSION.map((item) => (
              <motion.div
                key={item.key}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="group relative overflow-hidden rounded-xl border-2 border-yellow-600/25 bg-white p-6 shadow-sm transition-shadow duration-300 hover:border-red-700/40 hover:shadow-xl sm:p-8"
              >
                <motion.span
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 0 }}
                  whileHover={{ scaleY: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-y-6 left-0 w-0.5 origin-top bg-gradient-to-b from-red-600 to-yellow-600"
                />
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 5 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-800/10 text-red-700"
                >
                  {item.icon}
                </motion.div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-700">
                  {item.eyebrow}
                </span>
                <h3 className="mt-2 font-serif text-xl leading-snug text-black sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.desc}</p>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
                  className="pointer-events-none absolute -bottom-6 -right-4 font-serif text-[100px] leading-none text-yellow-600/10 select-none"
                >
                  {item.key === 'vision' ? '01' : '02'}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <StatsSection />

      {/* ══════════════ NUMBERS STRIP (NEW) ══════════════ */}
      <NumbersStrip />

      {/* ══════════════ TIMELINE (NEW) ══════════════ */}
      <TimelineSection />

      {/* ══════════════ DIFFERENTIATORS (NEW) ══════════════ */}
      <DifferentiatorsSection />

      {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <SectionHeading
          eyebrow="Our Collection"
          title="Featured Products"
          subtitle="A closer look at the products families trust us for."
        />

        {featuredLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : featured?.length ? (
          <>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
            >
              {featured.map((product, i) => (
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                  whileHover={{ y: -6, rotate: i % 2 === 0 ? 1 : -1 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-6 text-center">
              <Link to="/category/all">
                <Button variant="outline" size="lg">View All Products</Button>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">New arrivals coming soon.</p>
        )}
      </section>

      {/* ══════════════ OUR PROMISE ══════════════ */}
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-2 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          whileHover={{ y: -4 }}
          className="rounded-xl border-2 border-yellow-600/25 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8"
        >
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="mb-1.5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-700"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="h-px w-5 origin-right bg-yellow-600"
            />
            Our Promise to You
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="h-px w-5 origin-left bg-yellow-600"
            />
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base"
          >
            Whether you&apos;re stocking your kitchen or sending a gift to someone special, we want every order to
            feel like it came from family. That means honest sourcing, fair pricing, careful packaging, and a team
            that answers when you reach out — before, during, and after your order arrives.
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="relative overflow-hidden bg-white">
        <FloatingParticles count={8} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
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
              Ready to Order?
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
            Bring the <span className="text-red-700">Purity of Nature</span> Home
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base"
          >
            Explore our collection of organic groceries, premium dry fruits, and gift hampers — thoughtfully
            sourced for your family.
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