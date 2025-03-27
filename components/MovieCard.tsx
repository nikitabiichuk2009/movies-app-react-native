import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { icons } from '@/constants/icons';
import { formatDate, getGenreNames } from '@/utils';

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <Link href={`/movies/${movie.id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={{
            uri: movie?.poster_path
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
        <Text className="text-secondaryText text-xs mt-1" numberOfLines={1}>
          {getGenreNames(movie.genre_ids)}
        </Text>
        <Text className="text-secondaryText text-xs" numberOfLines={1}>
          {formatDate(movie.release_date)}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
