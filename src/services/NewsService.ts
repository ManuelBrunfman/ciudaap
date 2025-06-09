// src/services/NewsService.ts

// 👉 Importación de la API modular de Firestore
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from '@react-native-firebase/firestore';

class NewsService {
  /**
   * Obtiene todas las noticias ordenadas por fecha de creación descendente.
   */
  async getAllNews() {
    const db = getFirestore();
    // Referencia a la colección “news”
    const newsCol = collection(db, 'news');
    // Creamos la query modular con orderBy
    const q = query(newsCol, orderBy('createdAt', 'desc'));
    // Ejecutamos la query
    const snapshot = await getDocs(q);
    // Mapear cada documento a un objeto JS
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}

export default new NewsService();
