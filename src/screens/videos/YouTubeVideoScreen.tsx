// src/screens/videos/YouTubeVideoScreen.tsx

import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme, type AppTheme } from '../../theme';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/RootStackParamList';

type Props = StackScreenProps<RootStackParamList, 'YouTubeVideo'>;

export default function YouTubeVideoScreen({ route }: Props) {
  const { videoId } = route.params;
  const t = useTheme();
  const styles = useMemo(() => createStyles(t), [t]);

  return (
    <WebView
      source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
      style={styles.webview}
      startInLoadingState
      renderLoading={() => (
        <ActivityIndicator style={styles.loader} size="large" color={t.colors.primary} />
      )}
      allowsFullscreenVideo
    />
  );
}

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    webview: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
  });
