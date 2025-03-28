import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import FormField from '@/components/FormField';
import { useToast } from '@/context/toastContenxt';
import { validatePassword, validateUrl } from '@/utils';
import { updateCurrentUser } from '@/lib/appwrite';
import { useUserContext } from '@/context/userContext';
import TopHeader from '@/components/TopHeader';

const EditProfileScreen = () => {
  const { user, refreshUser } = useUserContext();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    username: user?.username || '',
    fullName: user?.fullName || '',
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
      fullName: '',
    },
    dirty: {
      username: false,
      oldPassword: false,
      newPassword: false,
      bio: false,
      portfolioUrl: false,
      contactOptions: false,
      fullName: false,
    },
  });

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

    if (
      form.dirty.username &&
      (form.username.trim().length < 3 || form.username.trim().length > 100)
    ) {
      errors.username = 'Username must be between 3 and 100 characters';
      isValid = false;
    }
    if (
      form.dirty.fullName &&
      (form.fullName.trim().length < 3 || form.fullName.trim().length > 200)
    ) {
      errors.fullName = 'Full name must be between 3 and 200 characters';
      isValid = false;
    }
    if (form.dirty.newPassword && !validatePassword(form.newPassword)) {
      errors.newPassword =
        'Password must be at least 8 characters with uppercase, lowercase, and number';
      isValid = false;
    }
    if (form.dirty.portfolioUrl && form.portfolioUrl && !validateUrl(form.portfolioUrl)) {
      errors.portfolioUrl = 'Enter a valid URL';
      isValid = false;
    }
    if (
      form.dirty.contactOptions &&
      (form.contactOptions.trim().length < 2 || form.contactOptions.trim().length > 300)
    ) {
      errors.contactOptions = 'Contact options must be between 2 and 300 characters';
      isValid = false;
    }
    if (form.dirty.bio && (form.bio.trim().length < 2 || form.bio.trim().length > 300)) {
      errors.bio = 'Bio must be between 2 and 300 characters';
      isValid = false;
    }

    setForm((prev) => ({ ...prev, errors }));
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
      fullName?: string;
    } = {};

    if (form.dirty.username) updates.username = form.username;
    if (form.dirty.newPassword && form.oldPassword) {
      updates.password = form.newPassword;
      updates.oldPassword = form.oldPassword;
    }
    if (form.dirty.bio) updates.bio = form.bio;
    if (form.dirty.portfolioUrl) updates.portfolioUrl = form.portfolioUrl;
    if (form.dirty.contactOptions) updates.contactOptions = form.contactOptions;
    if (form.dirty.fullName) updates.fullName = form.fullName;

    try {
      await updateCurrentUser(updates);
      await refreshUser();
      showToast('Success', 'Profile updated successfully', 'success');
      router.back();
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <TopHeader />
      <ScrollView className="flex-1 px-6">
        <Text className="text-white text-2xl font-bold mb-6">Edit Profile</Text>

        <View className="flex flex-col gap-y-4">
          <FormField
            title="Username"
            value={form.username}
            placeholder="Enter your username"
            handleChangeText={(text) => handleChange('username', text)}
            error={form.errors.username}
          />

          <FormField
            title="Full Name"
            value={form.fullName}
            placeholder="Enter your full name"
            handleChangeText={(text) => handleChange('fullName', text)}
            error={form.errors.fullName}
          />

          <FormField
            title="Bio"
            value={form.bio}
            placeholder="Tell us about yourself"
            handleChangeText={(text) => handleChange('bio', text)}
            error={form.errors.bio}
            multiline
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
            placeholder="How can others reach you?"
            handleChangeText={(text) => handleChange('contactOptions', text)}
            error={form.errors.contactOptions}
          />

          <View className="w-full h-[1px] bg-darkAccent my-4" />

          <View>
            <Text className="text-white text-lg font-bold mb-4">Change Password</Text>
            <FormField
              title="Current Password"
              value={form.oldPassword}
              placeholder="Enter current password"
              handleChangeText={(text) => handleChange('oldPassword', text)}
              error={form.errors.oldPassword}
            />

            <FormField
              title="New Password"
              value={form.newPassword}
              placeholder="Enter new password"
              handleChangeText={(text) => handleChange('newPassword', text)}
              error={form.errors.newPassword}
            />
          </View>
        </View>

        <View className="flex-row gap-x-4 mt-8 mb-10">
          <TouchableOpacity
            className="flex-1 bg-transparent border border-darkAccent py-4 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white text-center text-lg">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-4 rounded-lg bg-darkAccent`}
            onPress={handleSubmit}
            disabled={!Object.values(form.dirty).some((value) => value) || isSubmitting}
          >
            <Text className="text-white text-center text-lg">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
