import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import AppText from '../../ui/AppText';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import AppButton from '../../ui/AppButton';

const numero = '5491158178508';
const mensaje = 'Hola, me quiero contactar con alguien de la gremial.';

const abrirWhatsApp = () => {
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  Linking.openURL(url);
};

const ContactScreen: React.FC = () => {
  const t = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={styles.content}>
        <AppText style={[styles.title, { color: t.colors.onBackground }]}>Contacto Gremial</AppText>
        <AppText style={[styles.subtitle, { color: t.colors.muted }]}>
          Si necesitás ayuda o querés comunicarte con la gremial, presioná el botón de WhatsApp abajo.
        </AppText>
      </View>

      <View style={[styles.bottomBar, { borderTopColor: t.colors.border, backgroundColor: 'transparent' }]}>
        <View style={styles.ctaWrap}>
          <AppButton
            title="Contactar por WhatsApp"
            onPress={abrirWhatsApp}
            variant="filled"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.lg },
  title: { ...typography.heading2, marginBottom: spacing.md, textAlign: 'center' },
  subtitle: { ...typography.body, textAlign: 'center' },
  bottomBar: { width: '100%', padding: spacing.md, borderTopWidth: 1, alignItems: 'center', justifyContent: 'center' },
  ctaWrap: { width: '100%', alignItems: 'center' },
  button: { width: 320, maxWidth: '100%' },
});
