import FormField from './FormField';
import { useToast } from '@/context/toastContenxt';
import { useEffect, useState } from 'react';
import { validatePassword, validateUrl } from '@/utils';
import { updateCurrentUser } from '@/lib/appwrite';
import CustomDialog from './CustomDialog';

const EditProfileDialog = ({
  user,
  refreshUser,
  visible,
  onClose,
}: {
  user: UserData;
  refreshUser: () => Promise<void>;
  visible: boolean;
  onClose: () => void;
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || '',
    oldPassword: '',
    newPassword: '',
    bio: user?.bio || '',
    portfolioUrl: user?.portfolioUrl || '',
    contactOptions: user?.contactOptions || '',
    errors: {
      username: '',
      oldPassword: '',
      newPassword: '',
      bio: '',
      portfolioUrl: '',
      contactOptions: '',
    },
    dirty: {
      username: false,
      oldPassword: false,
      newPassword: false,
      bio: false,
      portfolioUrl: false,
      contactOptions: false,
    },
  });

  useEffect(() => {
    if (visible) {
      setForm({
        username: user?.username || '',
        oldPassword: '',
        newPassword: '',
        bio: user?.bio || '',
        portfolioUrl: user?.portfolioUrl || '',
        contactOptions: user?.contactOptions || '',
        errors: {
          username: '',
          oldPassword: '',
          newPassword: '',
          bio: '',
          portfolioUrl: '',
          contactOptions: '',
        },
        dirty: {
          username: false,
          oldPassword: false,
          newPassword: false,
          bio: false,
          portfolioUrl: false,
          contactOptions: false,
        },
      });
    }
  }, [visible]);
  const handleChange = (field: keyof typeof form, value: string) => {
    if (field === 'errors' || field === 'dirty') return;
    setForm((prev) => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: '' },
      dirty: {
        ...prev.dirty,
        [field]: value !== (user?.[field as keyof typeof user] || ''),
      },
    }));
  };

  const validate = () => {
    const errors = { ...form.errors };
    let isValid = true;
    if (form.dirty.username && form.username.trim().length < 2) {
      errors.username = 'Username must be at least 2 characters';
      isValid = false;
    }
    if (form.dirty.newPassword && !validatePassword(form.newPassword)) {
      errors.newPassword =
        'New password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number';
      isValid = false;
    }
    if (form.dirty.portfolioUrl && form.portfolioUrl && !validateUrl(form.portfolioUrl)) {
      errors.portfolioUrl = 'Enter a valid URL';
      isValid = false;
    }
    if (
      form.dirty.contactOptions &&
      form.contactOptions.trim().length < 2 &&
      form.contactOptions.trim().length > 300
    ) {
      errors.contactOptions = 'Contact options must be at least 2 characters and less than 300';
      isValid = false;
    }
    if (form.dirty.bio && form.bio.trim().length < 2 && form.bio.trim().length > 300) {
      errors.bio = 'Bio must be at least 2 characters and less than 300';
      isValid = false;
    }
    setForm((prev) => ({
      ...prev,
      errors,
    }));
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    const updates: {
      username?: string;
      password?: string;
      oldPassword?: string;
      bio?: string;
      portfolioUrl?: string;
      contactOptions?: string;
    } = {};
    if (form.dirty.username) updates.username = form.username;
    if (form.dirty.newPassword && form.oldPassword) {
      updates.password = form.newPassword;
      updates.oldPassword = form.oldPassword;
    }
    if (form.dirty.bio) updates.bio = form.bio;
    if (form.dirty.portfolioUrl) updates.portfolioUrl = form.portfolioUrl;
    if (form.dirty.contactOptions) updates.contactOptions = form.contactOptions;
    try {
      const updatedUser = await updateCurrentUser(updates);
      refreshUser();
      showToast('Success', 'Profile updated', 'success');
      onClose();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <CustomDialog
      visible={visible}
      title="Edit Profile"
      description="Update your account details"
      onClose={onClose}
      onSubmit={handleSubmit}
      isButtonDisabled={!Object.values(form.dirty).some((value) => value) || isSubmitting}
      isSubmittingForm={isSubmitting}
    >
      <FormField
        title="Username"
        value={form.username}
        placeholder="Enter your username"
        handleChangeText={(text) => handleChange('username', text)}
        error={form.errors.username}
      />
      <FormField
        title="Old Password"
        value={form.oldPassword}
        placeholder="Enter current password"
        secureTextEntry
        handleChangeText={(text) => handleChange('oldPassword', text)}
        error={form.errors.oldPassword}
      />
      <FormField
        title="New Password"
        value={form.newPassword}
        placeholder="Enter new password"
        secureTextEntry
        handleChangeText={(text) => handleChange('newPassword', text)}
        error={form.errors.newPassword}
      />
      <FormField
        title="Bio"
        value={form.bio}
        placeholder="Short bio"
        handleChangeText={(text) => handleChange('bio', text)}
        error={form.errors.bio}
      />
      <FormField
        title="Portfolio URL"
        value={form.portfolioUrl}
        placeholder="https://example.com"
        handleChangeText={(text) => handleChange('portfolioUrl', text)}
        error={form.errors.portfolioUrl}
      />
      <FormField
        title="Contact Options"
        value={form.contactOptions}
        placeholder="Enter your contact options"
        handleChangeText={(text) => handleChange('contactOptions', text)}
        error={form.errors.contactOptions}
      />
    </CustomDialog>
  );
};

export default EditProfileDialog;
