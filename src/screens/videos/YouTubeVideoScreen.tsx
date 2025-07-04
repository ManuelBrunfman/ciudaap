// src/screens/videos/YouTubeVideoScreen.tsx

import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/RootStackParamList';

// Ajustá la ruta si tu archivo de tipos está en otra ubicación

type Props = NativeStackScreenProps<RootStackParamList, 'YouTubeVideo'>;

export default function YouTubeVideoScreen({ route }: Props) {
  const { videoId } = route.params;

  return (
    <WebView
      source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
      style={{ flex: 1 }}
      startInLoadingState
      renderLoading={() => <ActivityIndicator style={styles.loader} />}
      allowsFullscreenVideo
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center' },
});
