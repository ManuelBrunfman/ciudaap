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
import * as colors from '../../theme/colors';

const { width } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
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
          <Text style={styles.title}>La Bancaria</Text>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Correo"
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Olvidé mi contraseña</Text>
            </TouchableOpacity>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={handleLogin}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  <Text style={styles.buttonText}>Entrar</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={handleSignUp}
              >
                <LinearGradient
                  colors={[colors.secondary, colors.secondaryDark]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  <Text style={styles.buttonText}>Registrarse</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  } catch (error: any) {
    console.error('Error en LoginScreen:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 20, textAlign: 'center' }}>
          Ocurrió un error al cargar la pantalla de inicio de sesión.
        </Text>
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
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 20,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  inputGroup: {
    width: width * 0.8,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 25,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.text,
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  forgotPassword: {
    color: colors.link,
    fontSize: 14,
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  button: {
    width: 120,
    borderRadius: 25,
    overflow: 'hidden',
    marginHorizontal: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
});
