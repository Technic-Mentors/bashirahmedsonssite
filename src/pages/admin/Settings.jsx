import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getSettings, updateSettings } from '../../api/admin/settings.api';
import { useAsync } from '../../hooks/useAsync';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import Spinner from '../../components/ui/Spinner';

const emptyForm = {
  store_name: '',
  store_email: '',
  store_phone: '',
  store_address: '',
  return_window_days: '',
  return_policy_text: '',
};

export default function Settings() {
  const { data, loading, error, refetch } = useAsync(() => getSettings(), []);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        store_name: data.store_name ?? '',
        store_email: data.store_email ?? '',
        store_phone: data.store_phone ?? '',
        store_address: data.store_address ?? '',
        return_window_days: data.return_window_days ?? '',
        return_policy_text: data.return_policy_text ?? '',
      });
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Could not load settings." onRetry={refetch} />;
  }

  function field(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, String(value)]));
      await updateSettings(payload);
      toast.success('Settings updated.');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-charcoal">Store Settings</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-charcoal">Store Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Store Name" maxLength={150} value={form.store_name} onChange={field('store_name')} />
            <Input label="Store Email" type="email" value={form.store_email} onChange={field('store_email')} />
            <Input label="Store Phone" maxLength={20} value={form.store_phone} onChange={field('store_phone')} />
            <Input label="Store Address" maxLength={255} value={form.store_address} onChange={field('store_address')} />
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-charcoal">Returns</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Return Window (days)"
              type="number"
              min="0"
              step="1"
              value={form.return_window_days}
              onChange={field('return_window_days')}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Return Policy Text"
              rows={5}
              value={form.return_policy_text}
              onChange={field('return_policy_text')}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="gold" loading={submitting}>
            Save Settings
          </Button>
        </div>
      </form>

      <p className="text-sm text-charcoal-light">
        Looking to change your admin password or profile photo? Click your name in the top bar.
      </p>
    </div>
  );
}
