import { Image, TextInput, View } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

const tintColor = "#A8B5DB";

const SearchBar = ({ onPress, placeholder }: { onPress: () => void, placeholder: string }) => {
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
        value=""
        onChangeText={() => {}}
        onPress={onPress}
        className="text-white flex-1 ml-2"
      />
    </View>
  );
};

export default SearchBar;
