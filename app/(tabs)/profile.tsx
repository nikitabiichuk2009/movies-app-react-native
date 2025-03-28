import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { getCurrentUser, signOut } from '@/lib/appwrite';
import { useToast } from '@/hooks/toastContenxt';
import { tintColor } from '@/constants/constants';
import { icons } from '@/constants/icons';
import TopHeader from '@/components/TopHeader';

export default function ProfileScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.replace('/sign-in');
        return;
      }
      setUser(currentUser as unknown as UserData);
    } catch (error: any) {
      showToast('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      router.replace('/sign-in');
      showToast('Success', 'Signed out successfully', 'success');
    } catch (error: any) {
      showToast('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <TopHeader />
      <View className="items-center pt-10">
        <Image
          source={{ uri: user?.avatarUrl }}
          className="w-32 h-32 rounded-full"
          defaultSource={icons.person}
        />

        <Text className="text-white text-2xl font-bold mt-4">{user?.username}</Text>
        <Text className="text-secondaryText text-lg">{user?.email}</Text>

        {user?.bio && (
          <Text className="text-white text-base text-center mx-4 mt-4">{user.bio}</Text>
        )}

        {user?.portfolioUrl && (
          <TouchableOpacity className="mt-2">
            <Text className="text-darkAccent text-base">Portfolio</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="px-6 mt-8 space-y-4">
        <TouchableOpacity
          className="bg-secondary px-6 py-3 rounded-full"
          onPress={() => router.push('/')}
        >
          <Text className="text-white text-lg font-semibold text-center">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-red-500/90 px-6 py-3 rounded-full" onPress={handleSignOut}>
          <Text className="text-white text-lg font-semibold text-center">Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-6 mt-8">
        <Text className="text-white text-xl font-bold mb-4">Saved Movies</Text>
        {user?.savedMovies?.length === 0 ? (
          <Text className="text-secondaryText text-base text-center mt-4">No saved movies yet</Text>
        ) : (
          // Add your saved movies list component here
          <Text className="text-secondaryText text-base text-center mt-4">
            Saved movies will appear here
          </Text>
        )}
      </View>
    </View>
  );
}
