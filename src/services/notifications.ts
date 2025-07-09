import * as Notifications from 'expo-notifications';

export const requestPushPermission = async (): Promise<string> => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permiso denegado');
  }
  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
};
