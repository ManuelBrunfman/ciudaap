// src/hooks/useAuth.ts
import { useContext } from 'react';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook que expone el usuario actual y helpers de autenticación.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);

  /** Ejemplo extra: cambiar displayName */
  const updateDisplayName = async (displayName: string) => {
    const current = auth().currentUser;
    if (current) await current.updateProfile({ displayName });
  };

  return { ...ctx, updateDisplayName } as const;
};
