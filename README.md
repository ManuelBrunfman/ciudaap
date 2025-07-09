# BancaApp

Aplicación móvil desarrollada con **Expo** y **React Native Firebase** para gestionar beneficios, noticias y credenciales digitales.

---

## 📋 Requisitos previos

* Node.js (v14 o superior)
* npm o yarn
* Expo CLI instalado globalmente (`npm install -g expo-cli`)
* Archivos de configuración de Firebase:

  * **Android:** `google-services.json` en `/android/app/`
  * **iOS:** `GoogleService-Info.plist` en `/ios/`
* Variables de entorno en un archivo `.env` (no versionar)

---

## 🚀 Instalación

1. Clonar el repositorio:

   ```bash
   git clone <URL_DEL_REPO>
   cd BancaApp
   ```
2. Instalar dependencias:

   ```bash
   npm install
   # o con yarn
   yarn install
   ```

---

## 🔧 Configuración

1. Copiar los archivos de Firebase:

   * `google-services.json` → `/android/app/google-services.json`
   * `GoogleService-Info.plist` → `/ios/GoogleService-Info.plist`
2. Crear un archivo `.env` en la raíz con tus variables (ejemplo):

   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   ```
3. Asegurarse de que `.env` y archivos de Firebase **no** estén en control de versiones.

---

## 🚴‍♂️ Desarrollo

Iniciar el servidor de desarrollo:

```bash
npx expo start
```

* Escanear el QR con Expo Go o usar el Dev Client.
* Para limpiar caché: `npx expo start -c`.

---

## 📦 Build para producción

* Android:

  ```bash
  npx expo run:android
  ```
* iOS:

  ```bash
  npx expo run:ios
  ```

---

## 📂 Estructura del proyecto

```text
BancaApp/
├─ android/
├─ ios/
├─ src/
│  ├─ navigation/      # Stack y tab navigators
│  ├─ screens/         # Pantallas UI
│  ├─ services/        # Lógica de Firebase (auth, firestore, storage)
│  ├─ hooks/           # Custom hooks
│  ├─ types/           # Definición de tipos (RootStackParamList)
│  └─ utils/           # Funciones auxiliares
├─ assets/             # Imágenes y JSON estático
├─ scripts/            # Scripts de carga/automatización
├─ .env                # Variables de entorno (no versionar)
├─ app.config.ts       # Configuración Expo
├─ package.json
├─ package-lock.json
└─ README.md
```

---

## ⚙️ Políticas de control de versiones

* **Incluir** `package-lock.json` para builds reproducibles.
* **Excluir** del repositorio:

  * `.env`
  * `google-services.json`
  * `GoogleService-Info.plist`
  * `*.keystore`

---

## 🛣️ Navegación y Tipos

* El tipo de navegación principal (`RootStackParamList`) está en:

  ```typescript
  src/types/RootStackParamList.ts
  ```

  Todos los navigators importan ese tipo para tipado seguro.

---

## 🤝 Contribuciones

1. Forkear el repositorio y crear una rama.
2. Hacer cambios y escribir tests (si aplica).
3. Enviar Pull Request describiendo los cambios.

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.
## 📲 Notificaciones push para administradores

1. En Firestore, crea o edita el documento `users/{uid}` del administrador y establece `isAdmin: true`.
2. Desde la pestaña **Admin** dentro de la app, pulsa **Registrar mis notificaciones** para guardar el token de Expo.
3. Los usuarios pueden solicitar afiliación en la pestaña **Afíliate** y los administradores recibirán un aviso push.

Para desplegar las reglas de seguridad ejecuta:

```bash
firebase deploy --only firestore:rules
```
