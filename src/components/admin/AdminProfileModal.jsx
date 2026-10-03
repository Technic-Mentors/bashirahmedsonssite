import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ImageUploader from './form/ImageUploader';
import { assetUrl } from '../../utils/media';

const emptyPasswordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function AdminProfileModal({ open, onClose }) {
  const admin = useAdminAuthStore((s) => s.admin);
  const updateProfile = useAdminAuthStore((s) => s.updateProfile);
  const uploadAvatar = useAdminAuthStore((s) => s.uploadAvatar);
  const changePassword = useAdminAuthStore((s) => s.changePassword);
  const logout = useAdminAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (admin) setProfileForm({ name: admin.name || '', email: admin.email || '' });
  }, [admin]);

  async function handleAvatarChange(file) {
    setUploadingAvatar(true);
    try {
      await uploadAvatar(file);
      toast.success('Avatar updated.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();

    const name = profileForm.name.trim();
    if (name.length < 2 || name.length > 25) {
      toast.error('Name must be between 2 and 25 characters.');
      return;
    }
    if (!/^[A-Za-z ]+$/.test(name)) {
      toast.error('Name can only contain letters and spaces.');
      return;
    }

    setSavingProfile(true);
    try {
      await updateProfile(profileForm.name, profileForm.email);
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password updated.');
      setPasswordForm(emptyPasswordForm);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleLogout() {
    await logout();
    onClose();
    navigate('/admin/login');
  }

  return (
    <Modal open={open} onClose={onClose} title="My Profile" className="max-w-lg">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          {admin?.avatar ? (
            <img src={assetUrl(admin.avatar)} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-xl font-semibold text-gold-700">
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          )}
          <ImageUploader label={uploadingAvatar ? 'Uploading...' : 'Change photo'} onChange={handleAvatarChange} />
        </div>

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 border-t border-stone-100 pt-5">
          <h4 className="text-sm font-semibold text-charcoal">Profile Details</h4>
          <Input
            label="Name"
            value={profileForm.name}
            onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
            maxLength={25}
            required
          />
          <Input
            label="Email"
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <div className="flex justify-end">
            <Button type="submit" variant="gold" size="sm" loading={savingProfile}>
              Save Profile
            </Button>
          </div>
        </form>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 border-t border-stone-100 pt-5">
          <h4 className="text-sm font-semibold text-charcoal">Change Password</h4>
          <Input
            label="Current Password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            required
          />
          <div className="flex justify-end">
            <Button type="submit" variant="gold" size="sm" loading={savingPassword}>
              Update Password
            </Button>
          </div>
        </form>

        <div className="flex justify-between border-t border-stone-100 pt-5">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    </Modal>
  );
}
