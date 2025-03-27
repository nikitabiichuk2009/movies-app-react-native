import { View, Image, ScrollView, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import useFetch from '@/services/hooks/useFetch';
import { fetchMovieDetails } from '@/services/api';
import { Link, useLocalSearchParams } from 'expo-router';
import { tintColor } from '@/constants/constants';
import { formatDate, formatMillions } from '@/utils';
import NoResults from '@/components/NoResults';
import { icons } from '@/constants/icons';

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
  const {
    data: movie,
    loading,
    error,
    fetchData,
  } = useFetch(fetchMovieDetails, { movieId: id as string });

  return (
    <View className="flex-1 bg-primary">
      {loading || (!movie && <ActivityIndicator size="large" color={tintColor} />)}
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
                  <TouchableOpacity className="absolute bottom-4 bg-white right-4 rounded-full p-3">
                    <Image source={icons.play} className="w-5 h-5" tintColor={tintColor} />
                  </TouchableOpacity>
                </Link>
              )}
            </View>
            <View className="flex-col items-start justify-start mt-5 px-5">
              <Text className="text-white text-2xl font-bold">{movie?.title}</Text>
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
                value={movie?.genres.map((genre: any) => genre.name).join(' - ')}
              />
              <View className="flex flex-row justify-between w-1/2">
                <MovieInfo label="Budget" value={formatMillions(movie?.budget)} />
                <MovieInfo label="Revenue" value={formatMillions(movie?.revenue)} />
              </View>
              <MovieInfo
                label="Production Companies"
                value={movie?.production_companies.map((company: any) => company.name).join(' - ')}
              />
            </View>
          </ScrollView>
          <Link href="/search" asChild>
            <TouchableOpacity className="bg-darkAccent rounded-full px-5 py-2 flex-row items-center justify-center gap-x-2 z-50 absolute bottom-5 left-0 right-0 mx-5">
              <Image
                key={movie?.id}
                source={icons.arrow}
                className="size-5 mr-1 mt-0.5 rotate-180"
                tintColor={tintColor}
              />
              <Text className="text-white text-lg font-semibold">Back</Text>
            </TouchableOpacity>
          </Link>
        </>
      )}
    </View>
  );
};

export default MovieDetails;
