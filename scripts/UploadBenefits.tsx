import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { getFirestore, collection, doc, setDoc, getDocs, query, limit } from '@react-native-firebase/firestore';

interface Beneficio {
  titulo: string;
  link: string;
  imagen_url: string;
  categoria?: string;
  provincia?: string;
}

import beneficiosData from '../assets/beneficios.json';

const UploadBenefits: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [alreadyExists, setAlreadyExists] = useState(false);

  const uploadData = async () => {
    setLoading(true);
    setError(null);
    setCompleted(false);
    setAlreadyExists(false);

    try {
      console.log('Iniciando subida de beneficios a Firestore con API modular...');
      const db = getFirestore();
      const colRef = collection(db, 'beneficios');
      // 👇 Ahora sí: query para limitar la búsqueda a 1 doc
      const colQuery = query(colRef, limit(1));
      const querySnapshot = await getDocs(colQuery);
      if (!querySnapshot.empty) {
        const existingDocsCount = (await getDocs(colRef)).size;
        setCount(existingDocsCount);
        setCompleted(true);
        setAlreadyExists(true);
        setLoading(false);
        return;
      }

      let uploadedCount = 0;
      const beneficiosArray = beneficiosData as Beneficio[];
      const total = beneficiosArray.length;

      if (total === 0) {
        setError('El archivo JSON está vacío.');
        setLoading(false);
        return;
      }

      for (const beneficio of beneficiosArray) {
        if (typeof beneficio.titulo !== 'string' || beneficio.titulo.trim() === '') continue;

        const docId = beneficio.titulo
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 50);

        if (docId === '') continue;

        await setDoc(doc(colRef, docId), beneficio);
        uploadedCount++;

        if (uploadedCount % 10 === 0 || uploadedCount === total) {
          console.log(`Progreso: ${uploadedCount}/${total} beneficios subidos.`);
        }
      }

      setCount(uploadedCount);
      setCompleted(true);
    } catch (e: any) {
      let errorMessage = 'Error desconocido.';
      if (e.message) errorMessage = e.message;
      if (e.code) errorMessage += ` (Código: ${e.code})`;
      setError(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Importación de Beneficios a Firestore</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Subiendo datos...</Text>
        </View>
      ) : (
        <>
          {completed && (
            <Text style={styles.successText}>
              ✅ { alreadyExists
                    ? `${count} beneficios ya existentes en Firestore.`
                    : `${count} beneficios fueron cargados exitosamente.`
                 }
            </Text>
          )}

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <Button
            title={alreadyExists || (completed && count > 0) ? "Datos Verificados/Cargados" : "Importar Beneficios"}
            onPress={uploadData}
            disabled={alreadyExists || (completed && count > 0)}
          />

          <Text style={styles.note}>
            Nota: Este componente es para desarrollo.
            Asegúrate de que el archivo './assets/beneficios.json' existe y está en la ruta correcta.
            Considéralo solo para la carga inicial de datos.
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
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#343a40',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#495057',
  },
  successText: {
    color: '#28a745',
    marginVertical: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#dc3545',
    marginVertical: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  note: {
    marginTop: 20,
    fontStyle: 'italic',
    color: '#6c757d',
    textAlign: 'center',
    fontSize: 12,
  }
});

export default UploadBenefits;
