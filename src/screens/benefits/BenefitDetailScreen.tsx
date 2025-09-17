import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme, type AppTheme } from '../../theme';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/RootStackParamList';

type Props = StackScreenProps<RootStackParamList, 'BenefitDetail'>;

const BenefitDetailScreen: React.FC<Props> = ({ route }) => {
  const { url } = route.params;
  const t = useTheme();
  const styles = useMemo(() => createStyles(t), [t]);

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url }} style={styles.webview} />
    </View>
  );
};

export default BenefitDetailScreen;

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    webview: {
      backgroundColor: 'transparent',
    },
  });
