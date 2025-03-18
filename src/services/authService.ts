import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signOut,
    AuthError
  } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { auth, firestore } from '../../config/firebaseConfig';
  
  interface UserData {
    email: string;
    displayName?: string;
    affiliationNumber?: string;
    province?: string;
  }
  
  class AuthService {
    /**
     * Registra un nuevo usuario en Firebase Authentication y Firestore
     * @param email Correo electrónico del usuario
     * @param password Contraseña
     * @param userData Información adicional del usuario
     */
    static async register(
      email: string, 
      password: string, 
      userData: UserData
    ): Promise<{ success: boolean; error?: string }> {
      try {
        // Desestructurar para eliminar posible conflicto de email
        const { email: userDataEmail, ...restUserData } = userData;
  
        // Crear usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          email, 
          password
        );
        const user = userCredential.user;
  
        // Guardar información adicional en Firestore
        await setDoc(doc(firestore, 'users', user.uid), {
          email: user.email,
          ...restUserData,
          createdAt: new Date()
        });
  
        return { success: true };
      } catch (error: any) {
        console.error('Registration error:', error);
        return { 
          success: false, 
          error: this.handleAuthError(error) 
        };
      }
    }
  
    /**
     * Inicia sesión de usuario
     * @param email Correo electrónico
     * @param password Contraseña
     */
    static async login(
      email: string, 
      password: string
    ): Promise<{ success: boolean; error?: string }> {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
      } catch (error: any) {
        console.error('Login error:', error);
        return { 
          success: false, 
          error: this.handleAuthError(error) 
        };
      }
    }
  
    /**
     * Recuperación de contraseña
     * @param email Correo electrónico para recuperación
     */
    static async resetPassword(
      email: string
    ): Promise<{ success: boolean; error?: string }> {
      try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
      } catch (error: any) {
        console.error('Password reset error:', error);
        return { 
          success: false, 
          error: this.handleAuthError(error) 
        };
      }
    }
  
    /**
     * Cerrar sesión
     */
    static async logout(): Promise<void> {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  
    /**
     * Obtener datos de usuario desde Firestore
     * @param userId ID del usuario
     */
    static async getUserData(
      userId: string
    ): Promise<UserData | null> {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        
        if (userDoc.exists()) {
          return userDoc.data() as UserData;
        }
        
        return null;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    }
  
    /**
     * Manejo de errores de autenticación
     * @param error Error de Firebase Authentication
     */
    private static handleAuthError(error: any): string {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return 'El correo electrónico ya está registrado';
        case 'auth/invalid-email':
          return 'Correo electrónico inválido';
        case 'auth/weak-password':
          return 'La contraseña es muy débil';
        case 'auth/user-not-found':
          return 'Usuario no encontrado';
        case 'auth/wrong-password':
          return 'Contraseña incorrecta';
        case 'auth/too-many-requests':
          return 'Demasiados intentos. Intenta más tarde';
        default:
          return 'Error de autenticación';
      }
    }
  }
  
  export default AuthService;