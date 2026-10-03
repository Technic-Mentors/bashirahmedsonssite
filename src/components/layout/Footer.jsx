import { Link } from 'react-router-dom';
import { TruckIcon, ReturnIcon, BadgeIcon, LockIcon } from '../icons/TrustIcons';

const TRUST_POINTS = [
  { icon: TruckIcon, label: 'Free Shipping', description: 'On orders over PKR 1000' },
  { icon: ReturnIcon, label: 'Easy Returns', description: 'Hassle-free returns' },
  { icon: BadgeIcon, label: '100% Organic', description: 'Farm-fresh quality' },
  { icon: LockIcon, label: 'Secure Checkout', description: 'Your details stay safe' },
];

const WHATSAPP_NUMBER = '923202644545';
const PHONE_DISPLAY = '+92 320 2644545';
const FACEBOOK_URL = 'https://www.facebook.com/BashirAhmedSons/';
const INSTAGRAM_URL = 'https://www.instagram.com/bashirahmedsons?igshid=YmMyMTA2M2Y%3D';
const YOUTUBE_URL = 'https://www.youtube.com/channel/UCEoAQeohCsUl-sazMtD0mcA';

const BRANCHES = [
  { label: 'Said Nagri Bazar', detail: 'Near Lahori Gate, Gujranwala' },
  { label: 'DC Colony', detail: 'Neelum Block Commercial Market Plaza Plot No. 15, Gujranwala' },
  { label: 'Wapda Town', detail: 'Main Market, Gujranwala' },
];

export default function Footer() {
  return (
    <footer className="relative mt-2 overflow-hidden bg-white text-black">
      {/* ══════════════ MAIN GRID ══════════════ */}
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* ── Brand column ── */}
          <div className="lg:pr-4">
            <Link to="/" className="mb-3 inline-flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Bashir Ahmed Sons logo"
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-105"
              />
              <div>
                <span className="block font-serif text-base leading-tight text-black">
                  Bashir Ahmed Sons
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-red-700">
                  Since 1940
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-gray-700">
              Premium organic groceries, dry fruits, and gift hampers — sourced from trusted farms and delivered
              with love to families across Pakistan since 1940.
            </p>

            {/* Social icons */}
            <div className="mt-4 flex items-center gap-1.5">
              <SocialLink href={FACEBOOK_URL} label="Facebook" icon={<FacebookIcon />} />
              <SocialLink href={INSTAGRAM_URL} label="Instagram" icon={<InstagramIcon />} />
              <SocialLink href={YOUTUBE_URL} label="YouTube" icon={<YouTubeIcon />} />
              <SocialLink
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                label="WhatsApp"
                icon={<WhatsAppIcon />}
              />
            </div>
          </div>

          {/* ── Shop links ── */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-700">
              <span className="h-px w-3 bg-red-700" />
              Shop
            </h4>
            <ul className="space-y-1.5 text-sm">
              <FooterLink to="/category/dry-fruits">Dry Fruits &amp; Nuts</FooterLink>
              <FooterLink to="/category/organic">Organic Groceries</FooterLink>
              <FooterLink to="/category/gift-hampers">Gift Hampers</FooterLink>
              <FooterLink to="/category/spices">Spices &amp; Herbs</FooterLink>
              <FooterLink to="/offers">Special Offers</FooterLink>
            </ul>
          </div>

          {/* ── Help + Contact ── */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-700">
              <span className="h-px w-3 bg-red-700" />
              Help
            </h4>
            <ul className="space-y-1.5 text-sm">
              <FooterLink to="/faq">FAQs</FooterLink>
              <FooterLink to="/policy">Shipping &amp; Returns</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
            </ul>

            {/* Contact block */}
            <div className="mt-3 space-y-1 border-t border-red-700/20 pt-3">
              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="flex items-center gap-1.5 text-[11px] text-gray-700 transition-colors hover:text-red-700"
              >
                <PhoneIconSmall />
                <span>{PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>

          {/* ── Visit Our Branches ── */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-700">
              <span className="h-px w-3 bg-red-700" />
              Visit Our Branches
            </h4>
            <ul className="space-y-2.5">
              {BRANCHES.map((branch) => (
                <li key={branch.label} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-700/30 bg-red-50 text-red-700">
                    <PinIconSmall />
                  </span>
                  <span className="leading-tight">
                    <p className="text-[11px] font-semibold text-black">{branch.label}</p>
                    <p className="text-[10px] text-gray-600">{branch.detail}</p>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ══════════════ BOTTOM BAR (bg-red-500) ══════════════ */}
      <div className="relative border-t border-red-700/30 bg-red-700">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-3 text-[11px] text-white sm:flex-row sm:px-6">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Bashir Ahmed Sons. All rights reserved.
          </p>
          <p className="flex items-center justify-center gap-1 text-center">
            Developed with{' '}
            <HeartIcon className="inline-block h-2.5 w-2.5 text-white" filled /> by{' '}
            <a
              href="https://technicmentors.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white transition-colors hover:text-yellow-200"
            >
              Technic Mentors
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════ Helpers ═══════════════ */
function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="group inline-flex items-center gap-1 text-gray-700 transition-colors hover:text-red-700"
      >
        <span className="h-px w-0 bg-red-700 transition-all duration-300 group-hover:w-2.5" />
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-red-700/30 bg-white/60 text-red-700 transition-all duration-300 hover:scale-110 hover:border-red-700 hover:bg-red-700 hover:text-white"
    >
      {icon}
    </a>
  );
}

/* ═══════════════ Icons ═══════════════ */
function HeartIcon({ className, filled }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.65 12 21 12 21z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor">
      <path d="M16.001 3C9.376 3 4 8.376 4 15c0 2.378.694 4.59 1.885 6.45L4 29l7.76-1.832A11.94 11.94 0 0 0 16 27c6.624 0 12-5.376 12-12S22.625 3 16.001 3zm0 21.75a9.68 9.68 0 0 1-4.94-1.352l-.354-.21-4.605 1.087 1.115-4.486-.23-.368A9.7 9.7 0 0 1 6.25 15c0-5.376 4.375-9.75 9.75-9.75 5.376 0 9.75 4.374 9.75 9.75 0 5.376-4.374 9.75-9.75 9.75zm5.35-7.296c-.294-.147-1.737-.857-2.006-.954-.27-.098-.466-.147-.662.147-.196.294-.759.954-.93 1.15-.173.196-.343.22-.637.074-.294-.147-1.243-.458-2.367-1.46-.875-.78-1.465-1.744-1.637-2.038-.172-.294-.018-.453.128-.6.13-.13.294-.343.44-.515.147-.171.196-.294.294-.49.098-.196.049-.368-.024-.515-.074-.147-.662-1.598-.908-2.188-.238-.574-.48-.497-.662-.506l-.564-.01c-.196 0-.514.073-.784.367-.27.294-1.029 1.006-1.029 2.452s1.054 2.844 1.2 3.04c.147.196 2.073 3.166 5.023 4.44.702.302 1.25.482 1.677.617.705.223 1.347.191 1.855.116.566-.084 1.737-.71 1.983-1.396.245-.687.245-1.276.172-1.396-.074-.122-.27-.196-.564-.343z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
    </svg>
  );
}

function PinIconSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
      <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PhoneIconSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.5 2.9.6a2 2 0 0 1 1.8 2Z" />
    </svg>
  );
}