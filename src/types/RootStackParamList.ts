// src/types/RootStackParamList.ts

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  img?: string;
  link?: string;
  createdAt: any;
}

export type RootStackParamList = {
  Main: undefined;
  BenefitDetail: { url: string };
  NewsDetail: { newsItem: NewsItem };
  YouTubeChannel: undefined;
  SergioPalazzoInterviews: undefined;
  YouTubeVideo: { videoId: string };
  Profile: undefined;        // 👈 agregar esta línea
  ForceLogout: undefined;    // 👈 ya lo tenías
};
