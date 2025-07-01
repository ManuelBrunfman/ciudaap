// src/types/RootStackParamList.ts

// Tipo para las rutas principales del stack de navegación.
// Extendelo si agregás más pantallas que dependan de parámetros.
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  img?: string;
  link?: string;
  createdAt: any;
}

// Stack principal
export type RootStackParamList = {
  // En Main vive tu TabNavigator (pantallas principales)
  Main: undefined;
  // BenefitDetail recibe un 'url' para la WebView
  BenefitDetail: { url: string };
  // NewsDetail recibe un objeto newsItem
  NewsDetail: { newsItem: NewsItem };
  // Pantalla con el listado de videos del canal
  YouTubeChannel: undefined;
  // Pantalla que muestra un video específico
  YouTubeVideo: { videoId: string };
};
