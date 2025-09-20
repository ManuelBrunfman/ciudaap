import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import { chunkArray } from '../utils/chunkArray';
import logger from '../utils/logger';
import { getFirebaseApp } from '../config/firebaseApp';

interface Message {
  title: string;
  body: string;
}

export const sendPushToAdmins = async (msg: Message) => {
  const db = getFirestore(getFirebaseApp());
  const snap = await getDocs(collection(db, 'adminPushTokens'));
  const tokens = snap.docs
    .map(d => d.data().expoPushToken as string)
    .filter(Boolean);

  if (!tokens.length) return;

  const groups = chunkArray(tokens, 100);
  for (const group of groups) {
    const messages = group.map(token => ({
      to: token,
      sound: 'default',
      title: msg.title,
      body: msg.body,
      data: { type: 'affiliateRequest' },
    }));
    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messages),
      });
    } catch (err) {
      logger.error('Error enviando push', err);
    }
  }
};
