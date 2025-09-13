import { View, StyleSheet, ScrollView } from 'react-native';
import AppText from '../components/AppText';
import { typography } from '../theme/typography';
          <AppText style={styles.title}>Bienvenido a Bancapp</AppText>
          <AppText style={styles.subtitle}>Información Relevante</AppText>
          <AppText style={styles.info}>
          </AppText>
  title: {
    ...typography.heading1,
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    ...typography.subtitle,
    color: '#eee',
    marginBottom: 20,
  },
  info: {
    ...typography.body,
    color: '#fff',
    textAlign: 'center',
  },
});
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Bienvenido a Bancapp</Text>
          <Text style={styles.subtitle}>Información Relevante</Text>
          <Text style={styles.info}>
            Aquí puedes mostrar la información más relevante de la aplicación, noticias, estadísticas o cualquier dato importante
            que desees destacar para el usuario.
          </Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#eee',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});
