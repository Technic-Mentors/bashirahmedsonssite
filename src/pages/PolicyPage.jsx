import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAsync } from '../hooks/useAsync';
import { getPublicSettings } from '../api/settings.api';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

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

export default function PolicyPage() {
  const { data: settings, loading } = useAsync(() => getPublicSettings(), []);

  const returnWindow = settings?.return_window_days || 7;

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
            <span className="font-semibold text-yellow-300">Shipping &amp; Returns</span>
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
              Policy &amp; Information
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
            Shipping &amp; <span className="italic text-yellow-300">Returns</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mx-auto mt-4 max-w-lg text-sm text-red-50 sm:text-base"
          >
            Everything you need to know about delivery times and our return policy.
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

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-5"
          >
            {/* ── Shipping ── */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-xl border-2 border-yellow-600/25 bg-white p-6 shadow-sm transition-all duration-300 hover:border-red-800/40 hover:shadow-md sm:p-7"
            >
              <span className="absolute inset-y-5 left-0 w-0.5 bg-gradient-to-b from-red-700 to-yellow-600" />

              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-800/10 text-red-800">
                  <TruckIcon />
                </span>
                <div className="flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-800">
                    Delivery
                  </span>
                  <h2 className="mt-0.5 font-serif text-xl text-black sm:text-2xl">Shipping</h2>
                  <div className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
                    <p>
                      We deliver across Pakistan with{' '}
                      <strong className="text-black">Cash on Delivery</strong> — pay only when your order arrives
                      at your doorstep. No advance payment required.
                    </p>
                    <p>
                      Enjoy <strong className="text-black">free shipping</strong> on all orders over PKR 1000.
                      Orders are confirmed by phone before dispatch and typically arrive within{' '}
                      <strong className="text-black">2–4 business days</strong>. Remote areas may take slightly
                      longer.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <InfoPill label="Cash on Delivery" />
                    <InfoPill label="Free shipping over PKR 1000" />
                    <InfoPill label="2–4 business days" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Returns ── */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-xl border-2 border-yellow-600/25 bg-white p-6 shadow-sm transition-all duration-300 hover:border-red-800/40 hover:shadow-md sm:p-7"
            >
              <span className="absolute inset-y-5 left-0 w-0.5 bg-gradient-to-b from-red-700 to-yellow-600" />

              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-800/10 text-red-800">
                  <ReturnIcon />
                </span>
                <div className="flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-800">
                    Peace of Mind
                  </span>
                  <h2 className="mt-0.5 font-serif text-xl text-black sm:text-2xl">Returns</h2>
                  <div className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
                    <p>
                      {settings?.return_policy_text ||
                        `Products can be returned within ${returnWindow} days of delivery if unused and in original packaging.`}
                    </p>
                    <p>
                      To start a return, contact us with your order number and reason. Once we confirm eligibility,
                      we&apos;ll arrange the pickup or provide return instructions.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <InfoPill label={`${returnWindow}-day window`} />
                    <InfoPill label="Unused condition" />
                    <InfoPill label="Original packaging" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Quality Promise ── */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-xl border-2 border-yellow-600/25 bg-white p-6 shadow-sm transition-all duration-300 hover:border-red-800/40 hover:shadow-md sm:p-7"
            >
              <span className="absolute inset-y-5 left-0 w-0.5 bg-gradient-to-b from-red-700 to-yellow-600" />

              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-800/10 text-red-800">
                  <QualityIcon />
                </span>
                <div className="flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-800">
                    Quality Guaranteed
                  </span>
                  <h2 className="mt-0.5 font-serif text-xl text-black sm:text-2xl">Our Promise</h2>
                  <div className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
                    <p>
                      Every product is sourced from trusted organic farms and hand-inspected before dispatch.
                      If anything arrives damaged, incorrect, or below our standard, contact us within 48 hours
                      and we&apos;ll make it right.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <InfoPill label="100% Organic" />
                    <InfoPill label="Hand-inspected" />
                    <InfoPill label="Family-owned since 1940" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
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
              Still Have Questions?
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
            Our Team is Here to <span className="text-red-800">Help</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base"
          >
            Reach out before, during, or after your order — we respond within 24 hours.
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

/* ═══════════════ Helpers ═══════════════ */
function InfoPill({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-600/30 bg-yellow-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-red-800">
      <span className="h-1 w-1 rounded-full bg-red-800" />
      {label}
    </span>
  );
}

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z" />
      <circle cx="5.5" cy="18.5" r="2" />
      <circle cx="18.5" cy="18.5" r="2" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function QualityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.9l-4.8 2.5.9-5.4L4.2 8.2l5.4-.8L12 2z" />
    </svg>
  );
}