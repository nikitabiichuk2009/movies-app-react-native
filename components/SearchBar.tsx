import React from 'react';
import { icons } from '@/constants/icons';
import FormField from './FormField';

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
    <FormField
      title={''}
      value={value}
      onChangeText={onChangeText}
      onPress={onPress}
      image={icons.search}
      placeholder={placeholder}
      handleChangeText={onChangeText}
    />
  );
};

export default SearchBar;
