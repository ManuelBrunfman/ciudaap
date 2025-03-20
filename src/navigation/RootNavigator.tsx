// src/navigation/RootNavigator.tsx

import React from 'react';

import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

import AuthNavigator from './AuthNavigator';

import AppNavigator from './AppNavigator';



const RootNavigator: React.FC = () => {

  const { user, loading } = useAuth();



  if (loading) {

    return (

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

        <ActivityIndicator size="large" />

      </View>

    );

  }

  

  return user ? <AppNavigator /> : <AuthNavigator />;

};



export default RootNavigator;

