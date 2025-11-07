/**
 * Centralized error handling utility
 * Provides consistent error handling across the app
 */

import { Alert } from 'react-native';
import logger from './logger';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

class ErrorHandler {
  /**
   * Shows user-friendly error messages
   */
  showError(title: string, message: string) {
    Alert.alert(title, message);
  }

  /**
   * Shows success messages
   */
  showSuccess(title: string, message: string) {
    Alert.alert(title, message);
  }

  /**
   * Handles Firebase authentication errors
   */
  handleAuthError(error: any): string {
    logger.error('Auth error', error);
    
    switch (error.code) {
      case 'auth/invalid-email':
        return 'El email no es válido';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
        return 'Usuario o clave incorrecta';
      case 'auth/email-already-in-use':
        return 'El email ya está en uso';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu internet';
      default:
        return error.message || 'Error de autenticación';
    }
  }

  /**
   * Handles Firestore errors
   */
  handleFirestoreError(error: any): string {
    logger.error('Firestore error', error);
    
    switch (error.code) {
      case 'permission-denied':
        return 'No tienes permisos para realizar esta acción';
      case 'unavailable':
        return 'Servicio no disponible. Intenta más tarde';
      case 'unauthenticated':
        return 'Debes iniciar sesión';
      default:
        return 'Error en la base de datos';
    }
  }

  /**
   * Generic error handler
   */
  handleError(error: any, fallbackMessage: string = 'Ocurrió un error inesperado'): void {
    logger.error('Unhandled error', error);
    
    let message = fallbackMessage;
    
    if (error?.code?.startsWith('auth/')) {
      message = this.handleAuthError(error);
    } else if (error?.code?.startsWith('firestore/')) {
      message = this.handleFirestoreError(error);
    } else if (error?.message) {
      message = error.message;
    }
    
    this.showError('Error', message);
  }
}

export const errorHandler = new ErrorHandler();
export default errorHandler;