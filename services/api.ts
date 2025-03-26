export const TMDB_CONFIG = {
  baseUrl: 'https://api.themoviedb.org/3',
  API_KEY: process.env.EXPO_PUBLIC_API_READ_TOKEN,
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + process.env.EXPO_PUBLIC_API_READ_TOKEN,
  },
};

export const fetchMovies = async ({
  searchQuery,
  page = 1,
}: {
  searchQuery: string;
  page?: number;
}) => {
  const hasQuery = searchQuery.trim().length > 0;

  const url = hasQuery
    ? `${TMDB_CONFIG.baseUrl}/search/movie?query=${encodeURIComponent(
        searchQuery,
      )}&include_adult=false&language=en-US&page=${page}`
    : `${TMDB_CONFIG.baseUrl}/discover/movie?sort_by=popularity.desc&language=en-US&page=${page}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch movies', {
      cause: response.statusText,
    });
  }

  const data = await response.json();
  return data;
};
