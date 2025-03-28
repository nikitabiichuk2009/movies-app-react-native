import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, TextInputProps } from 'react-native';
import { icons } from '@/constants/icons';
import { tintColor } from '@/constants/constants';

interface FormFieldProps extends TextInputProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  image?: any; // optional icon
}

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  image,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = title.toLowerCase() === 'password';

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      {title && <Text className="text-base text-gray-100 font-medium mb-1">{title}</Text>}

      <View className="flex-row items-center bg-searchBar rounded-full px-5 py-2">
        {image && (
          <Image source={image} resizeMode="contain" style={{ width: 20, height: 20, tintColor }} />
        )}

        <TextInput
          className="text-white flex-1 ml-2"
          value={value}
          placeholder={placeholder}
          placeholderTextColor={tintColor}
          onChangeText={handleChangeText}
          secureTextEntry={isPassword && !showPassword}
          {...props}
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
    </View>
  );
};

export default FormField;
