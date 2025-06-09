// CAMBIO: import correcto para Storage en React Native Firebase
import storage from '@react-native-firebase/storage';

class StorageService {
  // Sube un archivo y devuelve la URL de descarga
  async uploadFile(path: string, file: any) {
    const ref = storage().ref(path);
    await ref.putFile(file.uri);
    return await ref.getDownloadURL();
  }

  // Devuelve la URL de descarga de un archivo existente
  async getFileUrl(path: string) {
    return await storage().ref(path).getDownloadURL();
  }

  // Otros métodos relacionados a storage pueden agregarse aquí
}

export default new StorageService();
