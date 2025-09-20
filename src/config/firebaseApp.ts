import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import type { ReactNativeFirebase } from '@react-native-firebase/app';
import googleServices from '../../credentials/google-services.json';

let cachedApp: ReactNativeFirebase.FirebaseApp | null = null;

// Extrae opciones compatibles desde google-services.json (Android)
function getFirebaseOptions(): ReactNativeFirebase.FirebaseAppOptions | undefined {
  try {
    const projectInfo = (googleServices as any)?.project_info || {};
    const client0 = (googleServices as any)?.client?.[0] || {};
    const clientInfo = client0.client_info || {};

    const appId = clientInfo.mobilesdk_app_id;
    const apiKey = client0.api_key?.[0]?.current_key;
    const databaseURL = projectInfo.firebase_url;
    const projectId = projectInfo.project_id;
    const storageBucket = projectInfo.storage_bucket;
    const messagingSenderId = projectInfo.project_number; // En Android coincide con project_number

    if (!appId || !apiKey || !projectId || !storageBucket || !messagingSenderId || !databaseURL) {
      return undefined;
    }

    return {
      appId,
      apiKey,
      projectId,
      storageBucket,
      messagingSenderId,
      databaseURL,
    } as ReactNativeFirebase.FirebaseAppOptions;
  } catch {
    return undefined;
  }
}

/**
 * Garantiza una instancia por defecto de Firebase (RNFirebase) de forma segura.
 * - Primero intenta devolver la app nativa (si ya fue creada por Android/iOS).
 * - Si no existe, inicializa usando las opciones derivadas de `credentials/google-services.json`.
 */
export function getFirebaseApp(): ReactNativeFirebase.FirebaseApp {
  if (cachedApp) return cachedApp;

  try {
    // Caso ideal: ya existe la app por configuración nativa
    cachedApp = getApp();
    return cachedApp;
  } catch {
    // No hay app nativa; inicializamos manualmente con opciones explícitas
    const options = getFirebaseOptions();
    if (!options) {
      throw new Error(
        "Firebase default app not found and google-services.json options are incomplete. Verifica que 'credentials/google-services.json' exista y tenga los campos requeridos."
      );
    }
    // initializeApp es async internamente, pero registra la app inmediatamente en el registro JS.
    // Podemos ignorar la Promise y obtener la app sincrónicamente.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initializeApp(options);
    cachedApp = getApp();
    return cachedApp;
  }
}

