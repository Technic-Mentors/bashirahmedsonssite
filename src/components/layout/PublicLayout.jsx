import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout() {
  const status = useAuthStore((s) => s.status);
  const customer = useAuthStore((s) => s.customer);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const location = useLocation();
  const isAccountPortal = location.pathname.startsWith('/account');
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (status === 'idle') fetchMe();
  }, [status, fetchMe]);

  useEffect(() => {
    if (status === 'ready' && customer) {
      useCartStore.getState().loadServerCart().catch(() => {});
    }
  }, [status, customer]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderHeight(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
  <div style={{ '--header-height': `${headerHeight}px` }}>
      <Header ref={headerRef} />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAccountPortal && <Footer />}
    </div>
  );
}
