import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useUserContext } from '@/context/userContext';
import { getUserById, deleteNotification } from '@/lib/appwrite';
import { useToast } from '@/context/toastContenxt';
import { tintColor } from '@/constants/constants';
import TopHeader from '@/components/TopHeader';
import NoResults from '@/components/NoResults';
import { icons } from '@/constants/icons';
import { Redirect, router } from 'expo-router';
import ConfirmationModal from '@/components/ConfirmationModal';

interface NotificationUser {
  userId: string;
  username: string;
  avatarUrl: string;
  fullName: string;
  email: string;
  contactOptions?: string;
}

const NotificationsScreen = () => {
  const { user, refreshUser, isLogged } = useUserContext();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notificationUsers, setNotificationUsers] = useState<NotificationUser[]>([]);
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    userId: '',
  });

  useEffect(() => {
    fetchNotifications();
  }, [user?.notifications]);

  const fetchNotifications = async () => {
    try {
      if (!user?.notifications?.length) {
        setNotificationUsers([]);
        setLoading(false);
        return;
      }

      const uniqueUserIds = [...new Set(user.notifications)];
      const userPromises = uniqueUserIds.map(async (userId) => await getUserById(userId));
      const users = await Promise.all(userPromises);

      const validUsers = users.filter(Boolean).map((userData) => ({
        userId: userData.userId,
        username: userData.username,
        email: userData.email,
        avatarUrl: userData.avatarUrl,
        fullName: userData.fullName,
        contactOptions: userData.contactOptions,
      }));

      setNotificationUsers(validUsers);
    } catch (error: any) {
      showToast('Error', error.message || 'Failed to fetch notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDismissNotification = (userId: string) => {
    setConfirmModal({
      visible: true,
      userId,
    });
  };

  const confirmDismiss = async () => {
    try {
      if (!user) return;
      await deleteNotification(user.userId, confirmModal.userId);
      setNotificationUsers((prev) =>
        prev.filter((notifUser) => notifUser.userId !== confirmModal.userId),
      );
      refreshUser();
      showToast('Success', 'Notification dismissed', 'success');
    } catch (error: any) {
      showToast('Error', error.message || 'Failed to dismiss notification', 'error');
    } finally {
      setConfirmModal({ visible: false, userId: '' });
    }
  };

  if (!user || !isLogged) {
    return <Redirect href="/sign-in" />;
  }

  const renderNotification = ({ item }: { item: NotificationUser }) => (
    <View className="bg-searchBar p-4 rounded-2xl mb-4 mx-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-secondaryText text-sm">New Contact Request</Text>
        <TouchableOpacity
          onPress={() => handleDismissNotification(item.userId)}
          className="bg-secondary p-2 rounded-full"
        >
          <Image source={icons.checkmark} className="size-5" tintColor={tintColor} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="flex-row items-center mb-3"
        onPress={() => router.push(`/profile/${item.userId}`)}
      >
        <Image
          source={{ uri: item.avatarUrl }}
          className="w-16 h-16 rounded-full"
          defaultSource={icons.person}
        />
        <View className="ml-4 flex-1">
          <Text className="text-white text-lg font-bold">{item.fullName}</Text>
          <Text className="text-secondaryText">@{item.username}</Text>
        </View>
      </TouchableOpacity>

      <View className="mt-2">
        <Text className="text-white text-base mb-2">
          {item.fullName.split(' ')[0]} would like to connect with you!
        </Text>
      </View>
      <View className="bg-secondary p-3 rounded-xl">
        <Text className="text-secondaryText text-sm mb-1">Contact Options:</Text>
        <Text className="text-white">{item.email}</Text>
        {item.contactOptions && <Text className="text-white mt-1">{item.contactOptions}</Text>}
      </View>

      <TouchableOpacity
        className="bg-darkAccent py-3 rounded-xl flex-row items-center justify-center mt-4"
        onPress={() => router.push(`/profile/${item.userId}`)}
      >
        <Image source={icons.person} className="w-5 h-5 mr-2" tintColor="white" />
        <Text className="text-white font-semibold">View Profile</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-primary">
      <TopHeader />
      <Text className="text-white text-2xl font-bold px-6 mb-4">Notifications</Text>

      {loading ? (
        <ActivityIndicator size="large" color={tintColor} />
      ) : (
        <FlatList
          data={notificationUsers}
          renderItem={renderNotification}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={{ paddingVertical: 20 }}
          ListEmptyComponent={() => (
            <NoResults
              title="No Notifications"
              description="You don't have any notifications yet"
              buttonTitle="Explore Community"
              href="/community"
            />
          )}
        />
      )}

      <ConfirmationModal
        visible={confirmModal.visible}
        title="Dismiss Notification"
        message="Are you sure you want to dismiss this notification? You may never meet this person again. This action cannot be undone."
        onCancel={() => setConfirmModal({ visible: false, userId: '' })}
        onConfirm={confirmDismiss}
        confirmText="Dismiss"
        cancelText="Cancel"
        isDestructive
      />
    </View>
  );
};

export default NotificationsScreen;
