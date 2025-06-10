import { useContext } from 'react';
// Modular API
import { getAuth, updateProfile } from '@react-native-firebase/auth';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook que expone el usuario actual y helpers de autenticación.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);

  /** Extra: cambiar displayName */
  const updateDisplayName = async (displayName: string) => {
    const current = getAuth().currentUser;
    if (current) await updateProfile(current, { displayName });
  };

  return { ...ctx, updateDisplayName } as const;
};
