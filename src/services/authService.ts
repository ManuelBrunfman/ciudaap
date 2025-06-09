// CAMBIO: imports correctos para Auth y Firestore en React Native Firebase
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class AuthService {
  // Iniciar sesión
  signIn(email: string, password: string) {
    return auth().signInWithEmailAndPassword(email, password);
  }

  // Registro de usuario + creación en Firestore
  async signUp(email: string, password: string, additionalData?: any) {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    if (userCredential.user && additionalData) {
      await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set(additionalData);
    }
    return userCredential;
  }

  // Cerrar sesión
  signOut() {
    return auth().signOut();
  }

  // Otros métodos de auth pueden agregarse aquí
}

export default new AuthService();
