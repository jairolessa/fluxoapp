import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDemoCurrency, mockDashboardData } from '../../services/mockDashboardData';
import { useDemoTransactions } from '../../hooks/useDemoTransactions';
import PrimaryButton from '../../components/PrimaryButton';
import TransactionListItem from '../../components/TransactionListItem';
import { colors as themeColors, spacing } from '../../theme/tokens';

const colors = {
  darkGreen: themeColors.primary,
  navy: themeColors.navy,
  white: themeColors.surface,
  muted: '#94A3B8',
  softGreen: themeColors.softGreen,
};

type HomeScreenProps = {
  preferredName: string;
  onLogout: () => void;
  onOpenStatement: () => void;
};

export default function HomeScreen({ preferredName, onLogout, onOpenStatement }: HomeScreenProps) {
  const greetingName = preferredName || 'você';
  const transactions = useDemoTransactions();

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

        <View accessible accessibilityRole="summary" style={styles.summaryCard} accessibilityLabel={`Saldo demonstrativo: ${formatDemoCurrency(mockDashboardData.balanceInCents)}`}>
          <Text style={styles.eyebrow}>RESUMO DEMONSTRATIVO</Text>
          <Text style={styles.balance}>{formatDemoCurrency(mockDashboardData.balanceInCents)}</Text>
          <View style={styles.cashFlowRow}>
            <View style={styles.cashFlowItem}>
              <Text style={styles.cashFlowLabel}>Receitas</Text>
              <Text style={styles.incomeAmount}>{formatDemoCurrency(mockDashboardData.incomeInCents)}</Text>
            </View>
            <View style={styles.cashFlowItem}>
              <Text style={styles.cashFlowLabel}>Despesas</Text>
              <Text style={styles.expenseAmount}>{formatDemoCurrency(mockDashboardData.expensesInCents)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.demoNotice} accessibilityRole="summary">
          <Text style={styles.demoNoticeTitle}>Dados fictícios para demonstração</Text>
          <Text style={styles.demoNoticeText}>Nenhuma conta bancária está conectada. Os valores abaixo são exemplos e não representam suas finanças.</Text>
        </View>

        <View style={styles.transactions}>
          <Text style={styles.sectionTitle}>Movimentações de exemplo</Text>
          {transactions.slice(0, 3).map((transaction) => (
            <TransactionListItem key={transaction.id} transaction={transaction} onPress={onOpenStatement} actionLabel="Abrir extrato" />
          ))}
          <PrimaryButton label="Ver extrato completo" onPress={onOpenStatement} variant="secondary" style={styles.statementButton} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>↗</Text>
          </View>
          <Text style={styles.heroTitle}>Conexão bancária ainda não disponível</Text>
          <Text style={styles.heroDescription}>
            Quando a conexão bancária estiver disponível, o Fluxo poderá reunir transações e sugerir próximos passos.
          </Text>
          <Text style={styles.comingSoon}>Os dados desta tela são apenas exemplos locais.</Text>
        </View>

        <View style={styles.nextSteps}>
          <Text style={styles.sectionTitle}>O que acontece depois?</Text>
          <Text style={styles.step}>• Organizamos suas movimentações automaticamente.</Text>
          <Text style={styles.step}>• Mostramos como está sua saúde financeira.</Text>
          <Text style={styles.step}>• Indicamos ações para melhorar suas decisões.</Text>
        </View>
        <PrimaryButton label="Sair da conta demonstrativa" onPress={onLogout} variant="secondary" style={styles.logoutButton} />
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
  summaryCard: { backgroundColor: colors.white, borderRadius: 24, padding: 24, marginBottom: 16 },
  eyebrow: { color: colors.darkGreen, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  balance: { color: colors.navy, fontSize: 32, fontWeight: '800', marginTop: 8 },
  cashFlowRow: { borderTopColor: '#E2E8F0', borderTopWidth: 1, flexDirection: 'row', marginTop: 20, paddingTop: 16 },
  cashFlowItem: { flex: 1 },
  cashFlowLabel: { color: '#475569', fontSize: 13 },
  incomeAmount: { color: colors.darkGreen, fontSize: 15, fontWeight: '700', marginTop: 5 },
  expenseAmount: { color: '#B91C1C', fontSize: 15, fontWeight: '700', marginTop: 5 },
  demoNotice: { backgroundColor: '#FEF3C7', borderRadius: 14, marginBottom: 24, padding: 16 },
  demoNoticeTitle: { color: '#78350F', fontSize: 14, fontWeight: '800' },
  demoNoticeText: { color: '#78350F', fontSize: 13, lineHeight: 19, marginTop: 5 },
  transactions: { marginBottom: 24 },
  heroCard: { alignItems: 'center', backgroundColor: colors.white, borderRadius: 24, padding: 28 },
  iconCircle: { alignItems: 'center', backgroundColor: colors.softGreen, borderRadius: 28, height: 56, justifyContent: 'center', width: 56 },
  iconText: { color: colors.darkGreen, fontSize: 28, fontWeight: '700' },
  heroTitle: { color: colors.navy, fontSize: 23, fontWeight: '800', lineHeight: 29, marginTop: 20, textAlign: 'center' },
  heroDescription: { color: '#64748B', fontSize: 15, lineHeight: 22, marginTop: 12, textAlign: 'center' },
  comingSoon: { color: '#475569', fontSize: 13, marginTop: 16, textAlign: 'center' },
  nextSteps: { marginTop: 32, paddingHorizontal: 4 },
  sectionTitle: { color: colors.white, fontSize: 17, fontWeight: '800', marginBottom: 14 },
  step: { color: '#CBD5E1', fontSize: 14, lineHeight: 24 },
  statementButton: { marginTop: spacing.md },
  logoutButton: { borderColor: colors.darkGreen, marginTop: spacing.lg },
});
