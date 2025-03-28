import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { icons } from '@/constants/icons';
import TopHeader from '@/components/TopHeader';
import NoResults from '@/components/NoResults';
import MovieCard from '@/components/MovieCard';

interface ProfileProps {
  user: UserData;
  children?: React.ReactNode;
}

const Profile = ({ user, children }: ProfileProps) => {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <TopHeader />
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="items-center pt-10">
              <Image
                source={{ uri: user?.avatarUrl }}
                className="w-32 h-32 rounded-full"
                defaultSource={icons.person}
              />
              <View className="flex flex-row gap-2">
                <Text className="text-white text-2xl font-bold mt-4">{user?.fullName} |</Text>
                <Text className="text-white text-2xl font-bold mt-4">@{user?.username}</Text>
              </View>
              <Text className="text-secondaryText text-lg">{user?.email}</Text>
              {user?.contactOptions && (
                <Text className="text-white text-base text-center mx-4 mt-4">
                  {user.contactOptions}
                </Text>
              )}
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

            {children && children}

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

export default Profile;
