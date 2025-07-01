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
  // Lista de videos de un canal de YouTube
  YouTubeChannel: undefined;
  // Visualización de un video
  YouTubeVideo: { videoId: string };
};
