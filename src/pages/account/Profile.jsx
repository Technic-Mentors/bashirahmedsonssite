import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import Button from '../../components/ui/Button';

export default function Profile() {
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
    <div className="max-w-md space-y-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-wider text-stone-400">Name</p>
        <p className="text-charcoal">{customer?.name}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-stone-400">Email</p>
        <p className="text-charcoal">{customer?.email}</p>
        {!customer?.email_verified_at && (
          <p className="mt-1 text-xs text-amber-600">Email not verified. Check your inbox for a verification link.</p>
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-stone-400">Phone</p>
        <p className="text-charcoal">{customer?.phone}</p>
      </div>
      <Link to="/forgot-password" className="inline-block text-sm font-medium text-gold-600 hover:text-gold-700">
        Change password
      </Link>
      <div className="border-t border-stone-100 pt-4">
        <Button variant="outline" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
