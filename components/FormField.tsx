import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, TextInputProps } from 'react-native';
import { icons } from '@/constants/icons';
import { tintColor } from '@/constants/constants';

interface FormFieldProps extends TextInputProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  error: string;
  otherStyles?: string;
  image?: any;
  padding?: string;
  disabled?: boolean;
}

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  image,
  error,
  padding,
  disabled,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = title.toLowerCase().includes('password');

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      {title && <Text className="text-base text-gray-100 font-medium mb-1">{title}</Text>}

      <View
        className={`flex-row items-center bg-searchBar ${disabled ? 'opacity-50' : ''} rounded-lg ${
          padding || 'px-5 py-2'
        }`}
      >
        {image && (
          <Image source={image} resizeMode="contain" style={{ width: 20, height: 20, tintColor }} />
        )}

        <TextInput
          className="text-white ml-2 placeholder:line-clamp-1"
          value={value}
          placeholder={placeholder}
          placeholderTextColor={tintColor}
          onChangeText={handleChangeText}
          secureTextEntry={isPassword && !showPassword}
          {...props}
          editable={!disabled}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Image
              source={showPassword ? icons.eyeHide : icons.eye}
              className="w-6 h-6 ml-2"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-base mt-1">{error}</Text>}
    </View>
  );
};

export default FormField;
