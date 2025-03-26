import React from 'react';
import { Image } from 'react-native';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';

const TopHeader = () => {
  return (
    <>
      <Image source={images.bg} resizeMode="cover" className="w-full z-0 absolute" />
      <Image source={icons.logo} className="w-12 h-12 mt-20 mb-5 mx-auto" />
    </>
  );
};

export default TopHeader;
