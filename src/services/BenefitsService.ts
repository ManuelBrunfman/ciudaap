// src/services/BenefitsService.ts

// ðŸ‘‰ Importamos la API modular de Firestore
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import { getFirebaseApp } from '@/config/firebaseApp';

class BenefitsService {
  /**
   * Obtiene la lista completa de beneficios desde Firestore
   */
  async getBenefits() {
    const db = getFirestore(getFirebaseApp());
    const benefitsCol = collection(db, 'benefits');

    // Ejecutamos la query modular
    const snapshot = await getDocs(benefitsCol);

    // Mapeamos los documentos a un array de beneficios
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}

export default new BenefitsService();
