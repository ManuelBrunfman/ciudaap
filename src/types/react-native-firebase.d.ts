// src/@types/react-native-firebase.d.ts
import '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

declare module '@react-native-firebase/auth' {
  interface ReactNativeFirebaseNamespace {
    ReactNativeAsyncStorage: typeof AsyncStorage;
  }
}