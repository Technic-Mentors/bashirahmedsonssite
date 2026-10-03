import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getShipping,
  updateShipping,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
} from '../../api/admin/shipping.api';
import { useAsync } from '../../hooks/useAsync';
import { useDisclosure } from '../../hooks/useDisclosure';
import DataTable from '../../components/admin/table/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorState from '../../components/ui/ErrorState';
import Spinner from '../../components/ui/Spinner';

const emptyZoneForm = { city: '', charge: '', isActive: true };

export default function Shipping() {
  const { data, loading, error, refetch } = useAsync(() => getShipping(), []);
  const [settingsForm, setSettingsForm] = useState({ defaultShippingRate: '', freeShippingThreshold: '' });
  const [savingSettings, setSavingSettings] = useState(false);

  const { isOpen, open, close } = useDisclosure(false);
  const [editingZone, setEditingZone] = useState(null);
  const [zoneForm, setZoneForm] = useState(emptyZoneForm);
  const [submittingZone, setSubmittingZone] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (data) {
      setSettingsForm({
        defaultShippingRate: String(data.defaultShippingRate ?? data.default_shipping_rate ?? ''),
        freeShippingThreshold: String(data.freeShippingThreshold ?? data.free_shipping_threshold ?? ''),
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
    return <ErrorState message="Could not load shipping settings." onRetry={refetch} />;
  }

  const zones = data?.zones || [];

  async function handleSaveSettings(e) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateShipping({
        defaultShippingRate: Number(settingsForm.defaultShippingRate),
        freeShippingThreshold: Number(settingsForm.freeShippingThreshold),
      });
      toast.success('Shipping settings updated.');
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSavingSettings(false);
    }
  }

  function openCreateZone() {
    setEditingZone(null);
    setZoneForm(emptyZoneForm);
    open();
  }

  function openEditZone(zone) {
    setEditingZone(zone);
    setZoneForm({
      city: zone.city || '',
      charge: String(zone.charge ?? ''),
      isActive: Boolean(zone.is_active ?? zone.isActive ?? true),
    });
    open();
  }

  async function handleZoneSubmit(e) {
    e.preventDefault();
    setSubmittingZone(true);
    try {
      const payload = {
        city: zoneForm.city,
        charge: Number(zoneForm.charge),
        isActive: Boolean(zoneForm.isActive),
      };
      if (editingZone) {
        await updateShippingZone(editingZone.id, payload);
        toast.success('Zone updated.');
      } else {
        await createShippingZone(payload);
        toast.success('Zone created.');
      }
      close();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSubmittingZone(false);
    }
  }

  async function handleDeleteZone() {
    setDeleting(true);
    try {
      await deleteShippingZone(deleteTarget.id);
      toast.success('Zone deleted.');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-charcoal">Shipping</h1>

      <form onSubmit={handleSaveSettings} className="rounded-lg border border-stone-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-charcoal">General Settings</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Default Shipping Rate (Rs.)"
            type="number"
            step="0.01"
            min="0"
            required
            value={settingsForm.defaultShippingRate}
            onChange={(e) => setSettingsForm((f) => ({ ...f, defaultShippingRate: e.target.value }))}
          />
          <Input
            label="Free Shipping Threshold (Rs.)"
            type="number"
            step="0.01"
            min="0"
            required
            value={settingsForm.freeShippingThreshold}
            onChange={(e) => setSettingsForm((f) => ({ ...f, freeShippingThreshold: e.target.value }))}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" variant="gold" loading={savingSettings}>
            Save Settings
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-charcoal">Shipping Zones</h3>
        <Button variant="gold" size="sm" onClick={openCreateZone}>
          Add Zone
        </Button>
      </div>

      <DataTable
        rows={zones}
        emptyMessage="No shipping zones configured."
        columns={[
          { key: 'city', label: 'City' },
          { key: 'charge', label: 'Charge', render: (row) => `Rs. ${row.charge}` },
          {
            key: 'is_active',
            label: 'Status',
            render: (row) => <Badge status={(row.is_active ?? row.isActive) ? 'active' : 'inactive'} />,
          },
          {
            key: 'actions',
            label: '',
            render: (row) => (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditZone(row)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => setDeleteTarget(row)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Modal open={isOpen} onClose={close} title={editingZone ? 'Edit Zone' : 'Add Zone'}>
        <form onSubmit={handleZoneSubmit} className="flex flex-col gap-4">
          <Input
            label="City"
            value={zoneForm.city}
            onChange={(e) => setZoneForm((f) => ({ ...f, city: e.target.value }))}
            minLength={2}
            maxLength={100}
            required
          />
          <Input
            label="Charge (Rs.)"
            type="number"
            step="0.01"
            min="0"
            value={zoneForm.charge}
            onChange={(e) => setZoneForm((f) => ({ ...f, charge: e.target.value }))}
            required
          />
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input
              type="checkbox"
              checked={zoneForm.isActive}
              onChange={(e) => setZoneForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="h-4 w-4 rounded border-stone-300"
            />
            Active
          </label>
          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={close} disabled={submittingZone}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={submittingZone}>
              {editingZone ? 'Save Changes' : 'Create Zone'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteZone}
        title="Delete zone?"
        description={`This will permanently delete the "${deleteTarget?.city}" shipping zone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
