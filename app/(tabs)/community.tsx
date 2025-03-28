import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { fetchCommunityUsers, findSimilarUsers } from '@/lib/appwrite';
import SearchBar from '@/components/SearchBar';
import { tintColor } from '@/constants/constants';
import TopHeader from '@/components/TopHeader';
import NoResults from '@/components/NoResults';
import { useToast } from '@/context/toastContenxt';
import UserCard from '@/components/UserCard';
import { useUserContext } from '@/context/userContext';
const LIMIT = 20;

export default function Communities() {
  const { isLogged } = useUserContext();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [friendMode, setFriendMode] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 800);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const fetchUsers = async (reset = false) => {
    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;
      const response = await fetchCommunityUsers(LIMIT, currentOffset, debouncedSearchTerm);
      setUsers(reset ? (response.users as any) : [...users, ...response.users]);
      setHasMore(response.hasMore);
      setOffset(currentOffset + response.users.length);
    } catch (error: any) {
      showToast('Error', error.message || 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setOffset(0);
    if (friendMode) {
      handleFindFriends();
    } else {
      fetchUsers(true);
    }
  }, [debouncedSearchTerm, friendMode]);

  const handleLoadMore = () => {
    if (!loading && hasMore && !friendMode) {
      fetchUsers();
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    setOffset(0);
    setUsers([]);
    if (friendMode) {
      setFriendMode(false);
    }
  };

  const handleFindFriends = async () => {
    if (!isLogged) {
      showToast('Error', 'Please login to find friends', 'error');
      return;
    }
    try {
      setLoading(true);
      setFriendMode(true);
      const similarUsers = await findSimilarUsers();
      setUsers(similarUsers);
      setHasMore(false);
    } catch (error: any) {
      showToast('Error', error.message || 'Failed to find friends', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleShowAllUsers = () => {
    setFriendMode(false);
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setOffset(0);
    setUsers([]);
    fetchUsers(true);
  };

  useEffect(() => {
    if (!friendMode) {
      setOffset(0);
      setUsers([]);
      fetchUsers(true);
    }
  }, [debouncedSearchTerm, friendMode]);

  useEffect(() => {
    if (!friendMode) {
      fetchUsers(true);
    }
  }, []);

  return (
    <View className="flex-1 bg-primary">
      <TopHeader />
      <View className="px-6 flex-1">
        <Text className="text-white text-2xl font-bold mb-4">Community</Text>

        <SearchBar
          placeholder="Search users"
          value={searchTerm}
          onChangeText={handleSearch}
          disabled={friendMode}
        />

        <TouchableOpacity
          onPress={friendMode ? handleShowAllUsers : handleFindFriends}
          className="bg-darkAccent px-6 py-3 rounded-lg mt-4 disabled:opacity-50"
        >
          <Text className="text-white text-lg font-semibold text-center">
            {friendMode ? 'Show All Users' : 'Find Friends'}
          </Text>
        </TouchableOpacity>

        {loading && !refreshing && users.length === 0 && (
          <View className="items-center justify-center mt-4">
            <ActivityIndicator size="large" color={tintColor} />
          </View>
        )}

        <FlatList
          data={users}
          renderItem={({ item }) => <UserCard user={item} />}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={{ paddingTop: 20 }}
          ListEmptyComponent={() =>
            !loading && !refreshing ? (
              <NoResults
                title="No Users Found"
                description={
                  debouncedSearchTerm ? 'Try a different search term' : 'No users available'
                }
                buttonTitle={debouncedSearchTerm ? 'Clear Search' : 'Refresh'}
                onPress={() => (debouncedSearchTerm ? handleSearch('') : handleRefresh())}
              />
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={tintColor}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loading && hasMore && users.length > 0 ? (
              <ActivityIndicator size="large" color={tintColor} className="py-4" />
            ) : null
          }
        />
      </View>
    </View>
  );
}
