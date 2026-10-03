import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function AdminLogin() {
  const { login, admin, status, fetchMe } = useAdminAuthStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'idle') fetchMe();
  }, [status, fetchMe]);

  useEffect(() => {
    if (status === 'ready' && admin) navigate('/admin', { replace: true });
  }, [status, admin, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (status !== 'ready' || admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal">
        <Spinner light />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4 font-sans">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Libas-e-Haram" className="h-14 w-14" />
          <h1 className="text-lg font-semibold text-charcoal">Store Admin</h1>
          <p className="text-sm text-charcoal-light">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email address"
            type="email"
            autoComplete="username"
            placeholder="admin@yourstore.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="********"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" variant="gold" size="lg" loading={submitting} className="mt-2 w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
