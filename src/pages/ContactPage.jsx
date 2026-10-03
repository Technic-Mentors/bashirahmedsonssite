import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAsync } from '../hooks/useAsync';
import { getPublicSettings } from '../api/settings.api';
import { submitContactMessage } from '../api/contact.api';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';

const EASE = [0.22, 1, 0.36, 1];

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

export default function ContactPage() {
  const { data: settings } = useAsync(() => getPublicSettings(), []);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const address = settings?.store_address || 'Gujranwala, Punjab, Pakistan';
  const phone = settings?.store_phone;
  const email = settings?.store_email;

  async function handleSubmit(e) {
    e.preventDefault();

    const name = form.name.trim();
    if (name.length < 2 || name.length > 25) {
      toast.error('Name must be between 2 and 25 characters.');
      return;
    }
    if (!/^[A-Za-z ]+$/.test(name)) {
      toast.error('Name can only contain letters and spaces.');
      return;
    }

    setSending(true);
    try {
      await submitContactMessage(form);
      toast.success("Thanks! We'll be in touch soon.");
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not send your message. Please try again.');
    } finally {
      setSending(false);
    }
  }

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

        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:py-14">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-red-100"
          >
            <Link to="/" className="transition-colors hover:text-yellow-300">
              Home
            </Link>
            <span className="text-yellow-400">/</span>
            <span className="font-semibold text-yellow-300">Contact</span>
          </motion.nav>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="mb-3 flex items-center justify-center gap-3"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
              className="h-px w-10 origin-right bg-gradient-to-r from-transparent to-yellow-400"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-300">
              We&apos;re Here to Help
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
            className="font-serif text-3xl leading-tight text-white sm:text-4xl lg:text-5xl"
          >
            Get in <span className="italic text-yellow-300">Touch</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mx-auto mt-3 max-w-xl text-sm text-red-50"
          >
            Questions about an order, our products, or your next gift hamper? We&apos;re happy to help.
          </motion.p>

          {/* Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          />
        </div>
      </section>

      {/* ══════════════ CONTACT CONTENT ══════════════ */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* ── LEFT: Contact info + map ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col overflow-hidden rounded-xl border-2 border-yellow-600/25 bg-white shadow-sm"
          >
            {/* Header bar */}
            <div className="relative overflow-hidden bg-red-800 px-5 py-4">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(202,138,4,0.25),transparent_70%)]" />
              <div className="relative">
                <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-300">
                  <span className="h-px w-5 bg-yellow-400" />
                  Contact Information
                </span>
                <h2 className="mt-1 font-serif text-lg text-white">
                  Visit, Call, or Email Us
                </h2>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-yellow-600/15">
              <ContactRow
                icon={<PinIcon />}
                label="Address"
                value={address}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                external
              />
              <ContactRow
                icon={<PhoneIcon />}
                label="Phone"
                value={phone || '+92 320 2644545'}
                href={phone ? `tel:${phone.replace(/\s+/g, '')}` : 'tel:+923202644545'}
              />
              <ContactRow
                icon={<MailIcon />}
                label="Email"
                value={email || 'info@bashirahmedsons.com'}
                href={email ? `mailto:${email}` : 'mailto:info@bashirahmedsons.com'}
              />
            </div>

            {/* Map */}
            <div className="relative flex-1 overflow-hidden border-t border-yellow-600/15">
              <iframe
                title="Store location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                width="100%"
                height="240"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-full min-h-[240px] w-full"
              />
            </div>
          </motion.div>

          {/* ── RIGHT: Form ── */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
            onSubmit={handleSubmit}
            className="flex flex-col overflow-hidden rounded-xl border-2 border-yellow-600/25 bg-white shadow-sm"
          >
            {/* Header bar */}
            <div className="relative overflow-hidden bg-red-800 px-5 py-4">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(202,138,4,0.25),transparent_70%)]" />
              <div className="relative">
                <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-300">
                  <span className="h-px w-5 bg-yellow-400" />
                  Send a Message
                </span>
                <h2 className="mt-1 font-serif text-lg text-white">
                  We&apos;ll Reply Within 24 Hours
                </h2>
              </div>
            </div>

            {/* Form fields */}
            <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
              <Input
                label="Your Name"
                required
                maxLength={25}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Textarea
                label="Your Message"
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <div className="mt-auto pt-1">
                <Button type="submit" variant="gold" loading={sending} className="w-full">
                  Send Message
                </Button>
              </div>
            </div>
          </motion.form>
        </div>
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
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-700">
              Explore Our Collection
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
            Ready to Bring <span className="text-red-700">Purity Home?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base"
          >
            Browse our premium selection of organic groceries, dry fruits, and gift hampers — with free shipping
            over PKR 1000 and cash on delivery across Pakistan.
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

/* ═══════════════ Contact Row (clickable) ═══════════════ */
function ContactRow({ icon, label, value, href, external }) {
  const content = (
    <>
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-800/10 text-red-700 transition-transform duration-300 group-hover:scale-110 group-hover:bg-red-800/20">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-700">{label}</p>
        <p className="mt-0.5 truncate text-sm text-black transition-colors group-hover:text-red-700">
          {value || '—'}
        </p>
      </div>
      {href && (
        <span className="mt-2 shrink-0 text-yellow-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ArrowIcon />
        </span>
      )}
    </>
  );

  const baseClass = 'group flex items-start gap-3 px-5 py-4 transition-colors duration-200';

  if (!href) {
    return <div className={baseClass}>{content}</div>;
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} hover:bg-yellow-50/60`}
      >
        {content}
      </a>
    );
  }

  return (
    <a href={href} className={`${baseClass} hover:bg-yellow-50/60`}>
      {content}
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.5 2.9.6a2 2 0 0 1 1.8 2Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}