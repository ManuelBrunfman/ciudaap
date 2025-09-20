// src/services/authService.ts

/**
 * Servicio de autenticación usando la API modular de React Native Firebase.
 * Migrado desde auth().signInWith… y firestore().collection().
 */

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
} from '@react-native-firebase/firestore';
import { getFirebaseApp } from '../config/firebaseApp';

class AuthService {
  /**
   * Inicia sesión con email y contraseña.
   */
  async signIn(email: string, password: string) {
    const auth = getAuth(getFirebaseApp());
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Crea un nuevo usuario y, si se proporciona additionalData, lo guarda en Firestore.
   */
  async signUp(email: string, password: string, additionalData?: Record<string, any>) {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Si recibimos datos adicionales, los guardamos en Firestore
    if (additionalData && userCredential.user) {
      const db = getFirestore(app);
      const userDoc = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDoc, additionalData);
    }

    return userCredential;
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  async signOut() {
    const auth = getAuth(getFirebaseApp());
    return firebaseSignOut(auth);
  }
}

export default new AuthService();
