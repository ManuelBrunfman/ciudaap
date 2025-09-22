import React from 'react';
import { View, StyleSheet, Linking, Alert, TouchableOpacity } from 'react-native';
import AppText from '../../ui/AppText';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import AppButton from '../../ui/AppButton';
import { Ionicons } from '@expo/vector-icons';

// WhatsApp functionality (commented out as requested)
// const numero = '5491158178508';
// const mensaje = 'Hola, me quiero contactar con alguien de la gremial.';
// const abrirWhatsApp = () => {
//   const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
//   Linking.openURL(url);
// };

const phoneNumber = '4329-8549';
const email = 'cgi@bancociudad.com.ar';
const facebookUrl = 'https://www.facebook.com/tugremialbancociudad';
const instagramUrl = 'https://www.instagram.com/tugremialbancociudad';

const makePhoneCall = () => {
  const phoneUrl = `tel:${phoneNumber}`;
  Linking.openURL(phoneUrl).catch((err) => {
    console.error('Error opening phone:', err);
    Alert.alert('Error', 'No se pudo abrir la aplicación de teléfono');
  });
};

const sendEmail = () => {
  const emailUrl = `mailto:${email}?subject=Consulta%20desde%20la%20app&body=Hola,%20me%20quiero%20contactar%20con%20la%20gremial.`;
  Linking.openURL(emailUrl).catch((err) => {
    console.error('Error opening email:', err);
    Alert.alert('Error', 'No se pudo abrir la aplicación de email');
  });
};

const openFacebook = () => {
  Linking.openURL(facebookUrl).catch((err) => {
    console.error('Error opening Facebook:', err);
    Alert.alert('Error', 'No se pudo abrir Facebook');
  });
};

const openInstagram = () => {
  Linking.openURL(instagramUrl).catch((err) => {
    console.error('Error opening Instagram:', err);
    Alert.alert('Error', 'No se pudo abrir Instagram');
  });
};

const ContactScreen: React.FC = () => {
  const t = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={styles.content}>
        <AppText style={[styles.title, { color: t.colors.onBackground }]}>Contacto Gremial</AppText>
        <AppText style={[styles.subtitle, { color: t.colors.muted }]}>
          Podés comunicarte con nosotros por teléfono o email.
        </AppText>
      </View>

      <View style={[styles.bottomBar, { backgroundColor: 'transparent' }]}>
        <View style={styles.buttonsContainer}>
          {/* Contact Section Title */}
          <AppText style={[styles.sectionTitle, { color: t.colors.onBackground }]}>
            Contacto directo
          </AppText>

          {/* Phone Button */}
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: t.colors.primary }]}
            onPress={makePhoneCall}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="call"
                size={24}
                color={t.colors.onPrimary}
                style={styles.buttonIcon}
              />
              <View style={styles.buttonTextContainer}>
                <AppText style={[styles.buttonLabel, { color: t.colors.onPrimary }]}>
                  Llamar
                </AppText>
                <AppText style={[styles.buttonValue, { color: t.colors.onPrimary }]}>
                  {phoneNumber}
                </AppText>
              </View>
            </View>
          </TouchableOpacity>

          {/* Email Button */}
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: '#0066cc' }]}
            onPress={sendEmail}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="mail"
                size={24}
                color="white"
                style={styles.buttonIcon}
              />
              <View style={styles.buttonTextContainer}>
                <AppText style={[styles.buttonLabel, { color: 'white' }]}>
                  Email
                </AppText>
                <AppText style={[styles.buttonValue, { color: 'white' }]}>
                  {email}
                </AppText>
              </View>
            </View>
          </TouchableOpacity>

          {/* Facebook Button */}
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: '#1877f2' }]}
            onPress={openFacebook}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="logo-facebook"
                size={24}
                color="white"
                style={styles.buttonIcon}
              />
              <View style={styles.buttonTextContainer}>
                <AppText style={[styles.buttonLabel, { color: 'white' }]}>
                  Facebook
                </AppText>
                <AppText style={[styles.buttonValue, { color: 'white' }]}>
                  tugremialbancociudad
                </AppText>
              </View>
            </View>
          </TouchableOpacity>

          {/* Instagram Button */}
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: '#E4405F' }]}
            onPress={openInstagram}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="logo-instagram"
                size={24}
                color="white"
                style={styles.buttonIcon}
              />
              <View style={styles.buttonTextContainer}>
                <AppText style={[styles.buttonLabel, { color: 'white' }]}>
                  Instagram
                </AppText>
                <AppText style={[styles.buttonValue, { color: 'white' }]}>
                  tugremialbancociudad
                </AppText>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Commented WhatsApp button */}
        {/* <View style={styles.ctaWrap}>
          <AppButton
            title="Contactar por WhatsApp"
            onPress={abrirWhatsApp}
            variant="filled"
            style={styles.button}
          />
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg
  },
  title: {
    ...typography.heading2,
    marginBottom: spacing.md,
    textAlign: 'center'
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomBar: {
    width: '100%',
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '700',
    marginBottom: spacing.lg,
    textAlign: 'center',
    fontSize: 16,
  },
  contactButton: {
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonIcon: {
    marginRight: spacing.md,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonLabel: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  buttonValue: {
    ...typography.caption,
    opacity: 0.9,
  },
  // Commented styles for WhatsApp button
  // ctaWrap: { width: '100%', alignItems: 'center' },
  // button: { width: 320, maxWidth: '100%' },
});
