import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CustomAlertProps {
  title: string;
  message: string;
  onClose: () => void;
  type?: 'error' | 'success' | 'warning';
}

const CustomAlert = ({ title, message, onClose, type = 'error' }: CustomAlertProps) => {
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90';
      case 'warning':
        return 'bg-yellow-500/90';
      default:
        return 'bg-red-500/90';
    }
  };

  return (
    <View className={`absolute top-5 left-5 right-5 ${getBgColor()} p-4 rounded-xl z-50`}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className={`text-white font-bold text-lg`}>{title}</Text>
          <Text className={`text-white mt-1`}>{message}</Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Text className={`text-white font-bold`}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomAlert;