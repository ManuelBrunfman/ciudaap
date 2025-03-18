import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, doc, setDoc, getDocs, deleteDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { firestore } from './config/firebaseConfig';
import noticiasData from './assets/noticias.json';

interface NewsItemData {
  title: string;
  img: string | null;
  description: string | null;
  link: string | null;
  createdAt: any;
}

const UploadNews: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const uploadData = async () => {
    setLoading(true);
    setError(null);
    setCompleted(false);
    
    try {
      console.log('Iniciando eliminación de documentos existentes en "news"...');
      const colRef = collection(firestore, 'news');
      const querySnapshot = await getDocs(colRef);
      
      if (!querySnapshot.empty) {
        const batch = writeBatch(firestore);
        querySnapshot.forEach((docSnap) => {
          batch.delete(doc(firestore, 'news', docSnap.id));
        });
        await batch.commit();
        console.log(`Eliminados ${querySnapshot.size} documentos existentes.`);
      }
      
      let uploadedCount = 0;
      const total = noticiasData.length;
      console.log(`Total de noticias a subir: ${total}`);
      
      for (const noticiaOriginal of noticiasData) {
        // Transformamos los datos usando las propiedades correctas del JSON
        const noticia: NewsItemData = {
          title: noticiaOriginal.title,
          img: noticiaOriginal.image,
          description: noticiaOriginal.description,
          link: noticiaOriginal.url,
          createdAt: serverTimestamp()
        };
        
        // Generamos un ID único a partir del título
        const docId = noticiaOriginal.title
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .slice(0, 40);
          
        console.log(`Subiendo noticia: ${noticia.title} (ID: ${docId})`);
        await setDoc(doc(colRef, docId), noticia);
        uploadedCount++;
        
        if (uploadedCount % 5 === 0) {
          console.log(`Progreso: ${uploadedCount}/${total}`);
        }
      }
      
      console.log(`✅ Subidas ${uploadedCount} noticias a Firestore`);
      setCount(uploadedCount);
      setCompleted(true);
    } catch (error) {
      console.error('Error al subir noticias:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Importación de Noticias</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Procesando...</Text>
        </View>
      ) : (
        <>
          {completed && (
            <Text style={styles.successText}>
              ✅ {count} noticias disponibles en Firestore
            </Text>
          )}
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          <Button 
            title={completed ? "Verificar Datos" : "Importar Noticias"} 
            onPress={uploadData} 
          />
          <Text style={styles.note}>
            Nota: Este componente se utiliza solo durante el desarrollo.
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  successText: {
    color: 'green',
    marginVertical: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  note: {
    marginTop: 20,
    fontStyle: 'italic',
    color: '#666',
  }
});

export default UploadNews;
