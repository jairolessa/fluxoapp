import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, Text, TextInput, View } from 'react-native';
import Chip from '../../components/Chip';
import PrimaryButton from '../../components/PrimaryButton';
import Screen from '../../components/Screen';
import TransactionListItem from '../../components/TransactionListItem';
import { formatMonthYear, Transaction } from '../../domain/finance';
import { colors, radii, spacing, typography } from '../../theme/tokens';

type Filter = 'all' | 'income' | 'expense';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'income', label: 'Receitas' },
  { value: 'expense', label: 'Despesas' },
];

type Row =
  | { kind: 'month'; id: string; title: string }
  | { kind: 'transaction'; id: string; transaction: Transaction };

/** Flattens transactions into rows with a month header before each group (input is newest first). */
function buildRows(transactions: readonly Transaction[]): Row[] {
  const rows: Row[] = [];
  let currentMonth = '';
  for (const transaction of transactions) {
    const month = formatMonthYear(transaction.occurredAt);
    if (month !== currentMonth) {
      currentMonth = month;
      rows.push({ kind: 'month', id: `month-${month}`, title: month });
    }
    rows.push({ kind: 'transaction', id: transaction.id, transaction });
  }
  return rows;
}

const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

type StatementScreenProps = {
  transactions: Transaction[];
  ready: boolean;
  onNewTransaction: () => void;
  onOpenTransaction: (id: string) => void;
};

export default function StatementScreen({ transactions, ready, onNewTransaction, onOpenTransaction }: StatementScreenProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(() => {
    const term = normalize(query.trim());
    const visible = transactions.filter(
      (transaction) =>
        (filter === 'all' || transaction.type === filter) &&
        (!term || normalize(`${transaction.description} ${transaction.category}`).includes(term)),
    );
    return buildRows(visible);
  }, [transactions, query, filter]);

  const renderItem: ListRenderItem<Row> = useCallback(
    ({ item }) =>
      item.kind === 'month' ? (
        <Text accessibilityRole="header" style={styles.month}>{item.title}</Text>
      ) : (
        <TransactionListItem onPress={onOpenTransaction} transaction={item.transaction} />
      ),
    [onOpenTransaction],
  );

  const controls = (
    <View style={styles.controls}>
      <TextInput
        accessibilityLabel="Buscar movimentações"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        onChangeText={setQuery}
        placeholder="Buscar por descrição ou categoria"
        placeholderTextColor={colors.muted}
        returnKeyType="search"
        style={styles.search}
        value={query}
      />
      <View accessibilityRole="radiogroup" style={styles.filters}>
        {FILTERS.map((option) => (
          <Chip key={option.value} label={option.label} onPress={() => setFilter(option.value)} selected={filter === option.value} />
        ))}
      </View>
    </View>
  );

  const empty = !ready ? (
    <ActivityIndicator accessibilityLabel="Carregando movimentações" color={colors.accent} style={styles.loading} />
  ) : (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyTitle}>{transactions.length === 0 ? 'Nenhuma movimentação ainda' : 'Nada encontrado'}</Text>
      <Text style={styles.emptyText}>
        {transactions.length === 0 ? 'Registre sua primeira receita ou despesa.' : 'Tente outro termo de busca ou mude o filtro.'}
      </Text>
      {transactions.length === 0 ? <PrimaryButton label="Nova movimentação" onPress={onNewTransaction} style={styles.emptyButton} /> : null}
    </View>
  );

  return (
    <Screen scroll={false} title="Extrato">
      <FlatList
        contentContainerStyle={styles.list}
        data={rows}
        initialNumToRender={12}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        keyExtractor={(row) => row.id}
        ListEmptyComponent={empty}
        ListHeaderComponent={controls}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        windowSize={7}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.xl },
  controls: { gap: spacing.sm },
  search: { backgroundColor: colors.rowSurface, borderColor: colors.track, borderRadius: radii.control, borderWidth: 1, color: colors.surface, fontSize: typography.size.body, minHeight: 48, paddingHorizontal: spacing.md },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  month: { color: colors.surface, fontSize: typography.size.title, fontWeight: typography.weight.extraBold, marginBottom: spacing.xs, marginTop: spacing.lg },
  loading: { marginTop: spacing.xl },
  emptyBox: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyTitle: { color: colors.surface, fontSize: typography.size.title, fontWeight: typography.weight.bold },
  emptyText: { color: colors.mutedOnDark, fontSize: typography.size.body, marginTop: spacing.sm, textAlign: 'center' },
  emptyButton: { marginTop: spacing.lg, minWidth: 200 },
});
