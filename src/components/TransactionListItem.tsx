import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DemoTransaction, formatDemoCurrency } from '../services/mockDashboardData';
import { colors, interactions, radii, spacing, typography } from '../theme/tokens';

type TransactionListItemProps = {
  transaction: DemoTransaction;
  onPress: () => void;
  actionLabel?: string;
};

export default function TransactionListItem({ transaction, onPress, actionLabel = 'Ver detalhes' }: TransactionListItemProps) {
  const [focused, setFocused] = useState(false);
  const amount = `${transaction.type === 'income' ? '+' : '−'}${formatDemoCurrency(transaction.amountInCents)}`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${transaction.description}, ${transaction.category}, ${amount}. ${actionLabel}`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : undefined, focused ? styles.focused : undefined]}
    >
      <View style={styles.description}>
        <Text style={styles.title}>{transaction.description}</Text>
        <Text style={styles.category}>{transaction.category} · {transaction.date}</Text>
      </View>
      <Text style={transaction.type === 'income' ? styles.income : styles.expense}>{amount}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', backgroundColor: colors.rowSurface, borderRadius: radii.control, flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm, minHeight: 64, paddingHorizontal: spacing.md },
  description: { flex: 1, paddingRight: spacing.sm },
  title: { color: colors.surface, fontSize: typography.size.body, fontWeight: typography.weight.bold },
  category: { color: colors.mutedOnDark, fontSize: typography.size.caption, lineHeight: typography.lineHeight.caption, marginTop: spacing.xs },
  income: { color: '#86EFAC', fontSize: typography.size.label, fontWeight: typography.weight.bold },
  expense: { color: '#FCA5A5', fontSize: typography.size.label, fontWeight: typography.weight.bold },
  pressed: { opacity: interactions.pressedOpacity },
  focused: { borderColor: interactions.focusOnDark, borderWidth: 2 },
});
