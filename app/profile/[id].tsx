import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useToast } from '@/context/toastContenxt';
import { getUserById, createNotification } from '@/lib/appwrite';
import Profile from '@/components/Profile';
import { useUserContext } from '@/context/userContext';
import Loader from '@/components/Loader';
import GoBackButton from '@/components/GoBaackButton';

const UserProfileScreen = () => {
  const { id } = useLocalSearchParams();
  const { user: currentUser } = useUserContext();
  const [user, setUser] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { showToast } = useToast();
  const [isSending, setIsSending] = React.useState(false);

  const isAlreadySent = user?.notifications?.includes(currentUser?.userId as string);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(id as string);
        setUser(userData as any);
      } catch (error: any) {
        showToast('Error', error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSendContactRequest = async () => {
    if (!currentUser || !user) return;
    setIsSending(true);
    try {
      await createNotification(user.userId, currentUser.userId);
      showToast('Success', 'Contact request sent', 'success');
    } catch (error: any) {
      showToast('Error', error.message || 'Failed to send contact request', 'error');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <View className="flex-1 bg-primary">
      <Profile user={user}>
        {currentUser?.userId !== user.userId && (
          <View className="flex flex-row gap-2">
            <TouchableOpacity
              disabled={isSending || isAlreadySent}
              className="bg-darkAccent px-6 py-3 rounded-full flex-1 mt-4 disabled:opacity-50"
              onPress={handleSendContactRequest}
            >
              <Text className="text-white text-lg font-semibold text-center">
                {isSending
                  ? 'Sending...'
                  : isAlreadySent
                  ? 'Contact Request is already sent'
                  : 'Send Contact Request'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Profile>
      <GoBackButton />
    </View>
  );
};

export default UserProfileScreen;
