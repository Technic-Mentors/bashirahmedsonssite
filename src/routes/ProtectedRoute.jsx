import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import Spinner from '../components/ui/Spinner';

export default function ProtectedRoute() {
  const { customer, status, fetchMe } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (status === 'idle') fetchMe();
  }, [status, fetchMe]);

  if (status !== 'ready') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!customer) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
