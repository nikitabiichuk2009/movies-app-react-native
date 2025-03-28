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

export const fetchMovieDetails = async ({ movieId }: { movieId: string }) => {
  const movieResponse = await fetch(`${TMDB_CONFIG.baseUrl}/movie/${movieId}`, {
    method: 'GET',
    headers: TMDB_CONFIG.headers,
  });

  if (!movieResponse.ok) {
    throw new Error('Failed to fetch movie details', {
      cause: movieResponse.statusText,
    });
  }

  const movieData = await movieResponse.json();

  const videoResponse = await fetch(`${TMDB_CONFIG.baseUrl}/movie/${movieId}/videos`, {
    method: 'GET',
    headers: TMDB_CONFIG.headers,
  });

  if (!videoResponse.ok) {
    throw new Error('Failed to fetch movie videos', {
      cause: videoResponse.statusText,
    });
  }

  const videoData = await videoResponse.json();
  const trailer = videoData.results.find(
    (v: { type: string; site: string; key: string }) =>
      v.type === 'Trailer' && v.site === 'YouTube',
  );

  return {
    ...movieData,
    videoUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
  };
};
