import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import Screen, { screenStyles as shared } from '../../components/Screen';
import { BUDGET_STATUS_LABEL, buildInsight, BudgetLimits, BudgetStatus, CategorySpending, formatCurrency, formatMonthYear, spendingByCategory, Transaction } from '../../domain/finance';
import { colors, radii, spacing, typography } from '../../theme/tokens';

const BAR_COLOR: Record<BudgetStatus, string> = {
  ok: colors.accent,
  warning: colors.warningOnDark,
  exceeded: colors.expenseOnDark,
};

type BudgetScreenProps = {
  transactions: Transaction[];
  limits: BudgetLimits;
  configured: boolean;
  onBack: () => void;
  onEdit: () => void;
};

function CategoryRow({ item }: { item: CategorySpending }) {
  const ratio = item.limitInCents > 0 ? item.spentInCents / item.limitInCents : 0;
  const percent = Math.round(ratio * 100);
  const spent = formatCurrency(item.spentInCents);
  const limit = formatCurrency(item.limitInCents);

  return (
    <View accessible accessibilityLabel={`${item.category}: ${spent} de ${limit}, ${percent}% do limite. ${BUDGET_STATUS_LABEL[item.status]}`} style={styles.row}>
      <View style={styles.rowTop}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.amounts}>{spent} / {limit}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { backgroundColor: BAR_COLOR[item.status], width: `${Math.min(percent, 100)}%` }]} />
      </View>
      <Text style={styles.status}>{percent}% · {BUDGET_STATUS_LABEL[item.status]}</Text>
    </View>
  );
}

export default function BudgetScreen({ transactions, limits, configured, onBack, onEdit }: BudgetScreenProps) {
  const { spending, insight, month } = useMemo(() => {
    const now = Date.now();
    const byCategory = spendingByCategory(transactions, now, limits);
    return { spending: byCategory, insight: buildInsight(byCategory), month: formatMonthYear(now) };
  }, [transactions, limits]);

  return (
    <Screen onBack={onBack} title="Orçamento">
      <Text style={shared.body}>{month}</Text>
      <PrimaryButton label={configured ? 'Editar limites' : 'Definir meus limites'} onPress={onEdit} style={styles.editButton} />
      {configured ? null : <Text style={styles.hint}>Estes são limites sugeridos. Defina os seus para acompanhar o mês com precisão.</Text>}
      <View style={styles.insight}>
        <Text style={styles.insightText}>{insight}</Text>
      </View>
      {spending.map((item) => (
        <CategoryRow item={item} key={item.category} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  editButton: { marginTop: spacing.md },
  hint: { color: colors.mutedOnDark, fontSize: typography.size.caption, lineHeight: typography.lineHeight.caption, marginTop: spacing.sm },
  insight: { backgroundColor: colors.rowSurface, borderLeftColor: colors.accent, borderLeftWidth: 4, borderRadius: radii.control, marginBottom: spacing.sm, marginTop: spacing.md, padding: spacing.md },
  insightText: { color: colors.surface, fontSize: typography.size.body, lineHeight: typography.lineHeight.body },
  row: { backgroundColor: colors.rowSurface, borderRadius: radii.control, marginTop: spacing.sm, padding: spacing.md },
  rowTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  category: { color: colors.surface, fontSize: typography.size.body, fontWeight: typography.weight.bold },
  amounts: { color: colors.mutedOnDark, fontSize: typography.size.caption },
  track: { backgroundColor: colors.track, borderRadius: radii.pill, height: 8, marginTop: spacing.sm, overflow: 'hidden' },
  fill: { borderRadius: radii.pill, height: 8 },
  status: { color: colors.mutedOnDark, fontSize: typography.size.caption, marginTop: spacing.sm },
});
