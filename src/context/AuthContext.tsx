import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebaseConfig';

/**
 * Interfaz de usuario que se maneja en la app.
 * Solo email y name (más uid).
 */
interface User {
  uid: string;
  email: string;
  name: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    userData: Omit<User, 'uid'>
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Lee los campos "email" y "name" de Firestore en "users/<uid>".
   * Si no existe el documento, lo crea con valores vacíos.
   */
  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User> => {
    try {
      const docRef = doc(firestore, 'users', firebaseUser.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Crear un documento básico si no existe
        const userData = {
          email: firebaseUser.email || '',
          name: '',
        };
        
        await setDoc(docRef, userData);
        
        return {
          uid: firebaseUser.uid,
          email: userData.email,
          name: userData.name,
        };
      }

      const data = docSnap.data() as { email?: string; name?: string };
      return {
        uid: firebaseUser.uid,
        email: data.email || '',
        name: data.name || '',
      };
    } catch (error) {
      console.error("Error en fetchUserData:", error);
      // Retornar datos básicos en caso de error para evitar bloqueo
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: '',
      };
    }
  };

  /**
   * Escucha cambios de estado de autenticación (login/logout).
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userData = await fetchUserData(currentUser);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error en onAuthStateChanged:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  /**
   * Inicia sesión
   */
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const userData = await fetchUserData(firebaseUser);
      setUser(userData);
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  /**
   * Registra un nuevo usuario
   */
  const register = async (email: string, password: string, userData: Omit<User, 'uid'>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Crear/actualizar el documento en Firestore
      await setDoc(doc(firestore, 'users', firebaseUser.uid), {
        email: email,
        name: userData.name || '',
      });

      // Leer los datos que se guardaron
      const finalData = await fetchUserData(firebaseUser);
      setUser(finalData);
    } catch (error) {
      console.error("Error en register:", error);
      throw error;
    }
  };

  /**
   * Cierra sesión
   */
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error en logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;