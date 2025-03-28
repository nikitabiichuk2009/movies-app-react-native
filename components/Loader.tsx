import { View, ActivityIndicator } from 'react-native';
import { tintColor } from '@/constants/constants';

const Loader = () => {
  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <ActivityIndicator size="large" color={tintColor} />
    </View>
  );
};

export default Loader;
