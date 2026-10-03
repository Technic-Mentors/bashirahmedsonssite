import { Link, useLocation } from 'react-router-dom';

const LABELS = {
  admin: 'Dashboard',
  orders: 'Orders',
  products: 'Products',
  categories: 'Categories',
  inventory: 'Inventory',
  customers: 'Customers',
  coupons: 'Coupons',
  reviews: 'Reviews',
  banners: 'Banners',
  blog: 'Blog',
  shipping: 'Shipping',
  settings: 'Settings',
  'contact-messages': 'Contact Messages',
  new: 'New',
  edit: 'Edit',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean); // e.g. ['admin','products','12','edit']

  const crumbs = segments.map((segment, idx) => {
    const path = '/' + segments.slice(0, idx + 1).join('/');
    const isId = /^\d+$/.test(segment);
    const label = isId ? 'Details' : LABELS[segment] || segment;
    return { path, label, isLast: idx === segments.length - 1 };
  });

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-charcoal-light">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.path} className="flex items-center gap-1.5">
          {idx > 0 && <span className="text-stone-300">/</span>}
          {crumb.isLast ? (
            <span className="font-medium text-charcoal">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-gold-600">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
