import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import TransactionListItem from '../../components/TransactionListItem';
import { BudgetLimits, buildInsight, formatCurrency, spendingByCategory, summarize, Transaction } from '../../domain/finance';
import { colors, minTouchTarget, radii, spacing, typography } from '../../theme/tokens';

const RECENT_COUNT = 5;

type HomeScreenProps = {
  preferredName: string;
  transactions: Transaction[];
  limits: BudgetLimits;
  ready: boolean;
  onNewTransaction: () => void;
  onOpenBudget: () => void;
  onOpenStatement: () => void;
  onOpenTransaction: (id: string) => void;
};

export default function HomeScreen({ preferredName, transactions, limits, ready, onNewTransaction, onOpenBudget, onOpenStatement, onOpenTransaction }: HomeScreenProps) {
  const greetingName = preferredName || 'você';

  const { summary, insight } = useMemo(() => {
    const now = Date.now();
    return { summary: summarize(transactions, now), insight: buildInsight(spendingByCategory(transactions, now, limits)) };
  }, [transactions, limits]);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Olá, {greetingName}</Text>
            <Text style={styles.caption}>Vamos cuidar da sua vida financeira.</Text>
          </View>
          <View accessibilityElementsHidden style={styles.avatar}>
            <Text style={styles.avatarText}>{greetingName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        {!ready ? (
          <ActivityIndicator accessibilityLabel="Carregando seus dados" color={colors.accent} style={styles.loading} />
        ) : (
          <>
            <View accessible accessibilityLabel={`Saldo atual: ${formatCurrency(summary.balanceInCents)}`} style={styles.summaryCard}>
              <Text style={styles.eyebrow}>SALDO ATUAL</Text>
              <Text style={styles.balance}>{formatCurrency(summary.balanceInCents)}</Text>
              <View style={styles.cashFlowRow}>
                <View style={styles.cashFlowItem}>
                  <Text style={styles.cashFlowLabel}>Receitas do mês</Text>
                  <Text style={styles.incomeAmount}>{formatCurrency(summary.monthIncomeInCents)}</Text>
                </View>
                <View style={styles.cashFlowItem}>
                  <Text style={styles.cashFlowLabel}>Despesas do mês</Text>
                  <Text style={styles.expenseAmount}>{formatCurrency(summary.monthExpensesInCents)}</Text>
                </View>
              </View>
            </View>

            <Pressable accessibilityRole="button" accessibilityLabel={`${insight} Ver orçamento`} onPress={onOpenBudget} style={({ pressed }) => [styles.insight, pressed ? styles.pressed : undefined]}>
              <Text style={styles.insightTitle}>Resumo do mês</Text>
              <Text style={styles.insightText}>{insight}</Text>
              <Text style={styles.insightLink}>Ver orçamento ›</Text>
            </Pressable>

            <PrimaryButton label="Nova movimentação" onPress={onNewTransaction} style={styles.newButton} />

            <View style={styles.sectionHeader}>
              <Text accessibilityRole="header" style={styles.sectionTitle}>Últimas movimentações</Text>
            </View>
            {transactions.length === 0 ? (
              <Text style={styles.empty}>Você ainda não tem movimentações. Toque em “Nova movimentação” para começar.</Text>
            ) : (
              transactions.slice(0, RECENT_COUNT).map((transaction) => (
                <TransactionListItem key={transaction.id} onPress={onOpenTransaction} transaction={transaction} />
              ))
            )}
            <PrimaryButton label="Ver extrato completo" onPress={onOpenStatement} style={styles.statementButton} variant="secondary" />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.navy },
  scrollContent: { flexGrow: 1, padding: spacing.lg, paddingBottom: spacing.xl },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg, marginTop: spacing.sm },
  headerText: { flex: 1, paddingRight: spacing.md },
  greeting: { color: colors.surface, fontSize: 27, fontWeight: '800' },
  caption: { color: '#94A3B8', fontSize: 14, marginTop: 6 },
  avatar: { alignItems: 'center', backgroundColor: colors.primary, borderColor: colors.accent, borderRadius: 22, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 },
  avatarText: { color: colors.surface, fontSize: 17, fontWeight: '800' },
  loading: { marginTop: spacing.xl },
  summaryCard: { backgroundColor: colors.surface, borderRadius: radii.card, marginBottom: spacing.md, padding: spacing.lg },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  balance: { color: colors.navy, fontSize: typography.size.amount, fontWeight: '800', marginTop: spacing.sm },
  cashFlowRow: { borderTopColor: '#E2E8F0', borderTopWidth: 1, flexDirection: 'row', marginTop: 20, paddingTop: spacing.md },
  cashFlowItem: { flex: 1 },
  cashFlowLabel: { color: '#475569', fontSize: 13 },
  incomeAmount: { color: colors.primary, fontSize: 15, fontWeight: '700', marginTop: 5 },
  expenseAmount: { color: colors.danger, fontSize: 15, fontWeight: '700', marginTop: 5 },
  insight: { backgroundColor: colors.rowSurface, borderLeftColor: colors.accent, borderLeftWidth: 4, borderRadius: radii.control, marginBottom: spacing.md, minHeight: minTouchTarget, padding: spacing.md },
  insightTitle: { color: colors.incomeOnDark, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  insightText: { color: colors.surface, fontSize: typography.size.body, lineHeight: typography.lineHeight.body, marginTop: spacing.xs },
  insightLink: { color: colors.accent, fontSize: 14, fontWeight: '700', marginTop: spacing.sm },
  pressed: { opacity: 0.82 },
  newButton: { marginBottom: spacing.sm },
  sectionHeader: { marginTop: spacing.lg },
  sectionTitle: { color: colors.surface, fontSize: typography.size.title, fontWeight: '800', marginBottom: spacing.xs },
  empty: { color: colors.mutedOnDark, fontSize: typography.size.body, lineHeight: typography.lineHeight.body, marginTop: spacing.sm },
  statementButton: { marginTop: spacing.md },
});
