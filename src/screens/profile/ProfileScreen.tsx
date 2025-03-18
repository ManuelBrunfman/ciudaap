// Ruta: src/screens/profile/ProfileScreen.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importamos SafeAreaView
import { View, Text } from 'react-native';

const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Pantalla de Perfil</Text>
    </SafeAreaView>
  );
};

export default ProfileScreen;
