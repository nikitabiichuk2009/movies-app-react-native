import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import { icons } from '@/constants/icons';
import { tintColor } from '@/constants/constants';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

const ConfirmationModal = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}: ConfirmationModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="w-full bg-searchBar rounded-2xl p-6">
          <View className="flex-row items-center mb-4">
            <Image
              source={isDestructive ? icons.warning : icons.info}
              className="size-6 mr-2"
              tintColor={isDestructive ? '' : tintColor}
            />
            <Text className="text-white text-xl font-bold">{title}</Text>
          </View>

          <Text className="text-secondaryText text-base mb-6">{message}</Text>

          <View className="flex-row gap-x-3">
            <TouchableOpacity
              className="flex-1 bg-transparent border border-darkAccent py-3 rounded-xl"
              onPress={onCancel}
            >
              <Text className="text-white text-center font-semibold">{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl ${isDestructive ? 'bg-red-500' : 'bg-darkAccent'}`}
              onPress={onConfirm}
            >
              <Text className="text-white text-center font-semibold">{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
