// src/screens/videos/YouTubeVideoScreen.tsx

import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';

type Props = NativeStackScreenProps<RootStackParamList, 'YouTubeVideo'>;

export default function YouTubeVideoScreen({ route }: Props) {
  const { videoId } = route.params;

  return (
    <WebView
      source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
      allowsFullscreenVideo
      startInLoadingState
      renderLoading={() => <ActivityIndicator style={styles.loader} size="large" />}
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1 },
});
