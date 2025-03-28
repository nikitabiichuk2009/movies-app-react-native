import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/appwrite';
import { useToast } from '@/context/toastContenxt';

interface UserContextType {
  isLogged: boolean;
  setIsLogged: (value: boolean) => void;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await getCurrentUser();

        if (response) {
          setIsLogged(true);
          setUser(response as unknown as UserData);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      } catch (error: any) {
        setIsLogged(false);
        setUser(null);
        showToast('Error', error.message || 'Failed to fetch user data', 'error');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const value = {
    isLogged,
    setIsLogged,
    user,
    setUser,
    loading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
