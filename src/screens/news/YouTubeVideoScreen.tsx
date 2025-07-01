import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/RootStackParamList';

type Props = NativeStackScreenProps<RootStackParamList, 'YouTubeVideo'>;

const YouTubeVideoScreen: React.FC<Props> = ({ route }) => {
  const { videoId } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <WebView source={{ uri: `https://www.youtube.com/embed/${videoId}` }} style={styles.web} />
    </SafeAreaView>
  );
};

export default YouTubeVideoScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  web: { flex: 1 }
});
