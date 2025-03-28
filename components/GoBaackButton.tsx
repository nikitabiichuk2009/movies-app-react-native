import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { Link } from 'expo-router';
import { icons } from '@/constants/icons';
import { tintColor } from '@/constants/constants';

interface GoBackButtonProps {
  href: string;
  title?: string;
}

const GoBackButton = ({ href, title = 'Go Back' }: GoBackButtonProps) => {
  return (
    <Link href={href as any} asChild>
      <TouchableOpacity className="bg-darkAccent rounded-full px-5 py-2 flex-row items-center justify-center gap-x-2 z-50 absolute bottom-5 left-0 right-0 mx-5">
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor={tintColor}
        />
        <Text className="text-white text-lg font-semibold">{title}</Text>
      </TouchableOpacity>
    </Link>
  );
};

export default GoBackButton;
