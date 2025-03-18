// src/services/StorageService.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebaseConfig';

class StorageService {
  /**
   * Sube un archivo a Firebase Storage y retorna la URL de descarga.
   * @param path Ruta donde se almacenará el archivo.
   * @param file Blob o File a subir.
   * @returns URL de descarga del archivo subido.
   */
  static async uploadFile(path: string, file: Blob): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error('Error al subir archivo:', error);
      throw error;
    }
  }
}

export default StorageService;
