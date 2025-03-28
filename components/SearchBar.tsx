import React from 'react';
import { icons } from '@/constants/icons';
import FormField from './FormField';

const SearchBar = ({
  onPress,
  placeholder,
  value,
  onChangeText,
  error,
  disabled,
}: {
  onPress?: () => void;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string | undefined;
  disabled?: boolean;
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
      error={error || ''}
      disabled={disabled || false}
    />
  );
};

export default SearchBar;
