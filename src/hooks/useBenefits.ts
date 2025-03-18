import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';

interface Benefit {
  id: string;
  title: string;
  description: string;
  // Otros campos que tenga cada beneficio
}

const useBenefits = () => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const benefitsCollection = collection(firestore, 'benefits');
        const snapshot = await getDocs(benefitsCollection);
        const benefitsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Benefit[];
        setBenefits(benefitsList);
      } catch (err: any) {
        console.error('Error fetching benefits:', err);
        setError('Error al cargar los beneficios');
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  return { benefits, loading, error };
};

export default useBenefits;
