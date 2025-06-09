// CAMBIO: import correcto para Firestore en React Native Firebase
import firestore from '@react-native-firebase/firestore';

class BenefitsService {
  // Devuelve todos los beneficios de la colección 'benefits'
  async getBenefits() {
    const snapshot = await firestore().collection('benefits').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Otros métodos relacionados a beneficios podrían agregarse aquí
}

export default new BenefitsService();
