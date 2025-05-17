// types/firebase-auth-react-native.d.ts
// Agrega este archivo en el root del proyecto o dentro de una carpeta `types/`
// para que TypeScript reconozca el submódulo RN de Firebase Auth.

declare module 'firebase/auth/react-native' {
  import type { Persistence } from 'firebase/auth';
  import type AsyncStorage from '@react-native-async-storage/async-storage';

  /**
   * Obtiene una instancia de Persistence para React Native (AsyncStorage)
   * @param storage – el módulo de AsyncStorage importado
   */
  export function getReactNativePersistence(
    storage: typeof AsyncStorage
  ): Persistence;
}
