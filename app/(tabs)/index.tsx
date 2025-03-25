import { Text, View } from "react-native";
import { Link } from "expo-router";
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-4xl font-bold text-primary">Hello World There</Text>
      <Link href="/search" asChild>
        <Text className="text-secondaryText">Go to Search</Text>
      </Link>
    </View>
  );
}
