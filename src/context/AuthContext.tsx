import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
// Modular API
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextData {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  login(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential>;
  signIn(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential>;
  signUp(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  loading: true,
  signIn: async () => Promise.reject(),
  login: async () => Promise.reject(),
  signUp: async () => Promise.reject(),
  signOut: async () => Promise.reject(),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = (email: string, password: string) => {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Alias para login() → signIn()
  const login = signIn;

  const signUp = (email: string, password: string) => {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = () => {
    const auth = getAuth();
    return firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
