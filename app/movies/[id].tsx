import { View, Image, ScrollView, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { fetchMovieDetails } from '@/lib/api';
import { Link, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { tintColor } from '@/constants/constants';
import { formatDate, formatMillions, hasUserSavedMovie } from '@/utils';
import NoResults from '@/components/NoResults';
import { icons } from '@/constants/icons';
import GoBackButton from '@/components/GoBaackButton';
import { toggleFavoriteMovie, viewMovie } from '@/lib/appwrite';
import { useToast } from '@/context/toastContenxt';
import { useUserContext } from '@/context/userContext';

const MovieInfo = ({ label, value }: { label: string; value?: string | string | null }) => {
  return (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-secondaryText text-lg font-normal">{label}</Text>
      <Text
        className={`text-secondaryText text-sm font-bold ${
          label === 'Genres' ? 'bg-secondary rounded-lg px-2 py-1' : ''
        }`}
      >
        {value || 'N/A'}
      </Text>
    </View>
  );
};

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { showToast } = useToast();
  const { user, isLogged, refreshUser } = useUserContext();
  const {
    data: movie,
    loading,
    error,
    fetchData,
  } = useFetch(fetchMovieDetails, { movieId: id as string });
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isSaving) {
        return;
      }
      const updateViewCount = async () => {
        if (movie && movie.id) {
          try {
            await viewMovie(
              String(movie.id),
              movie.title || 'Untitled',
              movie.poster_path || '',
              movie.vote_average || 0,
              movie.release_date || '',
              movie?.genres.map((genre: { id: number }) => genre.id) || [],
            );
          } catch (err: any) {
            showToast('Error', 'Something went wrong while updating the view count', 'error');
          }
        }
      };
      updateViewCount();
    }, [movie, isSaving]),
  );

  const isSaved = hasUserSavedMovie(user as any, id as string);
  const handleToggleSave = async () => {
    if (!isLogged) {
      showToast('Error', 'Please login to save movies', 'error');
      return;
    }

    try {
      setIsSaving(true);
      await toggleFavoriteMovie(String(movie.id));
      refreshUser();
      showToast(
        'Success',
        isSaved ? 'Movie removed from favorites' : 'Movie saved to favorites',
        'success',
      );
    } catch (error: any) {
      showToast('Error', 'Failed to update favorites', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      {(loading || !movie) && !error && <ActivityIndicator size="large" color={tintColor} />}
      {error && (
        <NoResults
          title="Error"
          description="Failed to fetch movie details"
          buttonTitle="Retry"
          onPress={() => fetchData()}
        />
      )}
      {movie && (
        <>
          <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <View className="relative">
              <Image
                source={{
                  uri: movie?.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://placehold.co/600x400/1a1a1a/ffffff.png',
                }}
                className="w-full h-[550px] rounded-lg"
                resizeMode="stretch"
              />
              {movie.videoUrl && (
                <Link href={movie.videoUrl} asChild>
                  <TouchableOpacity className="absolute bottom-4 bg-white right-4 rounded-lg p-3">
                    <Image source={icons.play} className="w-5 h-5" tintColor={tintColor} />
                  </TouchableOpacity>
                </Link>
              )}
            </View>
            <View className="flex-col items-start justify-start mt-5 px-5">
              <View className="flex-row items-center justify-between w-full">
                <Text className="text-white text-2xl font-bold">{movie?.title}</Text>
                {isLogged && (
                  <TouchableOpacity onPress={handleToggleSave} disabled={isSaving}>
                    <Image
                      source={isSaved ? icons.saveFilled : icons.save}
                      className="size-8 disabled:opacity-50"
                      tintColor={tintColor}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View className="flex-row items-center justify-start gap-x-2">
                <Text className="text-secondaryText text-sm font-semibold">
                  {formatDate(movie?.release_date as string)}
                </Text>
                <Text className="text-secondaryText text-base font-semibold">
                  {movie?.runtime} min
                </Text>
              </View>
              <View className="flex-row items-center bg-ratingBox px-2 py-1 rounded-md gap-x-1 mt-2">
                <Image source={icons.star} className="size-5" />
                <Text className="text-secondaryText text-base font-semibold">
                  {movie?.vote_average.toFixed(1)} / 10
                </Text>
                <Text className="text-secondaryText text-base font-semibold ml-2">
                  ({movie?.vote_count} votes)
                </Text>
              </View>
              <MovieInfo label="Tagline" value={movie?.tagline} />
              <MovieInfo label="Status" value={movie?.status} />
              <MovieInfo label="Overview" value={movie?.overview} />
              <MovieInfo
                label="Genres"
                value={movie?.genres.map((genre: { name: string }) => genre.name).join(' - ')}
              />
              <View className="flex flex-row justify-between w-1/2">
                <MovieInfo label="Budget" value={formatMillions(movie?.budget)} />
                <MovieInfo label="Revenue" value={formatMillions(movie?.revenue)} />
              </View>
              <MovieInfo
                label="Production Companies"
                value={movie?.production_companies
                  .map((company: { name: string }) => company.name)
                  .join(' - ')}
              />
            </View>
          </ScrollView>
          <GoBackButton />
        </>
      )}
    </View>
  );
};

export default MovieDetails;
