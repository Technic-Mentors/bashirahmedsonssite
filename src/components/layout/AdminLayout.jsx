import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';
import { cn } from '../../utils/cn';
import { assetUrl } from '../../utils/media';
import NotificationBell from '../admin/dashboard/NotificationBell';
import AdminProfileModal from '../admin/AdminProfileModal';
import Breadcrumbs from './Breadcrumbs';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true, icon: GridIcon },
  { to: '/admin/reports', label: 'Reports', icon: ChartIcon },
  { to: '/admin/orders', label: 'Orders', icon: OrdersIcon },
  { to: '/admin/products', label: 'Products', icon: BoxIcon },
  { to: '/admin/categories', label: 'Categories', icon: TagIcon },
  { to: '/admin/inventory', label: 'Inventory', icon: LayersIcon },
  { to: '/admin/customers', label: 'Customers', icon: UsersIcon },
  { to: '/admin/coupons', label: 'Coupons', icon: PercentIcon },
  { to: '/admin/reviews', label: 'Reviews', icon: StarIcon },
  { to: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { to: '/admin/blog', label: 'Blog', icon: FileIcon },
  { to: '/admin/shipping', label: 'Shipping', icon: TruckIcon },
  { to: '/admin/contact-messages', label: 'Contact Messages', icon: MailIcon },
  { to: '/admin/settings', label: 'Settings', icon: GearIcon },
];

export default function AdminLayout() {
  const admin = useAdminAuthStore((s) => s.admin);

  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('admin_sidebar_collapsed') === 'true');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('admin_sidebar_collapsed', String(collapsed));
  }, [collapsed]);

  const sidebarWidth = collapsed ? 'md:w-16' : 'md:w-60';
  const contentPad = collapsed ? 'md:pl-16' : 'md:pl-60';

  function renderSidebarContent(isMobile) {
    const isCollapsed = collapsed && !isMobile;
    return (
      <>
        <div className={cn('flex items-center gap-2 border-b border-stone-200 px-4 py-4', isCollapsed ? 'justify-center' : 'justify-between')}>
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <img src="/logo.png" alt="Libas-e-Haram" className="h-9 w-9 shrink-0" />
              <span className="truncate font-serif text-base font-semibold text-charcoal">Admin Panel</span>
            </div>
          )}
          {!isMobile && (
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="hidden shrink-0 rounded-md p-1.5 text-charcoal-light hover:bg-stone-100 hover:text-gold-600 md:block"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <HamburgerIcon />
            </button>
          )}
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-2.5 py-4">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              title={isCollapsed ? link.label : undefined}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isCollapsed && 'justify-center px-0',
                  isActive ? 'bg-gold-50 text-gold-700' : 'text-charcoal-light hover:bg-stone-100',
                )
              }
            >
              <link.icon className="h-[18px] w-[18px] shrink-0" />
              {!isCollapsed && link.label}
            </NavLink>
          ))}
        </nav>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-stone-200 bg-white transition-all duration-200 md:flex',
          sidebarWidth,
        )}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile sidebar (slide-in drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-charcoal/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col bg-white shadow-xl">{renderSidebarContent(true)}</aside>
        </div>
      )}

      <div className={cn('flex min-h-screen flex-col transition-all duration-200', contentPad)}>
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="text-charcoal-light hover:text-gold-600 md:hidden"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-5">
            <NotificationBell />
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-stone-100"
            >
              {admin?.avatar ? (
                <img src={assetUrl(admin.avatar)} alt="" className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-100 text-xs font-semibold text-gold-700">
                  {admin?.name?.[0]?.toUpperCase() || 'A'}
                </div>
              )}
              <span className="hidden text-sm font-medium text-charcoal sm:inline">{admin?.name}</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      <AdminProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}
function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
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
function ChartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 3v18h18" /><path d="M7 16v-4M12 16V8M17 16v-7" />
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
function BoxIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
      <path d="M20 16.5V7.5a2 2 0 0 0-1-1.7l-6-3.5a2 2 0 0 0-2 0l-6 3.5a2 2 0 0 0-1 1.7v9a2 2 0 0 0 1 1.7l6 3.5a2 2 0 0 0 2 0l6-3.5a2 2 0 0 0 1-1.7Z" />
    </svg>
  );
}
function TagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 2H3v9l10.3 10.3a1 1 0 0 0 1.4 0l7.6-7.6a1 1 0 0 0 0-1.4L12 2Z" />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
function LayersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </svg>
  );
}
function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="9" cy="7.5" r="3.5" /><path d="M2.5 21c0-4 3-6.5 6.5-6.5s6.5 2.5 6.5 6.5" />
      <path d="M16.5 4.5a3.5 3.5 0 0 1 0 6.8M21.5 21c0-3.2-2-5.5-4.5-6.3" />
    </svg>
  );
}
function PercentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M19 5 5 19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
function StarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="m12 2 3.1 6.6 7.2.9-5.3 5 1.5 7.2-6.5-3.6-6.5 3.6 1.5-7.2-5.3-5 7.2-.9L12 2Z" />
    </svg>
  );
}
function ImageIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}
function FileIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </svg>
  );
}
function TruckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M2 6h11v11H2zM13 10h4l4 4v3h-8z" /><circle cx="6.5" cy="19" r="1.8" /><circle cx="16.5" cy="19" r="1.8" />
    </svg>
  );
}
function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" />
    </svg>
  );
}
function GearIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.5a7.8 7.8 0 0 0 0-3l1.9-1.3-2-3.4-2.2.7a7.6 7.6 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.5a7.6 7.6 0 0 0-2.6 1.5l-2.2-.7-2 3.4L4.6 10.5a7.8 7.8 0 0 0 0 3L2.7 14.8l2 3.4 2.2-.7c.75.66 1.63 1.17 2.6 1.5l.5 2.5h4l.5-2.5a7.6 7.6 0 0 0 2.6-1.5l2.2.7 2-3.4-1.9-1.3Z" />
    </svg>
  );
}
