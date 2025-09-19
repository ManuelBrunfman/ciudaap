import React, { useMemo, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme, type AppTheme } from '../../theme';
import AppText from '../../ui/AppText';
import AppButton from '../../ui/AppButton';
import errorHandler from '../../utils/errorHandler';

const { width } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const t = useTheme();
  const styles = useMemo(() => createStyles(t), [t]);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      errorHandler.handleError(error, 'Error al iniciar sesión');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('PasswordReset' as never);
  };

  const handleSignUp = () => {
    navigation.navigate('Register' as never);
  };

  try {
    return (
      <ImageBackground source={require('../../../assets/bg.webp')} style={styles.background} resizeMode="cover">
        <LinearGradient colors={['transparent', t.colors.overlayStrong]} style={styles.gradientOverlay} />
        <View style={styles.container}>
          <ImageBackground source={require('../../../assets/splash-icon.png')} style={styles.logo} resizeMode="contain" />
          <AppText variant="heading1" color={t.colors.onBackground} style={styles.title}>
            Bancaap Ciudad
          </AppText>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: t.colors.background,
                    color: t.colors.onBackground,
                    shadowColor: t.colors.overlay,
                    borderColor: t.colors.border,
                  },
                ]}
                placeholder="Correo"
                placeholderTextColor={t.colors.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: t.colors.background,
                    color: t.colors.onBackground,
                    shadowColor: t.colors.overlay,
                    borderColor: t.colors.border,
                  },
                ]}
                placeholder="Contraseña"
                placeholderTextColor={t.colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity onPress={handleForgotPassword}>
              <AppText variant="caption" color={t.colors.primary} style={styles.forgotPassword}>
                Olvidé mi contraseña
              </AppText>
            </TouchableOpacity>
            <View style={styles.buttonGroup}>
              <AppButton title="Entrar" onPress={handleLogin} variant="filled" style={styles.button} />
              <AppButton title="Registrarse" onPress={handleSignUp} variant="outline" style={styles.button} />
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  } catch (error: any) {
    console.error('Error en LoginScreen:', error);
    return (
      <View style={styles.errorContainer}>
        <AppText variant="subtitle" color={t.colors.danger} style={styles.centerText}>
          Ocurrió un error al cargar la pantalla de inicio de sesión.
        </AppText>
      </View>
    );
  }
};

export default LoginScreen;

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    gradientOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: t.spacing.lg,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: t.spacing.lg,
    },
    title: {
      marginBottom: t.spacing.lg,
      textShadowColor: t.colors.overlay,
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    form: {
      width: '100%',
      alignItems: 'center',
    },
    inputGroup: {
      width: width * 0.8,
      marginBottom: t.spacing.md + t.spacing.xs,
    },
    input: {
      width: '100%',
      padding: t.spacing.md,
      borderRadius: t.radius.xl,
      borderWidth: 1,
      fontSize: t.typography.body.fontSize,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 5,
      elevation: t.elevation.sm,
    },
    forgotPassword: {
      marginTop: t.spacing.xs,
      textDecorationLine: 'underline',
    },
    buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: t.spacing.md + t.spacing.xs,
    },
    button: {
      width: 140,
      marginHorizontal: t.spacing.xs,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: t.spacing.lg,
      backgroundColor: t.colors.background,
    },
    centerText: {
      textAlign: 'center',
    },
  });
