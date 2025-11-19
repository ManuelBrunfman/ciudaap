// src/services/StorageService.ts

/**
 * Servicio de almacenamiento usando la API modular de React Native Firebase Storage.
 */

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@react-native-firebase/storage';
import { getFirebaseApp } from '@/config/firebaseApp';

class StorageService {
  /**
   * Sube un archivo local (URI) a Firebase Storage y devuelve la URL de descarga.
   * @param path Ruta en el bucket donde guardar el archivo.
   * @param file Objeto con propiedad `uri` apuntando al archivo local.
   */
  async uploadFile(path: string, file: { uri: string }) {
    const storage = getStorage(getFirebaseApp());
    const storageRef = ref(storage, path);

    // fetch convierte URI en Blob para uploadBytes
    const response = await fetch(file.uri);
    const blob = await response.blob();

    // Subimos el blob
    await uploadBytes(storageRef, blob);

    // Devolvemos la URL pública
    return getDownloadURL(storageRef);
  }

  /**
   * Obtiene la URL de descarga de un archivo ya existente en Firebase Storage.
   * @param path Ruta en el bucket (misma que usaste en upload).
   */
  async getFileUrl(path: string) {
    const storage = getStorage(getFirebaseApp());
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  }
}

export default new StorageService();
