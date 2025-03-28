import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

interface CustomDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
  isButtonDisabled: boolean;
  isSubmittingForm: boolean;
}

export default function CustomDialog({
  visible,
  title,
  description,
  onClose,
  onSubmit,
  children,
  isButtonDisabled = false,
  isSubmittingForm = false,
}: CustomDialogProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-11/12 bg-primary rounded-xl p-6">
          <Text className="text-white text-2xl font-bold mb-2">{title}</Text>
          {description && <Text className="text-gray-300 text-base mb-4">{description}</Text>}
          {children}
          <View className="mt-4 flex-row justify-end gap-2">
            <TouchableOpacity
              onPress={onClose}
              className=" border-darkAccent border rounded-lg px-4 py-2"
            >
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSubmit}
              className="bg-darkAccent disabled:opacity-50 rounded-lg px-4 py-2"
              disabled={isButtonDisabled}
            >
              <Text className="text-white font-semibold">
                {isSubmittingForm ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
