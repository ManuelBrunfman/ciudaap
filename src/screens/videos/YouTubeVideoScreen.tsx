// src/screens/videos/YouTubeVideoScreen.tsx

import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { WebView } from 'react-native-webview';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/RootStackParamList';

// Ajustá la ruta si tu archivo de tipos está en otra ubicación

type Props = StackScreenProps<RootStackParamList, 'YouTubeVideo'>;

export default function YouTubeVideoScreen({ route }: Props) {
  const { videoId } = route.params;
  const t = useTheme();

  return (
    <WebView
      source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
      style={{ flex: 1, backgroundColor: t.colors.background }}
      startInLoadingState
      renderLoading={() => <ActivityIndicator style={styles.loader} />}
      allowsFullscreenVideo
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center' },
});
