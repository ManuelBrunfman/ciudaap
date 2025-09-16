import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '../../theme/spacing';
import { useTheme } from '../../theme';
import AppText from '../../ui/AppText';
import AppButton from '../../ui/AppButton';

const { width } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const t = useTheme();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      // El RootNavigator se encargará de redirigir si el usuario está autenticado
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión');
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
      <ImageBackground
        source={require('../../../assets/bg.webp')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Overlay de gradiente */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradientOverlay}
        />
        <View style={styles.container}>
          {/* Logo opcional */}
          <ImageBackground
            source={require('../../../assets/splash-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <AppText variant="heading2" style={[styles.title, { color: t.colors.onBackground }]}>Bancaap Ciudad</AppText>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: t.colors.background, color: t.colors.onBackground, shadowColor: t.colors.onBackground },
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
                  { backgroundColor: t.colors.background, color: t.colors.onBackground, shadowColor: t.colors.onBackground },
                ]}
                placeholder="Contraseña"
                placeholderTextColor={t.colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity onPress={handleForgotPassword}>
              <AppText style={[styles.forgotPassword, { color: t.colors.primary }]}>Olvidé mi contraseña</AppText>
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
    console.error("Error en LoginScreen:", error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppText style={{ color: t.colors.danger, fontSize: 20, textAlign: 'center' }}>
          Ocurrió un error al cargar la pantalla de inicio de sesión.
        </AppText>
      </View>
    );
  }
};

export default LoginScreen;

const styles = StyleSheet.create({
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
    paddingHorizontal: spacing.lg,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: spacing.lg,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  inputGroup: {
    width: width * 0.8,
    marginBottom: spacing.md + spacing.xs,
  },
  input: {
    width: '100%',
    padding: spacing.md,
    borderRadius: 25,
    fontSize: 16,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  forgotPassword: {
    fontSize: 14,
    marginTop: spacing.xs,
    textDecorationLine: 'underline',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md + spacing.xs,
  },
  button: { width: 140, marginHorizontal: spacing.xs },
});
