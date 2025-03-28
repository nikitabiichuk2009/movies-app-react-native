import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, Redirect, useRouter } from 'expo-router';
import { signOut } from '@/lib/appwrite';
import { useToast } from '@/context/toastContenxt';
import { useUserContext } from '@/context/userContext';
import Profile from '@/components/Profile';
import Loader from '@/components/Loader';

const ProfileScreen = () => {
  const { isLogged, user, loading } = useUserContext();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in');
      showToast('Success', 'Signed out successfully', 'success');
    } catch (error: any) {
      showToast('Error', error.message, 'error');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!isLogged || !user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Profile user={user}>
      <View className="px-6 mt-8 w-full flex flex-row gap-2">
        <Link href="/profile/edit" asChild>
          <TouchableOpacity className="bg-darkAccent px-6 py-3 rounded-lg flex-1">
            <Text className="text-white text-lg font-semibold text-center">Edit Profile</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity
          className="bg-red-500/90 px-6 py-3 rounded-lg flex-1"
          onPress={handleSignOut}
        >
          <Text className="text-white text-lg font-semibold text-center">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </Profile>
  );
};

export default ProfileScreen;
