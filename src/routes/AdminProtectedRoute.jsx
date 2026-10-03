import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import Spinner from '../components/ui/Spinner';

export default function AdminProtectedRoute() {
  const { admin, status, fetchMe } = useAdminAuthStore();

  useEffect(() => {
    if (status === 'idle') fetchMe();
  }, [status, fetchMe]);

  if (status !== 'ready') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal">
        <Spinner light />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
