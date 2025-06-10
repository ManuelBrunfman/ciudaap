import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
// Importación corregida para React Native Firebase Firestore
import firestore from '@react-native-firebase/firestore';
import { getFirestore } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
// No se necesita un archivo 'firebaseConfig.ts' o similar si @react-native-firebase/app
// está correctamente configurado con google-services.json (Android) y GoogleService-Info.plist (iOS).
// RNFB maneja la inicialización automáticamente.

// Define la estructura de un objeto Beneficio
interface Beneficio {
  titulo: string;
  link: string;
  imagen_url: string;
  categoria?: string;
  provincia?: string; // Campo añadido en nuestra conversación anterior
}

// Importa tus datos JSON.
// Asegúrate de que la ruta a 'beneficios.json' sea correcta.
// Ejemplo: si 'UploadBenefits.tsx' está en 'scripts/' y 'beneficios.json' en 'assets/',
// la ruta podría ser '../assets/beneficios.json'.
// Aquí se asume que está en una carpeta 'assets' relativa a este script.
import beneficiosData from '../assets/beneficios.json'; // AJUSTA ESTA RUTA SI ES NECESARIO

const UploadBenefits: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [alreadyExists, setAlreadyExists] = useState(false); // Estado para saber si los datos ya existían

  const uploadData = async () => {
    setLoading(true);
    setError(null);
    setCompleted(false);
    setAlreadyExists(false);

    try {
      console.log('Iniciando subida de beneficios a Firestore con RNFB...');
      // Referencia a la colección 'beneficios' en Firestore
      const colRef = getFirestore(getApp()).collection('beneficios');

      // Verificar si ya existen datos para no duplicar toda la carga
      const querySnapshot = await colRef.limit(1).get(); // Solo necesitamos saber si hay al menos un doc
      if (!querySnapshot.empty) {
        const existingDocsCount = (await colRef.get()).size; // Obtener el conteo real si no está vacío
        console.log(`Ya existen ${existingDocsCount} documentos en la colección 'beneficios'. No se subirán nuevos datos masivamente.`);
        setCount(existingDocsCount);
        setCompleted(true);
        setAlreadyExists(true); // Marcar que ya existían
        setLoading(false);
        return;
      }

      // Proceder con la carga si la colección está vacía
      let uploadedCount = 0;
      // Aseguramos que beneficiosData es un array de Beneficio
      const beneficiosArray = beneficiosData as Beneficio[];
      const total = beneficiosArray.length;

      if (total === 0) {
        console.log('El archivo beneficios.json está vacío. No hay datos para subir.');
        setError('El archivo JSON está vacío.');
        setLoading(false);
        return;
      }

      for (const beneficio of beneficiosArray) {
        // Validación: Asegurar que 'beneficio.titulo' es una cadena antes de procesarlo
        if (typeof beneficio.titulo !== 'string' || beneficio.titulo.trim() === '') {
          console.warn('Beneficio con título no válido o vacío omitido:', beneficio);
          continue; // Omitir este beneficio y continuar con el siguiente
        }

        // Crear un ID de documento más seguro y limpio
        const docId = beneficio.titulo
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
          .replace(/\s+/g, '-') // Reemplazar espacios con guiones
          .replace(/[^a-z0-9-]/g, '') // Eliminar caracteres no alfanuméricos excepto guiones
          .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
          .replace(/^-+|-+$/g, '') // Eliminar guiones al principio o al final
          .slice(0, 50); // Limitar longitud del ID (Firestore tiene un límite mayor, pero es buena práctica)

        if (docId === '') {
            console.warn('No se pudo generar un docId válido para el título:', beneficio.titulo, 'Beneficio omitido.');
            continue;
        }

        // Referencia al documento específico usando el docId generado
        // y subir (set) los datos del beneficio.
        await colRef.doc(docId).set(beneficio);
        uploadedCount++;

        // Mostrar progreso cada 10 subidas o al final
        if (uploadedCount % 10 === 0 || uploadedCount === total) {
          console.log(`Progreso: ${uploadedCount}/${total} beneficios subidos.`);
        }
      }

      console.log(`✅ Subidos ${uploadedCount} beneficios a Firestore.`);
      setCount(uploadedCount);
      setCompleted(true);
    } catch (e: any) { // Capturar cualquier tipo de error
      console.error('Error al subir beneficios con RNFB:', e);
      // Intentar dar un mensaje de error más específico si es posible
      let errorMessage = 'Error desconocido.';
      if (e.message) {
        errorMessage = e.message;
      }
      if (e.code) { // Errores de Firebase suelen tener un 'code'
        errorMessage += ` (Código: ${e.code})`;
      }
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
            disabled={alreadyExists || (completed && count > 0)} // Deshabilitar si ya existen o se completó la carga
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