import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDate, formatSignedCurrency, Transaction } from '../domain/finance';
import { colors, interactions, radii, spacing, typography } from '../theme/tokens';

type TransactionListItemProps = {
  transaction: Transaction;
  onPress: (id: string) => void;
};

function TransactionListItem({ transaction, onPress }: TransactionListItemProps) {
  const [focused, setFocused] = useState(false);
  const amount = formatSignedCurrency(transaction);
  const date = formatDate(transaction.occurredAt);
  const kind = transaction.type === 'income' ? 'Receita' : 'Despesa';

  return (
    <Pressable
      accessibilityLabel={`${kind}: ${transaction.description}, ${transaction.category}, ${amount}, ${date}. Ver detalhes`}
      accessibilityRole="button"
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onPress={() => onPress(transaction.id)}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : undefined, focused ? styles.focused : undefined]}
    >
      <View style={styles.description}>
        <Text numberOfLines={1} style={styles.title}>{transaction.description}</Text>
        <Text style={styles.category}>
          {transaction.category} · {date}
          {transaction.receiptUri ? ' · 📎' : ''}
          {transaction.location ? ' · 📍' : ''}
        </Text>
      </View>
      <Text style={transaction.type === 'income' ? styles.income : styles.expense}>{amount}</Text>
    </Pressable>
  );
}

export default memo(TransactionListItem);

const styles = StyleSheet.create({
  row: { alignItems: 'center', backgroundColor: colors.rowSurface, borderRadius: radii.control, flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm, minHeight: 64, paddingHorizontal: spacing.md },
  description: { flex: 1, paddingRight: spacing.sm },
  title: { color: colors.surface, fontSize: typography.size.body, fontWeight: typography.weight.bold },
  category: { color: colors.mutedOnDark, fontSize: typography.size.caption, lineHeight: typography.lineHeight.caption, marginTop: spacing.xs },
  income: { color: colors.incomeOnDark, fontSize: typography.size.label, fontWeight: typography.weight.bold },
  expense: { color: colors.expenseOnDark, fontSize: typography.size.label, fontWeight: typography.weight.bold },
  pressed: { opacity: interactions.pressedOpacity },
  focused: { borderColor: interactions.focusOnDark, borderWidth: 2 },
});
