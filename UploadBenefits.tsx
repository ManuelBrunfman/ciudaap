


import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { firestore } from './config/firebaseConfig';

// Asume que tienes este tipo de datos en tu JSON
interface Beneficio {
  titulo: string;
  link: string;
  imagen_url: string;
  categoria?: string;
  provincia?: string;
}

// Importa tu JSON (ajusta la ruta según donde tengas el archivo)
import beneficiosData from './assets/beneficios.json';

const UploadBenefits: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const uploadData = async () => {
    setLoading(true);
    setError(null);
    setCompleted(false);
    
    try {
      console.log('Iniciando subida de beneficios a Firestore...');
      const colRef = collection(firestore, 'beneficios');
      
      // Verificar si ya existen datos
      const querySnapshot = await getDocs(colRef);
      if (!querySnapshot.empty) {
        console.log(`Ya existen ${querySnapshot.size} documentos en la colección`);
        setCount(querySnapshot.size);
        setCompleted(true);
        setLoading(false);
        return;
      }
      
      // Proceder con la carga
      let uploadedCount = 0;
      const total = (beneficiosData as Beneficio[]).length;
      
      for (const beneficio of beneficiosData as Beneficio[]) {
        const docId = beneficio.titulo
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .slice(0, 40);
          
        await setDoc(doc(colRef, docId), beneficio);
        uploadedCount++;
        
        if (uploadedCount % 10 === 0) {
          console.log(`Progreso: ${uploadedCount}/${total}`);
        }
      }
      
      console.log(`✅ Subidos ${uploadedCount} beneficios a Firestore`);
      setCount(uploadedCount);
      setCompleted(true);
    } catch (error) {
      console.error('Error al subir beneficios:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Importación de Beneficios</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Subiendo datos a Firestore...</Text>
        </View>
      ) : (
        <>
          {completed && (
            <Text style={styles.successText}>
              ✅ {count} beneficios disponibles en Firestore
            </Text>
          )}
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <Button 
            title={completed ? "Verificar Datos" : "Importar Beneficios"} 
            onPress={uploadData} 
          />
          
          <Text style={styles.note}>
            Nota: Este componente debe usarse solo durante el desarrollo.
            Quítalo de tu App.tsx después de importar los datos.
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

export default UploadBenefits; 
