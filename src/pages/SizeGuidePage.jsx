import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const SECTIONS = [
  {
    category: 'Men',
    groups: [
      {
        label: 'Jubbahs & Thobes (Stitched)',
        note: "Based on body measurements. If you're between two sizes, we recommend choosing the larger one for comfort during long hours of worship.",
        headers: ['Size', 'Chest (in)', 'Shoulder (in)', 'Length (in)'],
        rows: [
          ['S', '36-38', '17', '56'],
          ['M', '38-40', '17.5', '58'],
          ['L', '40-42', '18', '60'],
          ['XL', '42-44', '18.5', '62'],
          ['XXL', '44-46', '19', '64'],
        ],
      },
      {
        label: 'Ihram Sets (Unstitched)',
        note: "Ihram is sold as two unstitched fabric pieces and isn't sized to body measurements — one standard length fits most builds comfortably.",
        headers: ['Piece', 'Length', 'Width'],
        rows: [
          ['Waist wrap (Izaar)', '2.5 m', '1.1 m'],
          ['Upper wrap (Rida)', '2.5 m', '1.1 m'],
        ],
      },
    ],
  },
  {
    category: 'Women',
    groups: [
      {
        label: 'Abayas & Prayer Sets',
        note: 'Sizes run true to standard Pakistani ready-to-wear sizing.',
        headers: ['Size', 'Chest (in)', 'Waist (in)', 'Length (in)'],
        rows: [
          ['XS', '30-32', '26-28', '52'],
          ['S', '32-34', '28-30', '54'],
          ['M', '36-38', '32-34', '55'],
          ['L', '40-42', '36-38', '56'],
          ['XL', '44-46', '40-42', '57'],
          ['XXL', '48-50', '44-46', '58'],
        ],
      },
    ],
  },
  {
    category: 'Kids',
    groups: [
      {
        label: "Boys' & Girls' Hajj Wear",
        note: "Children's builds vary widely at the same age — use height as the primary guide and chest as a secondary check.",
        headers: ['Age', 'Height (cm)', 'Chest (in)'],
        rows: [
          ['2-3 yrs', '85-99', '20-21'],
          ['4-6 yrs', '100-115', '22-24'],
          ['7-9 yrs', '116-130', '25-27'],
          ['10-12 yrs', '131-145', '28-30'],
          ['13-15 yrs', '146-160', '31-33'],
        ],
      },
    ],
  },
];

const HOW_TO_MEASURE = [
  ['Chest', 'Measure around the fullest part of your chest, keeping the tape level and snug but not tight.'],
  ['Waist', 'Measure around your natural waistline, just above the belly button.'],
  ['Shoulder', 'Measure straight across the back, from the edge of one shoulder to the other.'],
  ['Length', 'Measure from the top of the shoulder straight down to where you want the garment to end.'],
];

export default function SizeGuidePage() {
  return (
    <div>
      {/* ══════════════ HERO — Black & Gold ══════════════ */}
      <section className="relative overflow-hidden bg-charcoal">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_65%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <nav className="mb-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-stone-400">
            <Link to="/" className="transition-colors hover:text-gold-400">Home</Link>
            <span className="text-gold-500/50">/</span>
            <span className="text-gold-400">Size Guide</span>
          </nav>

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/60" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-500">
              Find Your Fit
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/60" />
          </div>

          <h1 className="font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
            Size <span className="text-gold-500">Guide</span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm text-stone-300 sm:text-base">
            Measurements for Men, Women, and Kids — find your perfect fit before you order.
          </p>

          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>
      </section>

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* ── How to Measure ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative mb-8 overflow-hidden rounded-xl border border-gold-500/15 bg-white p-6 shadow-sm sm:p-7"
        >
          <span className="absolute inset-y-5 left-0 w-0.5 bg-gradient-to-b from-gold-400 to-gold-600" />

          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
            <span className="h-px w-5 bg-gold-400" />
            Getting the Right Measurements
            <span className="h-px w-5 bg-gold-400" />
          </span>

          <h2 className="mt-1.5 font-serif text-xl text-charcoal sm:text-2xl">
            How to Measure
          </h2>

          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {HOW_TO_MEASURE.map(([term, desc]) => (
              <div key={term} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                <div>
                  <dt className="text-sm font-semibold text-charcoal">{term}</dt>
                  <dd className="text-xs leading-relaxed text-charcoal-light sm:text-sm">{desc}</dd>
                </div>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* ── Category Sections ── */}
        {SECTIONS.map(({ category, groups }) => (
          <motion.div
            key={category}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/10 font-serif text-sm text-gold-600">
                {category[0]}
              </span>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Category
                </span>
                <h2 className="font-serif text-xl leading-tight text-charcoal sm:text-2xl">
                  {category}
                </h2>
              </div>
            </div>

            <div className="space-y-5">
              {groups.map((group) => (
                <motion.div
                  key={group.label}
                  variants={fadeUp}
                  className="overflow-hidden rounded-xl border border-gold-500/15 bg-white shadow-sm"
                >
                  <div className="border-b border-gold-500/15 bg-gold-50/40 px-5 py-4">
                    <h3 className="font-serif text-base text-charcoal sm:text-lg">
                      {group.label}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-charcoal-light sm:text-sm">
                      {group.note}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max border-collapse text-sm">
                      <thead>
                        <tr className="bg-charcoal">
                          {group.headers.map((h) => (
                            <th
                              key={h}
                              className="border-b border-gold-500/20 px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gold-400"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {group.rows.map((row, i) => (
                          <tr
                            key={i}
                            className="transition-colors duration-200 hover:bg-gold-50/50"
                          >
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className={`border-b border-stone-100 px-4 py-2.5 ${
                                  j === 0
                                    ? 'font-medium text-charcoal'
                                    : 'text-charcoal-light'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ══════════════ FINAL CTA — no background, matches About/Contact/FAQ/Offers ══════════════ */}
      <section className="relative overflow-hidden bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6"
        >
          <div className="mb-1 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/60" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
              Need a Hand?
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/60" />
          </div>

          <h2 className="font-serif text-2xl leading-tight text-charcoal sm:text-3xl lg:text-4xl">
            Still Unsure Which <span className="text-gold-600">Size to Pick?</span>
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal-light sm:text-base">
            Send us your measurements and we&apos;ll help you choose the perfect fit before you order.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button variant="gold" size="lg">Contact Us</Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}