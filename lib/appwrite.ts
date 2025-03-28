import { Client, Account, Databases, ID, Avatars, Query } from 'react-native-appwrite';

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT as string,
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM as string,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID as string,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID as string,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID as string,
  movieCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MOVIE_COLLECTION_ID as string,
  ratingCollectionId: process.env.EXPO_PUBLIC_APPWRITE_RATING_COLLECTION_ID as string,
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);

export async function createUser(email: string, password: string, username: string) {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);
    if (!newAccount) {
      throw new Error('Failed to create account');
    }
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        userId: newAccount.$id,
        email,
        username,
        avatarUrl,
        bio: '',
        portfolioUrl: '',
        savedMovies: [],
      },
    );
    return newUser;
  } catch (error: any) {
    throw new Error(error.message || 'Error creating user');
  }
}

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    throw new Error(error.message || 'Error signing in');
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching account');
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error('No current account');
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('userId', currentAccount.$id)],
    );
    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error('No user document found');
    }
    return currentUser.documents[0];
  } catch (error: any) {
    return null;
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error: any) {
    throw new Error(error.message || 'Error signing out');
  }
}

export async function viewMovie(
  id: string,
  title: string,
  posterPath: string,
  voteAverage: number,
  releaseDate: string,
  genres: string[],
) {
  try {
    const movieDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.movieCollectionId,
      id,
    );

    const currentViewCount = movieDoc.viewCount || 0;
    return await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.movieCollectionId,
      id,
      { viewCount: currentViewCount + 1 },
    );
  } catch (error: any) {
    if (
      error.response &&
      error.code === 404 &&
      error.message === 'Document with the requested ID could not be found.'
    ) {
      try {
        const newMovie = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.movieCollectionId,
          id,
          {
            id,
            title,
            poster_path: posterPath,
            vote_average: voteAverage.toString(),
            release_date: releaseDate,
            genre_ids: genres,
            viewCount: 1,
          },
        );

        return newMovie;
      } catch (error: any) {
        throw new Error(error.message || 'Error creating movie');
      }
    }
    throw new Error(error.message || 'Error updating view count');
  }
}

export async function getPopularMovies() {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.movieCollectionId,
      [Query.orderDesc('viewCount'), Query.limit(5)],
    );
    return result.documents;
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching popular movies');
  }
}
