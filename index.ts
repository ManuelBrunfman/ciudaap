// index.ts
// ──────────────────────────────────────────────
// ¡IMPORTS QUE DEBEN IR PRIMERO!
import 'react-native-gesture-handler'; // gestos nativos (Drawer, Stack, etc.)
import 'react-native-reanimated';      // reanimated (debe cargarse antes de RN)

// ─── Expo bootstrap ───────────────────────────
import { registerRootComponent } from 'expo';
import App from './App';

// Registra el componente raíz de la aplicación
registerRootComponent(App);
