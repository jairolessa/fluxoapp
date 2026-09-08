import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const colors = {
  green: '#16A34A',
  darkGreen: '#166534',
  navy: '#0F172A',
  white: '#FFFFFF',
  muted: '#94A3B8',
  softGreen: '#DCFCE7',
};

type HomeScreenProps = {
  preferredName: string;
};

export default function HomeScreen({ preferredName }: HomeScreenProps) {
  const greetingName = preferredName || 'você';

  const handleConnectAccount = () => {
    Alert.alert('Conectar conta', 'A integração bancária estará disponível em breve.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {greetingName}</Text>
            <Text style={styles.caption}>Vamos cuidar da sua vida financeira.</Text>
          </View>
          <View accessibilityElementsHidden style={styles.avatar}>
            <Text style={styles.avatarText}>{greetingName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>↗</Text>
          </View>
          <Text style={styles.heroTitle}>Comece conectando sua conta</Text>
          <Text style={styles.heroDescription}>
            Com suas transações em um só lugar, o Fluxo pode criar insights e recomendações para você.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleConnectAccount}
            style={({ pressed }) => [styles.connectButton, pressed ? styles.buttonPressed : undefined]}
          >
            <Text style={styles.connectButtonText}>Conectar Conta</Text>
          </Pressable>
        </View>

        <View style={styles.nextSteps}>
          <Text style={styles.sectionTitle}>O que acontece depois?</Text>
          <Text style={styles.step}>• Organizamos suas movimentações automaticamente.</Text>
          <Text style={styles.step}>• Mostramos como está sua saúde financeira.</Text>
          <Text style={styles.step}>• Indicamos ações para melhorar suas decisões.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.navy },
  scrollContent: { flexGrow: 1, padding: 24 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 38, marginTop: 12 },
  greeting: { color: colors.white, fontSize: 27, fontWeight: '800' },
  caption: { color: colors.muted, fontSize: 14, marginTop: 6 },
  avatar: { alignItems: 'center', backgroundColor: colors.darkGreen, borderColor: '#4ADE80', borderRadius: 22, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 },
  avatarText: { color: colors.white, fontSize: 17, fontWeight: '800' },
  heroCard: { alignItems: 'center', backgroundColor: colors.white, borderRadius: 24, padding: 28 },
  iconCircle: { alignItems: 'center', backgroundColor: colors.softGreen, borderRadius: 28, height: 56, justifyContent: 'center', width: 56 },
  iconText: { color: colors.darkGreen, fontSize: 28, fontWeight: '700' },
  heroTitle: { color: colors.navy, fontSize: 23, fontWeight: '800', lineHeight: 29, marginTop: 20, textAlign: 'center' },
  heroDescription: { color: '#64748B', fontSize: 15, lineHeight: 22, marginTop: 12, textAlign: 'center' },
  connectButton: { alignItems: 'center', backgroundColor: colors.green, borderRadius: 12, justifyContent: 'center', marginTop: 28, minHeight: 54, width: '100%' },
  connectButtonText: { color: colors.white, fontSize: 16, fontWeight: '800' },
  buttonPressed: { opacity: 0.86 },
  nextSteps: { marginTop: 32, paddingHorizontal: 4 },
  sectionTitle: { color: colors.white, fontSize: 17, fontWeight: '800', marginBottom: 14 },
  step: { color: '#CBD5E1', fontSize: 14, lineHeight: 24 },
});
