import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';
import SearchBar from '@/components/SearchBar';
import useFetch from '@/services/hooks/useFetch';
import { fetchMovies } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import NoResults from '@/components/NoResults';
import { tintColor } from '@/constants/constants';
import TopHeader from '@/components/TopHeader';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);

  const { data, loading, error, fetchData } = useFetch(
    fetchMovies,
    { searchQuery: '', page: 1 },
    false,
  );

  useEffect(() => {
    if (data) {
      setTotalPages(data.total_pages);
      setMovies((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
    }
  }, [data]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setMovies([]);
      setInitialLoading(true);

      fetchData({ searchQuery: searchQuery.trim(), page: 1 }).finally(() => {
        setInitialLoading(false);
      });
    }, 800);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData({ searchQuery, page: nextPage });
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <TopHeader />
      <View className="flex-1 px-6">
        <SearchBar
          placeholder="Search for a movie"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text className="text-white text-2xl font-bold mt-4 mb-2">Latest Movies</Text>
        {initialLoading ? (
          <ActivityIndicator size="large" color={tintColor} className="mt-10" />
        ) : (
          <FlatList
            data={movies}
            renderItem={({ item }) => <MovieCard movie={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={1}
            ListFooterComponent={
              loading && movies.length > 0 && page < totalPages ? (
                <ActivityIndicator size="large" color={tintColor} />
              ) : null
            }
            ListEmptyComponent={
              <View className="mt-10">
                {loading ? (
                  <ActivityIndicator size="large" color="#00f" />
                ) : error ? (
                  <NoResults
                    title="Something went wrong"
                    description="Please try again later"
                    buttonTitle="Go Home"
                    isError
                  />
                ) : (
                  <NoResults
                    title="No Movies Found"
                    description="Try a different search"
                    buttonTitle="Clear Search"
                    onPress={() => setSearchQuery('')}
                  />
                )}
              </View>
            }
            columnWrapperStyle={{
              justifyContent: 'flex-start',
              gap: 20,
              paddingRight: 5,
              marginBottom: 10,
            }}
            contentContainerStyle={{
              paddingBottom: 40,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Search;
