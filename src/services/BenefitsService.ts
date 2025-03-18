// src/services/BenefitsService.ts
import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc
  } from 'firebase/firestore';
  import { firestore } from '../../config/firebaseConfig';
  
  export interface Benefit {
    id?: string;
    title: string;
    description: string;
    imageUrl?: string;
    createdAt?: Date;
  }
  
  class BenefitsService {
    static async getAllBenefits(): Promise<Benefit[]> {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'benefits'));
        const benefits: Benefit[] = [];
        querySnapshot.forEach((docSnap) => {
          benefits.push({ id: docSnap.id, ...docSnap.data() } as Benefit);
        });
        return benefits;
      } catch (error) {
        console.error('Error al obtener beneficios:', error);
        throw error;
      }
    }
  
    static async getBenefitById(id: string): Promise<Benefit | null> {
      try {
        const benefitDoc = await getDoc(doc(firestore, 'benefits', id));
        if (benefitDoc.exists()) {
          return benefitDoc.data() as Benefit;
        }
        return null;
      } catch (error) {
        console.error('Error al obtener beneficio por id:', error);
        throw error;
      }
    }
  
    static async createBenefit(benefit: Benefit): Promise<string> {
      try {
        const docRef = await addDoc(collection(firestore, 'benefits'), {
          ...benefit,
          createdAt: new Date()
        });
        return docRef.id;
      } catch (error) {
        console.error('Error al crear beneficio:', error);
        throw error;
      }
    }
  
    static async updateBenefit(id: string, benefit: Partial<Benefit>): Promise<void> {
      try {
        await updateDoc(doc(firestore, 'benefits', id), benefit);
      } catch (error) {
        console.error('Error al actualizar beneficio:', error);
        throw error;
      }
    }
  
    static async deleteBenefit(id: string): Promise<void> {
      try {
        await deleteDoc(doc(firestore, 'benefits', id));
      } catch (error) {
        console.error('Error al eliminar beneficio:', error);
        throw error;
      }
    }
  }
  
  export default BenefitsService;
  