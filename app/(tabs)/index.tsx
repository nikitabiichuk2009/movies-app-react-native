import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { images } from '@/constants/images';
import TopHeader from '@/components/TopHeader';
import { getPopularMovies } from '@/lib/appwrite';
import MovieCard from '@/components/MovieCard';
import { useToast } from '@/hooks/toastContenxt';
import { tintColor } from '@/constants/constants';
import NoResults from '@/components/NoResults';

const WelcomeScreen = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useFocusEffect(
    useCallback(() => {
      const fetchPopularMovies = async () => {
        try {
          const movies = await getPopularMovies();
          setPopularMovies(movies as any);
        } catch (error: any) {
          showToast('Error', 'Failed to fetch popular movies', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchPopularMovies();
    }, []),
  );

  return (
    <View className="flex-1 bg-primary mb-50">
      <TopHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      >
        <View className="items-center px-6 pt-10">
          <Image
            source={images.heroSectionImage}
            style={{ width: 250, height: 250, resizeMode: 'contain' }}
          />

          <Text className="text-white text-5xl font-bold text-center mt-8">CineScope</Text>

          <Text className="text-secondaryText text-lg text-center mt-2">
            Discover top-rated movies, explore by genre, and find your next favorite film.
          </Text>

          <Link href="/search" asChild>
            <TouchableOpacity className="bg-darkAccent px-8 py-4 rounded-full mt-10">
              <Text className="text-white text-xl font-semibold">Explore now</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View className="mt-16 px-6">
          {loading ? (
            <ActivityIndicator size="large" color={tintColor} />
          ) : popularMovies.length > 0 ? (
            <View className="mt-10">
              <Text className="text-xl text-white font-bold mb-3">Trending Movies</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4 mt-3"
                data={popularMovies}
                contentContainerStyle={{
                  gap: 26,
                }}
                renderItem={({ item, index }) => (
                  <MovieCard containerWidth={'w-32'} movie={item} number={index + 1} />
                )}
                keyExtractor={(item: any) => item.id.toString()}
                ItemSeparatorComponent={() => <View className="w-4" />}
              />
            </View>
          ) : (
            <NoResults
              title="No popular movies found"
              description="Be the first to discover and watch movies! Your views help create our trending list and guide other users to great content."
              buttonTitle="Explore movies"
              isError={false}
              href="/search"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default WelcomeScreen;
