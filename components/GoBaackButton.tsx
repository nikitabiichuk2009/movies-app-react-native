import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { icons } from '@/constants/icons';
import { tintColor } from '@/constants/constants';

const GoBackButton = ({ title = 'Go Back' }: { title?: string }) => {
  const handlePress = () => {
    Promise.resolve()
      .then(() => router.back())
      .catch(() => {})
      .finally(() => {
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 100);
      });
  };

  return (
    <TouchableOpacity
      className="bg-darkAccent rounded-lg px-5 py-2 flex-row items-center justify-center gap-x-2 z-50 absolute bottom-5 left-0 right-0 mx-5"
      onPress={handlePress}
    >
      <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor={tintColor} />
      <Text className="text-white text-lg font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};

export default GoBackButton;
