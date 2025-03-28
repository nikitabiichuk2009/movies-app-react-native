import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { icons } from '@/constants/icons';
import { tintColor } from '@/constants/constants';
import { useUserContext } from '@/context/userContext';

interface UserCardProps {
  user: UserData;
}

const UserCard = ({ user }: UserCardProps) => {
  const { user: currentUser } = useUserContext();

  const profileLink = currentUser?.userId === user.userId ? '/profile' : `/profile/${user.userId}`;

  return (
    <Link href={profileLink as any} asChild>
      <TouchableOpacity className="bg-searchBar p-4 rounded-lg mb-4 flex-row items-center">
        <Image
          source={{ uri: user.avatarUrl }}
          className="w-12 h-12 rounded-full mr-4"
          defaultSource={icons.person}
        />
        <View className="flex-1">
          <Text className="text-white text-lg font-bold">{user.username}</Text>
          <Text className="text-secondaryText text-sm">{user.email}</Text>
        </View>
        <View className="flex-row items-center gap-x-2">
          <Image source={icons.saveFilled} className="size-5" tintColor={tintColor} />
          <Text className="text-white text-base">{user.savedMovies?.length || 0}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default UserCard;
