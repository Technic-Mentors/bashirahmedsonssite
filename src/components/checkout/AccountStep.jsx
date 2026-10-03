import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name is too short')
      .max(25, 'Name must be 25 characters or fewer')
      .regex(/^[A-Za-z ]+$/, 'Name can only contain letters and spaces'),
    email: z.string().email('Enter a valid email'),
    phone: z
      .string()
      .trim()
      .regex(/^\d{11}$/, 'Enter an 11-digit phone number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export default function AccountStep({ onAuthenticated }) {
  const [tab, setTab] = useState('register');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const registerCustomer = useAuthStore((s) => s.register);

  const loginForm = useForm({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm({ resolver: zodResolver(registerSchema) });

  async function afterAuthSuccess(successMessage) {
    try {
      await useCartStore.getState().mergeGuestCartIntoServer();
    } catch {
      // Ignore cart merge hiccups; checkout should not be blocked by a guest-cart sync issue.
    }
    onAuthenticated?.();
    toast.success(successMessage);
  }

  async function onLogin(values) {
    setLoading(true);
    try {
      await login(values.email, values.password);
      await afterAuthSuccess('Logged in successfully.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(values) {
    setLoading(true);
    try {
      await registerCustomer({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      await afterAuthSuccess('Account created successfully.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <motion.span
          initial={{ scale: 0.85, opacity: 0.6 }}
          animate={{ scale: [0.85, 1.05, 0.85], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600"
        >
          <LockIcon />
        </motion.span>
        <h2 className="font-medium text-charcoal">Your Account</h2>
      </div>
      <p className="mb-4 text-sm text-charcoal-light">Please log in or create an account so you can checkout.</p>

      <div className="mb-5 inline-flex rounded-full border border-stone-200 bg-stone-50 p-1">
        <button
          type="button"
          onClick={() => setTab('register')}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            tab === 'register' ? 'bg-white text-gold-700 shadow-sm' : 'text-charcoal-light hover:text-charcoal',
          )}
        >
          Create an account
        </button>
        <button
          type="button"
          onClick={() => setTab('login')}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            tab === 'login' ? 'bg-white text-gold-700 shadow-sm' : 'text-charcoal-light hover:text-charcoal',
          )}
        >
          I have an account
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {tab === 'register' ? (
          <motion.form
            key="register"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            onSubmit={registerForm.handleSubmit(onRegister)}
            className="space-y-3"
          >
            <Input
              label="Full Name"
              maxLength={25}
              {...registerForm.register('name')}
              error={registerForm.formState.errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              {...registerForm.register('email')}
              error={registerForm.formState.errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              {...registerForm.register('password')}
              error={registerForm.formState.errors.password?.message}
            />
            <Input
              label="Confirm Password"
              type="password"
              {...registerForm.register('confirmPassword')}
              error={registerForm.formState.errors.confirmPassword?.message}
            />
            <Input
              label="Phone"
              placeholder="03XXXXXXXXX"
              maxLength={11}
              {...registerForm.register('phone')}
              error={registerForm.formState.errors.phone?.message}
            />
            <Button type="submit" variant="gold" loading={loading} className="w-full">
              Create Account &amp; Continue
            </Button>
          </motion.form>
        ) : (
          <motion.form
            key="login"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            onSubmit={loginForm.handleSubmit(onLogin)}
            className="space-y-3"
          >
            <Input
              label="Email"
              type="email"
              {...loginForm.register('email')}
              error={loginForm.formState.errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              {...loginForm.register('password')}
              error={loginForm.formState.errors.password?.message}
            />
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-gold-600 hover:text-gold-700">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" variant="gold" loading={loading} className="w-full">
              Log In &amp; Continue
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
