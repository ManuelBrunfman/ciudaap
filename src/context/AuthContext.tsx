import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextData {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  // Alias para mantener compatibilidad con código viejo
  login(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential>;
  signIn(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential>;
  signUp(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  loading: true,
  signIn: async () => auth().signInWithEmailAndPassword('', ''),
  login: async () => auth().signInWithEmailAndPassword('', ''),
  signUp: async () => auth().createUserWithEmailAndPassword('', ''),
  signOut: async () => auth().signOut(),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth().onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = (email: string, password: string) =>
    auth().signInWithEmailAndPassword(email, password);

  // mantenemos alias login() → signIn()
  const login = signIn;

  const signUp = (email: string, password: string) =>
    auth().createUserWithEmailAndPassword(email, password);

  const signOut = () => auth().signOut();

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
