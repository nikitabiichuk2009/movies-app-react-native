import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} resizeMode="cover" className="w-full z-0 absolute" />
      <Image source={icons.logo} className="w-12 h-12 mt-20 mx-auto" />

      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={images.heroSectionImage}
          style={{ width: 250, height: 250, resizeMode: 'contain' }}
        />

        <Text className="text-white text-5xl font-bold text-center mt-8">CineScope</Text>

        <Text className="text-gray-400 text-lg text-center mt-2">
          Discover top-rated movies, explore by genre, and find your next favorite film.
        </Text>

        <Link href="/search" asChild>
          <TouchableOpacity className="bg-darkAccent px-8 py-4 rounded-full mt-10">
            <Text className="text-white text-xl font-semibold">Explore now</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
