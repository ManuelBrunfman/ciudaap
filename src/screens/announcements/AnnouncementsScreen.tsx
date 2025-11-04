import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from '@react-native-firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { getFirebaseApp } from '../../config/firebaseApp';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import AppText from '../../ui/AppText';
import type { Announcement } from '../../types/RootStackParamList';

const getCreatedAtMillis = (value: Announcement['createdAt']): number => {
  if (!value) {
    return 0;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim().replace(/\s?(hs|hrs)$/i, '');
    const parsed = Date.parse(trimmed);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }

    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric)) {
      return numeric;
    }

    const localeMatch =
      /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(trimmed);

    if (localeMatch) {
      const [, dd, mm, yyyy, hh = '0', min = '0', ss = '0'] = localeMatch;
      const year = Number(yyyy.length === 2 ? `20${yyyy}` : yyyy);
      const month = Number(mm) - 1;
      const day = Number(dd);
      const hours = Number(hh);
      const minutes = Number(min);
      const seconds = Number(ss);

      const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
      return date.getTime();
    }
  }

  if (typeof value === 'object') {
    const potentialTimestamp = value as FirebaseFirestoreTypes.Timestamp;

    if (typeof potentialTimestamp.toDate === 'function') {
      return potentialTimestamp.toDate().getTime();
    }

    if (
      typeof potentialTimestamp.seconds === 'number' &&
      typeof potentialTimestamp.nanoseconds === 'number'
    ) {
      return potentialTimestamp.seconds * 1000 + potentialTimestamp.nanoseconds / 1e6;
    }
  }

  return 0;
};

const AnnouncementsScreen: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);
  const [webViewError, setWebViewError] = useState<string | null>(null);
  const t = useTheme();

  const palette = useMemo(
    () => ({
      surface: t.colors.surface,
      surfaceAlt: t.colors.surfaceAlt,
      title: t.colors.onBackground,
      muted: t.colors.muted,
      accent: t.colors.primary,
      accentOn: t.colors.onPrimary,
    }),
    [
      t.colors.muted,
      t.colors.onBackground,
      t.colors.onPrimary,
      t.colors.primary,
      t.colors.surface,
      t.colors.surfaceAlt,
    ],
  );

  useEffect(() => {
    const db = getFirestore(getFirebaseApp());
    const announcementsRef = collection(db, 'announcements');
    const announcementsQuery = query(announcementsRef, orderBy('createdAt', 'desc'));

    const handleSnapshot = (snap: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>) => {
      const items = snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Announcement, 'id'>),
      }));
      const sortedItems = [...items].sort(
        (a, b) => getCreatedAtMillis(b.createdAt) - getCreatedAtMillis(a.createdAt),
      );
      setAnnouncements(sortedItems as Announcement[]);
      setLoading(false);
    };

    const unsubscribe = onSnapshot(
      announcementsQuery,
      handleSnapshot,
      error => {
        console.error('Error al obtener los comunicados:', error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const getImageSource = useCallback((item: Announcement) => {
    return item.imageUrl || item.img || item.image || undefined;
  }, []);

  const getAnnouncementUrl = useCallback((item: Announcement) => {
    const candidate = item.fileUrl || item.link || item.url || item.imageUrl;
    if (candidate && /^https?:\/\//i.test(candidate)) {
      return candidate;
    }
    return null;
  }, []);

  const formatDate = useCallback((value: Announcement['createdAt']) => {
    if (!value) {
      return '';
    }

    try {
      if (typeof value === 'object' && typeof (value as any).toDate === 'function') {
        return (value as { toDate: () => Date }).toDate().toLocaleString('es-AR');
      }

      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleString('es-AR');
    } catch (error) {
      console.warn('No se pudo formatear la fecha del comunicado:', error);
      return '';
    }
  }, []);

  const handleOpen = useCallback(
    (item: Announcement) => {
      const url = getAnnouncementUrl(item);
      if (!url) {
        console.warn('Comunicado sin URL valido:', item);
        return;
      }

      setWebViewError(null);
      setActiveAnnouncement(item);
    },
    [getAnnouncementUrl, setActiveAnnouncement, setWebViewError],
  );
  const latestAnnouncement = announcements[0];
  const previousAnnouncements = useMemo(
    () => (announcements.length > 1 ? announcements.slice(1) : []),
    [announcements],
  );
  const handleCloseViewer = useCallback(() => {
    setActiveAnnouncement(null);
    setWebViewError(null);
  }, [setActiveAnnouncement, setWebViewError]);

  const activeUrl = activeAnnouncement ? getAnnouncementUrl(activeAnnouncement) : null;

  const header = useMemo(() => {
    if (!latestAnnouncement) {
      return <View style={styles.headerSpacing} />;
    }

    const image = getImageSource(latestAnnouncement);
    const url = getAnnouncementUrl(latestAnnouncement);
    const formattedDate = formatDate(latestAnnouncement.createdAt);

    return (
      <View style={styles.header}>
        <Pressable
          style={[styles.heroCard, !image && { backgroundColor: palette.surfaceAlt }]}
          onPress={url ? () => handleOpen(latestAnnouncement) : undefined}
          disabled={!url}
        >
          {image ? (
            <View style={styles.heroImageContainer}>
              <Image source={{ uri: image }} style={styles.heroImage} />
              <LinearGradient
                colors={[
                  'rgba(0, 0, 0, 0)',
                  'rgba(0, 0, 0, 0.25)',
                  'rgba(0, 0, 0, 0.7)',
                ]}
                locations={[0, 0.55, 1]}
                style={styles.heroGradient}
              />
              <View style={styles.heroOverlay}>
                <AppText style={[styles.heroLabel, { color: palette.accentOn }]}>Último comunicado</AppText>
                <AppText style={[styles.heroTitle, { color: palette.accentOn }]} numberOfLines={2}>
                  {latestAnnouncement.title}
                </AppText>
                {latestAnnouncement.description ? (
                  <AppText style={[styles.heroDescription, { color: palette.accentOn }]} numberOfLines={3}>
                    {latestAnnouncement.description}
                  </AppText>
                ) : null}
                {formattedDate ? (
                  <AppText style={[styles.heroDate, { color: palette.accentOn }]}>{formattedDate}</AppText>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={styles.heroFallback}>
              <AppText style={[styles.heroLabel, { color: palette.accent }]}>Último comunicado</AppText>
              <AppText style={[styles.heroTitle, { color: palette.title }]}>{latestAnnouncement.title}</AppText>
              {latestAnnouncement.description ? (
                <AppText style={[styles.heroDescription, { color: palette.muted }]}>
                  {latestAnnouncement.description}
                </AppText>
              ) : null}
              {formattedDate ? (
                <AppText style={[styles.heroDate, { color: palette.muted }]}>{formattedDate}</AppText>
              ) : null}
            </View>
          )}
        </Pressable>

        {previousAnnouncements.length > 0 ? (
          <AppText style={[styles.sectionTitle, { color: palette.title }]}>Comunicados anteriores</AppText>
        ) : null}
      </View>
    );
  }, [
    latestAnnouncement,
    getImageSource,
    getAnnouncementUrl,
    formatDate,
    handleOpen,
    palette.surfaceAlt,
    palette.accent,
    palette.accentOn,
    palette.title,
    palette.muted,
    previousAnnouncements.length,
  ]);

  const emptyComponent = useMemo(() => {
    if (latestAnnouncement) {
      return null;
    }

    return (
      <View style={styles.emptyState}>
        <AppText style={[styles.emptyTitle, { color: palette.title }]}>Sin comunicados</AppText>
        <AppText style={[styles.emptyDescription, { color: palette.muted }]}>
          Cuando publiquemos un nuevo comunicado, lo vas a ver automáticamente en esta pantalla.
        </AppText>
      </View>
    );
  }, [latestAnnouncement, palette.muted, palette.title]);

  const renderItem = useCallback(
    ({ item }: { item: Announcement }) => (
      <AnnouncementListItem
        item={item}
        palette={palette}
        onPress={handleOpen}
        getImageSource={getImageSource}
        formatDate={formatDate}
        getAnnouncementUrl={getAnnouncementUrl}
      />
    ),
    [formatDate, getAnnouncementUrl, getImageSource, handleOpen, palette],
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.loading, { backgroundColor: 'transparent' }]}>
        <ActivityIndicator size="large" color={t.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <FlatList
          data={previousAnnouncements}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={header}
          ListEmptyComponent={emptyComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      <Modal visible={!!activeUrl} animationType="slide" onRequestClose={handleCloseViewer}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: palette.surface }]}>
          <View style={styles.modalHeader}>
            <AppText style={[styles.modalTitle, { color: palette.title }]} numberOfLines={2}>
              {activeAnnouncement?.title ?? 'Comunicado'}
            </AppText>
            <Pressable onPress={handleCloseViewer} style={styles.modalClose}>
              <AppText style={[styles.modalCloseText, { color: palette.accent }]}>Cerrar</AppText>
            </Pressable>
          </View>

          {activeUrl && !webViewError ? (
            <WebView
              key={activeUrl}
              source={{ uri: activeUrl }}
              style={styles.webView}
              startInLoadingState
              renderLoading={() => (
                <ActivityIndicator style={styles.webViewLoader} color={palette.accent} />
              )}
              onError={() => setWebViewError('No se pudo cargar el comunicado.')}
            />
          ) : (
            <View style={styles.webViewFallback}>
              <AppText style={[styles.webViewFallbackText, { color: palette.muted }]}>
                {webViewError || 'No se pudo cargar el comunicado.'}
              </AppText>
              {activeUrl ? (
                <>
                  <Pressable style={styles.webViewFallbackButton} onPress={() => setWebViewError(null)}>
                    <AppText style={[styles.webViewFallbackButtonText, { color: palette.accent }]}>
                      Reintentar
                    </AppText>
                  </Pressable>
                  <Pressable
                    style={styles.webViewFallbackButton}
                    onPress={() => {
                      handleCloseViewer();
                      Linking.openURL(activeUrl).catch(error => {
                        console.error('No se pudo abrir el comunicado en el navegador:', error);
                      });
                    }}
                  >
                    <AppText style={[styles.webViewFallbackButtonText, { color: palette.accent }]}>
                      Abrir en el navegador
                    </AppText>
                  </Pressable>
                </>
              ) : null}
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default AnnouncementsScreen;

type AnnouncementPalette = {
  surface: string;
  surfaceAlt: string;
  title: string;
  muted: string;
  accent: string;
  accentOn: string;
};

const AnnouncementListItem = memo(function AnnouncementListItem({
  item,
  palette,
  onPress,
  getImageSource,
  formatDate,
  getAnnouncementUrl,
}: {
  item: Announcement;
  palette: AnnouncementPalette;
  onPress: (item: Announcement) => void;
  getImageSource: (item: Announcement) => string | undefined;
  formatDate: (value: Announcement['createdAt']) => string;
  getAnnouncementUrl: (item: Announcement) => string | null;
}) {
  const image = getImageSource(item);
  const dateLabel = formatDate(item.createdAt);
  const url = getAnnouncementUrl(item);

  const handlePress = useCallback(() => onPress(item), [item, onPress]);

  return (
    <Pressable
      style={[styles.card, { backgroundColor: palette.surface }]}
      onPress={url ? handlePress : undefined}
      disabled={!url}
    >
      {image ? <Image source={{ uri: image }} style={styles.cardImage} /> : null}
      <View style={styles.cardContent}>
        <AppText style={[styles.cardTitle, { color: palette.title }]} numberOfLines={2}>
          {item.title}
        </AppText>
        {item.description ? (
          <AppText style={[styles.cardDescription, { color: palette.muted }]} numberOfLines={3}>
            {item.description}
          </AppText>
        ) : null}
        {dateLabel ? (
          <AppText style={[styles.cardDate, { color: palette.muted }]}>{dateLabel}</AppText>
        ) : null}
        {url ? <AppText style={[styles.cardLink, { color: palette.accent }]}>Ver comunicado</AppText> : null}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerSpacing: {
    height: spacing.lg,
  },
  heroCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  heroImageContainer: {
    height: 260,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  heroFallback: {
    padding: spacing.lg,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  heroDate: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  cardDate: {
    fontSize: 12,
  },
  cardLink: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  modalClose: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '600',
  },
  webView: {
    flex: 1,
  },
  webViewLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webViewFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  webViewFallbackText: {
    textAlign: 'center',
    fontSize: 14,
  },
  webViewFallbackButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: spacing.sm,
  },
  webViewFallbackButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
