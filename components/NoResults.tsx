import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface Props {
  title: string;
  description: string;
  buttonTitle: string;
  onPress?: () => void;
  isError?: boolean;
  href?: string;
}

const NoResults = ({ title, description, buttonTitle, onPress, isError = false, href }: Props) => {
  const router = useRouter();

  const handlePress = () => {
    if (href) {
      router.push(href as any);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <View className="mt-10 w-full flex-1 items-center justify-center px-4">
      <Text className="text-2xl font-bold text-white text-center">
        {isError ? '❌' : '😕'} {title} {isError ? '❌' : '😕'}
      </Text>
      <Text className="text-center text-secondaryText mt-1 mb-2 text-base max-w-md">
        {description}
      </Text>
      <TouchableOpacity onPress={handlePress} className="bg-darkAccent rounded-full px-6 py-3">
        <Text className="text-white font-semibold">{buttonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoResults;
