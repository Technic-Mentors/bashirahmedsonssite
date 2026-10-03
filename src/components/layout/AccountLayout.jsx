import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { cn } from '../../utils/cn';

const LINKS = [
  { to: '/account', label: 'Overview', end: true, icon: GridIcon },
  { to: '/account/orders', label: 'My Orders', icon: OrdersIcon },
  { to: '/account/addresses', label: 'Addresses', icon: PinIcon },
  { to: '/account/wishlist', label: 'Wishlist', icon: HeartIcon },
  { to: '/account/profile', label: 'Profile', icon: UserIcon },
];

export default function AccountLayout() {
  const customer = useAuthStore((s) => s.customer);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    useCartStore.getState().resetToGuest();
    useWishlistStore.getState().reset();
    navigate('/');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-stone-100 bg-gradient-to-br from-gold-50 to-white px-5 py-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500 text-base font-semibold text-white">
                {customer?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif text-base text-charcoal">{customer?.name}</p>
                <p className="truncate text-xs text-charcoal-light">{customer?.email}</p>
              </div>
            </div>
            <nav className="flex gap-1 overflow-x-auto p-2.5 md:flex-col md:overflow-visible">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 whitespace-nowrap rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors',
                      isActive ? 'bg-gold-50 text-gold-700' : 'text-charcoal-light hover:bg-stone-100',
                    )
                  }
                >
                  <link.icon className="h-[17px] w-[17px] shrink-0" />
                  {link.label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex items-center gap-3 whitespace-nowrap rounded-md px-3.5 py-2.5 text-left text-sm font-medium text-charcoal-light transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogoutIcon className="h-[17px] w-[17px] shrink-0" />
                Log Out
              </button>
            </nav>
          </div>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function GridIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function OrdersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="4" y="4" width="16" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M8 11h8M8 15h5" />
    </svg>
  );
}
function PinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function HeartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 21s-7.5-4.6-10-9.5C.5 7.8 2.7 4.5 6.2 4.5c2 0 3.4 1 5.8 3.5 2.4-2.5 3.8-3.5 5.8-3.5 3.5 0 5.7 3.3 4.2 7C19.5 16.4 12 21 12 21Z" />
    </svg>
  );
}
function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
function LogoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
