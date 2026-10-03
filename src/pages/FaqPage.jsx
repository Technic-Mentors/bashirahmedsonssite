import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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

const FAQS = [
  {
    q: 'Are your products 100% organic and authentic?',
    a: 'Yes. Every product is sourced from trusted organic farms and undergoes strict quality checks before it reaches your doorstep — the same standards we have followed since 1940.',
  },
  {
    q: 'Do you offer Cash on Delivery?',
    a: 'Yes, we offer Cash on Delivery nationwide across Pakistan. You only pay when your order arrives.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders are typically delivered within 2–4 business days, depending on your city. Our team confirms every order by phone before dispatch.',
  },
  {
    q: 'Is shipping free?',
    a: 'Yes — we offer free shipping on all orders over PKR 1000 across Pakistan.',
  },
  {
    q: 'Can I return or exchange a product?',
    a: 'Absolutely. We offer hassle-free returns within 7 days of delivery if you are not fully satisfied. See our Shipping & Returns policy for details.',
  },
  {
    q: 'Do you deliver gift hampers?',
    a: 'Yes! Our beautifully packaged dry fruit and grocery gift hampers are perfect for Eid, weddings, and corporate gifting — delivered fresh anywhere in Pakistan.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

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
            <span className="font-semibold text-yellow-300">FAQ</span>
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
              Help Center
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
            Frequently Asked <span className="italic text-yellow-300">Questions</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mx-auto mt-4 max-w-lg text-sm text-red-50 sm:text-base"
          >
            Quick answers about our products, delivery, returns, and everything else you need to know.
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

      {/* ══════════════ FAQ ACCORDION ══════════════ */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-3"
        >
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`group overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all duration-300 ${
                  isOpen
                    ? 'border-red-800/40 shadow-md'
                    : 'border-yellow-600/25 hover:border-red-800/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-red-50/40 sm:px-6 sm:py-5"
                >
                  <span className="flex items-start gap-3.5">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-300 ${
                        isOpen
                          ? 'bg-red-800 text-white'
                          : 'bg-red-800/10 text-red-800 group-hover:bg-red-800/20'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-serif text-base leading-snug transition-colors sm:text-lg ${
                        isOpen ? 'text-red-800' : 'text-black'
                      }`}
                    >
                      {faq.q}
                    </span>
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      isOpen
                        ? 'border-red-800 bg-red-800 text-white'
                        : 'border-yellow-600/40 bg-yellow-50 text-red-800'
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      {isOpen ? (
                        <path d="M5 12h14" />
                      ) : (
                        <>
                          <path d="M12 5v14" />
                          <path d="M5 12h14" />
                        </>
                      )}
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-yellow-600/20 px-5 pb-5 pt-4 pl-[3.25rem] sm:px-6 sm:pl-[3.75rem]">
                        <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
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
              Still Need Help?
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
            Couldn&apos;t Find Your <span className="text-red-800">Answer?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base"
          >
            Our team responds within 24 hours — before, during, and after your order arrives.
          </motion.p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Button variant="gold" size="lg">Contact Support</Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}