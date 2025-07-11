import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@shared/schema';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  user: null,
  loading: true,
  getIdToken: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getIdToken = async (): Promise<string | null> => {
    if (!firebaseUser) return null;
    try {
      return await firebaseUser.getIdToken();
    } catch (error) {
      console.error('Failed to get ID token:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
};
