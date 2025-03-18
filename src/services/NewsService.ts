// src/services/NewsService.ts
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
  
  export interface News {
    id?: string;
    title: string;
    content: string;
    imageUrl?: string;
    publishedAt?: Date;
  }
  
  class NewsService {
    static async getAllNews(): Promise<News[]> {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'news'));
        const newsList: News[] = [];
        querySnapshot.forEach((docSnap) => {
          newsList.push({ id: docSnap.id, ...docSnap.data() } as News);
        });
        return newsList;
      } catch (error) {
        console.error('Error al obtener noticias:', error);
        throw error;
      }
    }
  
    static async getNewsById(id: string): Promise<News | null> {
      try {
        const newsDoc = await getDoc(doc(firestore, 'news', id));
        if (newsDoc.exists()) {
          return newsDoc.data() as News;
        }
        return null;
      } catch (error) {
        console.error('Error al obtener noticia por id:', error);
        throw error;
      }
    }
  
    static async createNews(news: News): Promise<string> {
      try {
        const docRef = await addDoc(collection(firestore, 'news'), {
          ...news,
          publishedAt: new Date()
        });
        return docRef.id;
      } catch (error) {
        console.error('Error al crear noticia:', error);
        throw error;
      }
    }
  
    static async updateNews(id: string, news: Partial<News>): Promise<void> {
      try {
        await updateDoc(doc(firestore, 'news', id), news);
      } catch (error) {
        console.error('Error al actualizar noticia:', error);
        throw error;
      }
    }
  
    static async deleteNews(id: string): Promise<void> {
      try {
        await deleteDoc(doc(firestore, 'news', id));
      } catch (error) {
        console.error('Error al eliminar noticia:', error);
        throw error;
      }
    }
  }
  
  export default NewsService;
  