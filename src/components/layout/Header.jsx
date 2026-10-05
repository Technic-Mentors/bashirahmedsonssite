import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore, cartItemCount } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAsync } from '../../hooks/useAsync';
import { getCategories } from '../../api/catalog.api';
import { cn } from '../../utils/cn';
import CustomerNotificationBell from './CustomerNotificationBell';
import SearchBar from './SearchBar';

const NAV_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/offers', label: 'Offers' },
  { to: '/contact', label: 'Contact' },
];

const FACEBOOK_URL = 'https://www.facebook.com/BashirAhmedSons/';
const INSTAGRAM_URL = 'https://www.instagram.com/bashirahmedsons?igshid=YmMyMTA2M2Y%3D';
const YOUTUBE_URL = 'https://www.youtube.com/channel/UCEoAQeohCsUl-sazMtD0mcA';

const Header = React.forwardRef(function Header(_, ref) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);

  const customer = useAuthStore((s) => s.customer);
  const items = useCartStore((s) => s.items);
  const count = cartItemCount(items);
  const wishlistCount = useWishlistStore((s) => s.productIds.size);
  const wishlistLoaded = useWishlistStore((s) => s.loaded);

  const { data: categories } = useAsync(() => getCategories(), []);
  const topCategories = (categories || []).filter((c) => !c.parent_id);
  const subcategoriesOf = (id) =>
    (categories || []).filter((c) => c.parent_id === id);

  /* ── Cart icon pop + count bump, triggered whenever cart count changes ── */
  const cartControls = useAnimationControls();
  const prevCountRef = useRef(count);
  const [cartBump, setCartBump] = useState(false);

  useEffect(() => {
    // Only pop when the count actually increases (not on initial mount or on removal)
    if (count > prevCountRef.current) {
      cartControls.start({
        scale: [1, 1.35, 0.9, 1.08, 1],
        rotate: [0, -12, 10, -4, 0],
        transition: { duration: 0.6, ease: 'easeOut' },
      });
      setCartBump(true);
      setTimeout(() => setCartBump(false), 650);
    }
    prevCountRef.current = count;
  }, [count, cartControls]);

  useEffect(() => {
    if (customer && !wishlistLoaded) {
      useWishlistStore.getState().load();
    }
  }, [customer, wishlistLoaded]);

  // Reset mobile category states when the drawer closes
  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileCategoriesOpen(false);
      setMobileExpandedCat(null);
    }
  }, [mobileMenuOpen]);

  // 🔒 Lock body scroll when full-screen mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ══════════════ STICKY HEADER ══════════════ */}
      <header
        ref={ref}
        className="sticky top-0 z-40 border-b border-yellow-600/20 bg-white/95 backdrop-blur"
      >
        {/* ══════════════ TOP ANNOUNCEMENT STRIP (RED BG) ══════════════ */}
        <div className="relative overflow-hidden bg-red-700">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
            <p className="text-[11px] font-medium tracking-wide text-white sm:text-xs">
              Welcome to{' '}
              <span className="font-semibold text-yellow-300">Bashir Ahmed Sons</span>
              <span className="mx-1.5 text-white/70">—</span>
              <span className="text-white/90">Premium Organic Since 1940</span>
            </p>

            <div className="flex items-center gap-0.5">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-all duration-300 hover:bg-white/15 hover:text-yellow-300"
              >
                <FacebookIcon />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-all duration-300 hover:bg-white/15 hover:text-yellow-300"
              >
                <InstagramIcon />
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-all duration-300 hover:bg-white/15 hover:text-yellow-300"
              >
                <YouTubeIcon />
              </a>
            </div>
          </div>
        </div>

        {/* ══════════════ MAIN HEADER ══════════════ */}
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2.5 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img src="/logo.png" alt="Bashir Ahmed Sons" className="h-12 w-12" />
            <span className="hidden font-serif text-xl font-semibold tracking-wide text-black sm:block">
              Bashir Ahmed Sons
            </span>
          </Link>

          <nav className="hidden items-center justify-center gap-6 md:flex">
            <NavLink to="/" end className={({ isActive }) => navLinkClass(isActive)}>
              Home
            </NavLink>

            <CategoriesDropdown
              topCategories={topCategories}
              subcategoriesOf={subcategoriesOf}
            />

            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-4">
            <div className="hidden lg:block lg:w-44 xl:w-56">
              <SearchBar
                placeholder="Search..."
                iconClassName="left-2.5"
                inputClassName="w-full rounded-full border border-gray-300 bg-white py-1.5 pl-8 pr-3 text-sm focus:border-red-700 focus:outline-none"
              />
            </div>

            <Link
              to="/search"
              aria-label="Search"
              className="flex h-[19px] w-[19px] items-center justify-center text-gray-600 hover:text-red-700 lg:hidden"
            >
              <SearchIcon />
            </Link>

            <div className="flex items-center gap-3.5">
              {customer && <CustomerNotificationBell />}

              <Link
                to={customer ? '/account/wishlist' : '/login'}
                aria-label="Wishlist"
                className="relative flex h-[19px] w-[19px] items-center justify-center text-gray-600 hover:text-red-700"
              >
                <HeartIcon />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-700 text-[10px] font-semibold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to={customer ? '/account' : '/login'}
                aria-label="Account"
                className="hidden h-[19px] w-[19px] items-center justify-center text-gray-600 hover:text-red-700 sm:flex"
              >
                <UserIcon />
              </Link>

              {/* ── Cart icon with auto pop + count bump on item add ── */}
              <motion.div animate={cartControls} className="relative">
                <Link
                  to="/cart"
                  aria-label="Cart"
                  className="relative flex h-[19px] w-[19px] items-center justify-center text-gray-600 hover:text-red-700"
                >
                  <CartIcon />

                  <AnimatePresence>
                    {count > 0 && (
                      <motion.span
                        key={`cart-${count}`}
                        initial={{ scale: 0, y: -6, opacity: 0 }}
                        animate={{
                          scale: cartBump ? [1, 1.5, 1] : 1,
                          y: 0,
                          opacity: 1,
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                        className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-700 text-[10px] font-semibold text-white"
                      >
                        {count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            </div>

            <button
              aria-label="Menu"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="text-gray-600 hover:text-red-700 md:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════ MOBILE MENU — FULL SCREEN OVERLAY (OUTSIDE HEADER) ══════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] flex flex-col bg-white md:hidden"
          >
            {/* Top bar: logo + close */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <img src="/logo.png" alt="Bashir Ahmed Sons" className="h-10 w-10" />
                <span className="font-serif text-lg font-semibold tracking-wide text-black">
                  Bashir Ahmed Sons
                </span>
              </Link>

              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-700"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-1">
                <SearchBar
                  placeholder="Search products..."
                  iconClassName="left-3"
                  inputClassName="w-full rounded-full border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-red-700 focus:outline-none"
                  onNavigate={() => setMobileMenuOpen(false)}
                />

                <NavLink
                  to="/"
                  end
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => mobileNavLinkClass(isActive)}
                >
                  Home
                </NavLink>

                {/* ─── COMPACT MOBILE CATEGORIES (Screenshot Style) ─── */}
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setMobileCategoriesOpen((v) => !v)}
                    className="flex w-full items-center justify-between px-1 py-3 text-[15px] font-medium text-gray-800 transition-colors hover:text-red-700"
                  >
                    <span>Categories</span>
                    <ChevronIcon open={mobileCategoriesOpen} />
                  </button>

                  <AnimatePresence initial={false}>
                    {mobileCategoriesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        {topCategories.length === 0 ? (
                          <p className="px-1 py-2 text-sm text-gray-500">No categories yet.</p>
                        ) : (
                          <ul className="flex flex-col gap-1.5 pb-2 pl-4 pr-2">
                            {topCategories.map((cat) => {
                              const subs = subcategoriesOf(cat.id);
                              const isExpanded = mobileExpandedCat === cat.id;

                              return (
                                <li key={cat.id} className="flex flex-col">
                                  <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 transition-colors hover:bg-gray-100">
                                    <Link
                                      to={`/category/${cat.slug}`}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="flex-1 text-[14px] font-medium text-gray-700 hover:text-red-700"
                                    >
                                      {cat.name}
                                    </Link>

                                    {subs.length > 0 && (
                                      <button
                                        type="button"
                                        aria-label={`Toggle ${cat.name} subcategories`}
                                        onClick={() =>
                                          setMobileExpandedCat((prev) =>
                                            prev === cat.id ? null : cat.id
                                          )
                                        }
                                        className="ml-2 flex h-6 w-6 items-center justify-center text-gray-400 hover:text-red-700"
                                      >
                                        <ChevronIcon open={isExpanded} />
                                      </button>
                                    )}
                                  </div>

                                  <AnimatePresence initial={false}>
                                    {isExpanded && subs.length > 0 && (
                                      <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        className="overflow-hidden"
                                      >
                                        <div className="mt-1 ml-2 flex flex-col border-l-2 border-gray-200 pl-3">
                                          {subs.map((sub) => (
                                            <Link
                                              key={sub.id}
                                              to={`/category/${sub.slug}`}
                                              onClick={() => setMobileMenuOpen(false)}
                                              className="py-2 text-[13.5px] text-gray-600 hover:text-red-700"
                                            >
                                              {sub.name}
                                            </Link>
                                          ))}
                                        </div>
                                      </motion.ul>
                                    )}
                                  </AnimatePresence>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => mobileNavLinkClass(isActive)}
                  >
                    {link.label}
                  </NavLink>
                ))}

                <NavLink
                  to={customer ? '/account/wishlist' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => mobileNavLinkClass(isActive)}
                >
                  Wishlist
                </NavLink>

                <NavLink
                  to={customer ? '/account' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => mobileNavLinkClass(isActive)}
                >
                  {customer ? 'My Account' : 'Login'}
                </NavLink>

                <div className="mt-2 flex items-center gap-2 border-t border-gray-200 pt-3">
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-red-700/10 text-red-700 transition-colors hover:bg-red-700/20"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-red-700/10 text-red-700 transition-colors hover:bg-red-700/20"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href={YOUTUBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-red-700/10 text-red-700 transition-colors hover:bg-red-700/20"
                  >
                    <YouTubeIcon />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

function navLinkClass(isActive) {
  return `text-sm font-medium tracking-wide transition-colors ${
    isActive ? 'text-red-700' : 'text-gray-600 hover:text-red-700'
  }`;
}

function mobileNavLinkClass(isActive) {
  return `rounded-lg px-3 py-2.5 text-sm font-medium tracking-wide transition-colors ${
    isActive
      ? 'bg-red-50 text-red-700'
      : 'text-gray-700 hover:bg-gray-50 hover:text-red-700'
  }`;
}

/* ═══════════════════════════════════════════════
   CATEGORIES DROPDOWN — DESKTOP (unchanged)
   ═══════════════════════════════════════════════ */
function CategoriesDropdown({ topCategories, subcategoriesOf }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium tracking-wide text-gray-600 transition-colors hover:text-red-700"
      >
        Categories
        <ChevronIcon open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-1/2 top-full z-30 -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5">
              <div className="h-1 w-full bg-gradient-to-r from-red-600 via-yellow-600 to-red-600" />

              {topCategories.length === 0 ? (
                <p className="px-6 py-5 text-sm text-gray-600">No categories yet.</p>
              ) : (
                <div className="grid w-[820px] max-w-[90vw] grid-cols-4 divide-x divide-gray-100">
                  {topCategories.map((cat) => {
                    const subs = subcategoriesOf(cat.id);

                    return (
                      <div key={cat.id} className="min-w-[180px] px-5 py-5">
                        <Link
                          to={`/category/${cat.slug}`}
                          onClick={() => setOpen(false)}
                          className="group mb-3 flex items-center gap-2.5 border-b border-gray-100 pb-3 font-serif text-[15px] text-black hover:text-red-700"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-sm font-semibold text-red-700 transition-transform group-hover:scale-105">
                            {cat.name[0]}
                          </span>
                          <span className="truncate">{cat.name}</span>
                        </Link>

                        {subs.length > 0 ? (
                          <ul className="space-y-0.5">
                            {subs.slice(0, 4).map((sub) => (
                              <li key={sub.id}>
                                <Link
                                  to={`/category/${sub.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="block truncate rounded-md px-2 py-1.5 text-[13px] text-gray-600 transition-colors hover:bg-red-50/60 hover:text-red-700"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="px-2 text-[13px] text-gray-400">
                            Shop all {cat.name.toLowerCase()}
                          </p>
                        )}

                        <Link
                          to={`/category/${cat.slug}`}
                          onClick={() => setOpen(false)}
                          className="mt-3 inline-block text-[12px] font-medium text-red-700 hover:text-red-800"
                        >
                          Shop all {cat.name} &rarr;
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn('transition-transform duration-200', open && 'rotate-180')}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ═══════════════ Social Icons ═══════════════ */
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.65 12 21 12 21z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.5 2.5h2l2.6 12.5a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.5l1.5-7H6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default Header;