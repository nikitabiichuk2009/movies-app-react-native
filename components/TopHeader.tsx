import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';
import { Link } from 'expo-router';
const TopHeader = () => {
  return (
    <>
      <Image source={images.bg} resizeMode="cover" className="w-full z-0 absolute" />
      <Link href="/" asChild>
        <TouchableOpacity className="mt-20 mb-5 mx-auto">
          <Image source={icons.logo} className="w-12 h-12" />
        </TouchableOpacity>
      </Link>
    </>
  );
};

export default TopHeader;
