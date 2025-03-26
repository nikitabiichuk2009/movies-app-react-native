import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { icons } from '@/constants/icons';

const formatDate = (dateString: string) => {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const getGenreNames = (genreIds: number[]) => {
  return genreIds
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(' • ');
};

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <Link href={`/movies/${movie.id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={{
            uri: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://placehold.co/600x400/1a1a1a/ffffff.png',
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />
        <Text className="text-white text-base font-bold mt-1" numberOfLines={1}>
          {movie.title}
        </Text>
        <View className="flex-row items-center justify-start gap-x-1 mt-1">
          <Image source={icons.star} className="w-4 h-4" />
          <Text className="text-white text-sm font-semibold">{movie.vote_average.toFixed(2)}</Text>
        </View>
        <Text className="text-gray-400 text-xs mt-1" numberOfLines={1}>
          {getGenreNames(movie.genre_ids)}
        </Text>
        <Text className="text-gray-400 text-xs" numberOfLines={1}>
          {formatDate(movie.release_date)}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
