import { hasUserSavedMovie } from '@/utils';
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

export async function createUser(
  email: string,
  password: string,
  username: string,
  fullName: string,
) {
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
        fullName,
      },
    );
    return newUser;
  } catch (error: any) {
    throw new Error(error.message || 'Error creating user');
  }
}

interface UpdateCurrentUserParams {
  username?: string;
  password?: string;
  oldPassword?: string;
  bio?: string;
  portfolioUrl?: string;
  contactOptions?: string;
  fullName?: string;
}

export async function updateCurrentUser({
  username,
  password,
  oldPassword,
  bio,
  portfolioUrl,
  contactOptions,
  fullName,
}: UpdateCurrentUserParams) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    const documentData: Record<string, any> = {};

    if (username && username !== currentUser.name) {
      await account.updateName(username);
    }

    if (password && oldPassword) {
      await account.updatePassword(password, oldPassword);
    }

    const userDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('userId', currentUser.userId)],
    );

    const doc = userDocs.documents[0];
    if (!doc) throw new Error('User document not found');

    if (username !== undefined) {
      documentData.username = username;
    }

    if (bio !== undefined) {
      documentData.bio = bio;
    }
    if (portfolioUrl !== undefined) {
      documentData.portfolioUrl = portfolioUrl;
    }
    if (fullName !== undefined) {
      documentData.fullName = fullName;
    }

    let updatedDoc = doc;
    if (Object.keys(documentData).length > 0) {
      updatedDoc = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        doc.$id,
        documentData,
      );
    }

    if (contactOptions !== undefined) {
      documentData.contactOptions = contactOptions;
    }

    return {
      ...updatedDoc,
      username: username || currentUser.name,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update user');
  }
}

// export async function deleteAccount() {
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser) throw new Error('User not authenticated');
//     const accountId = currentUser.userId;
//     await account.deleteSession('current');
//     const userDocs = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       [Query.equal('userId', accountId)]
//     );
//     if (userDocs.documents.length > 0) {
//       const doc = userDocs.documents[0];
//       await databases.deleteDocument(
//         appwriteConfig.databaseId,
//         appwriteConfig.userCollectionId,
//         doc.$id
//       );
//     }
//     return true;
//   } catch (error: any) {
//     console.error('deleteAccount failed:', error);
//     throw new Error(error.message || 'Failed to delete account');
//   }
// }

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

export async function getUserById(userId: string) {
  try {
    const res = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('userId', userId)],
    );

    const userDoc = res.documents[0];
    return userDoc;
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching user');
  }
}

export async function fetchCommunityUsers(limit = 20, offset = 0, searchTerm: string = '') {
  try {
    const queries = [Query.limit(limit), Query.offset(offset), Query.orderDesc('$createdAt')];

    if (searchTerm.trim()) {
      queries.push(Query.search('username', searchTerm.trim()));
    }

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries,
    );

    return {
      users: response.documents,
      total: response.total,
      hasMore: offset + response.documents.length < response.total,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch community users');
  }
}

export async function toggleFavoriteMovie(
  id: string,
  title: string,
  poster_path: string,
  vote_average: number,
  release_date: string,
  genre_ids: string[],
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const existingMovies = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.movieCollectionId,
      [Query.equal('id', id)],
    );

    if (existingMovies.total === 0) {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.movieCollectionId,
        ID.unique(),
        {
          id,
          title,
          poster_path,
          vote_average: vote_average.toString(),
          release_date,
          genre_ids,
          viewCount: 0,
        },
      );
    }

    const currentFavorites: string[] = currentUser.savedMovies || [];
    const isSaved = hasUserSavedMovie(currentUser as any, id);
    const updatedFavorites = isSaved
      ? currentFavorites.filter((movie: any) => String(movie.id) !== String(id))
      : [
          ...currentFavorites,
          {
            id,
            title,
            poster_path,
            vote_average: vote_average.toString(),
            release_date,
            genre_ids,
          },
        ];

    const updatedDoc = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUser.$id,
      { savedMovies: updatedFavorites },
    );

    return updatedDoc;
  } catch (error: any) {
    throw new Error(error.message || 'Error toggling favorite movie');
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
          ID.unique(),
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

export async function createNotification(toUserId: string, fromUserId: string) {
  try {
    const userDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('userId', toUserId)],
    );

    if (!userDocs.documents.length) {
      throw new Error('User document not found');
    }

    const doc = userDocs.documents[0];
    const docId = doc.$id;

    const notifications: string[] = doc.notifications || [];
    notifications.push(fromUserId);

    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      docId,
      { notifications },
    );

    return updated;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || 'Failed to create notification');
  }
}

export async function deleteNotification(userId: string, fromUserId: string) {
  try {
    const userDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('userId', userId)],
    );

    if (!userDocs.documents.length) {
      throw new Error('User document not found');
    }

    const doc = userDocs.documents[0];
    const docId = doc.$id;

    const updatedNotifs = (doc.notifications || []).filter((id: string) => id !== fromUserId);

    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      docId,
      { notifications: updatedNotifs },
    );

    return updated;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || 'Failed to delete notification');
  }
}

export async function findSimilarUsers(): Promise<(UserData & { similarity: number })[]> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Current user not found');
    }

    const res = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
    );

    const otherUsers: any[] = res.documents.filter(
      (user: any) => user.userId !== currentUser.userId,
    );

    const currentUserMovieIds = new Set(
      (currentUser.savedMovies || []).map((movie: any) => String(movie.id)),
    );

    const usersWithSimilarity = otherUsers.map((user) => {
      const userMovieIds = new Set((user.savedMovies || []).map((movie: any) => String(movie.id)));
      let commonCount = 0;
      currentUserMovieIds.forEach((id) => {
        if (userMovieIds.has(id as string)) {
          commonCount++;
        }
      });
      return { ...user, similarity: commonCount };
    });

    usersWithSimilarity.sort((a, b) => b.similarity - a.similarity);

    return usersWithSimilarity;
  } catch (error: any) {
    throw new Error(error.message || 'Error finding similar users');
  }
}
