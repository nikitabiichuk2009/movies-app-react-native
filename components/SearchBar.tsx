import { Image, TextInput, View } from 'react-native';
import React from 'react';
import { icons } from '@/constants/icons';
import { tintColor } from '@/constants/constants';

const SearchBar = ({
  onPress,
  placeholder,
  value,
  onChangeText,
}: {
  onPress?: () => void;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <View className="flex-row items-center bg-searchBar rounded-full px-5 py-2">
      <Image
        source={icons.search}
        resizeMode="contain"
        style={{ width: 20, height: 20, tintColor: tintColor }}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={tintColor}
        value={value}
        onChangeText={onChangeText}
        onPress={onPress}
        className="text-white flex-1 ml-2"
      />
    </View>
  );
};

export default SearchBar;
