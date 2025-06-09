import { useEffect, useState } from 'react';
// CAMBIO: import correcto para Firestore en React Native Firebase
import firestore from '@react-native-firebase/firestore';

type Benefit = {
  id: string;
  title: string;
  description: string;
  [key: string]: any;
};

export function useBenefits() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Suscribirse a la colección 'benefits' de Firestore
    const unsubscribe = firestore()
      .collection('benefits')
      .onSnapshot(
        snapshot => {
          const data: Benefit[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Benefit[];
          setBenefits(data);
          setLoading(false);
        },
        error => {
          console.log('Error al obtener beneficios:', error);
          setLoading(false);
        }
      );

    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  return { benefits, loading };
}
