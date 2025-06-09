// CAMBIO: import correcto para Firestore en React Native Firebase
import firestore from '@react-native-firebase/firestore';

class NewsService {
  // Devuelve todas las noticias, ordenadas por fecha de creación descendente
  async getAllNews() {
    const snapshot = await firestore()
      .collection('news')
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Otros métodos relacionados a noticias pueden agregarse aquí
}

export default new NewsService();
