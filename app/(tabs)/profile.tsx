import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { signOut } from '@/lib/appwrite';
import { useToast } from '@/context/toastContenxt';
import { tintColor } from '@/constants/constants';
import { icons } from '@/constants/icons';
import TopHeader from '@/components/TopHeader';
import { useUserContext } from '@/context/userContext';
import NoResults from '@/components/NoResults';
import EditProfileDialog from '@/components/EditProfileDialog';
import MovieCard from '@/components/MovieCard';

const ProfileScreen = () => {
  const { isLogged, user, loading, refreshUser } = useUserContext();
  const { showToast } = useToast();
  const [dialogVisible, setDialogVisible] = useState(false);
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
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  if (!isLogged || !user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <TopHeader />
      <FlatList
        ListHeaderComponent={() => (
          <>
            <EditProfileDialog
              user={user as UserData}
              refreshUser={refreshUser}
              visible={dialogVisible}
              onClose={() => setDialogVisible(false)}
            />
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
                <Link href={user?.portfolioUrl as any} asChild>
                  <TouchableOpacity className="mt-2">
                    <Text className="text-darkAccent text-base">Portfolio</Text>
                  </TouchableOpacity>
                </Link>
              )}
            </View>
            <View className="px-6 mt-8 w-full flex flex-row gap-2">
              <TouchableOpacity
                className="bg-darkAccent px-6 py-3 rounded-full flex-1"
                onPress={() => setDialogVisible(true)}
              >
                <Text className="text-white text-lg font-semibold text-center">Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500/90 px-6 py-3 rounded-full flex-1"
                onPress={handleSignOut}
              >
                <Text className="text-white text-lg font-semibold text-center">Sign Out</Text>
              </TouchableOpacity>
            </View>
            <View className="px-6 mt-10">
              <Text className="text-white text-xl font-bold mb-4">Saved Movies</Text>
            </View>
          </>
        )}
        data={user?.savedMovies || []}
        renderItem={({ item }) => <MovieCard movie={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={{ paddingBottom: 100 }}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
          paddingHorizontal: 24,
        }}
        ListEmptyComponent={() => (
          <NoResults
            title="No Favorites movies yet"
            description="You haven't favorited any movies yet. Start exploring and mark movies as favorites to see them here."
            buttonTitle="Browse Movies"
            href="/search"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
