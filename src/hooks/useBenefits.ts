// src/hooks/useBenefits.ts

import { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot } from '@react-native-firebase/firestore';

type Benefit = {
  id: string;
  [key: string]: any;
};

export function useBenefits() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const db = getFirestore();
    const benefitsRef = collection(db, 'benefits');

    // Suscripción modular sin tipados adicionales
    const unsubscribe = onSnapshot(
      benefitsRef,
      snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBenefits(data);
        setLoading(false);
      },
      error => {
        console.error('Error al obtener beneficios:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { benefits, loading };
}
