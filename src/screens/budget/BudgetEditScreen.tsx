import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import Screen, { screenStyles as shared } from '../../components/Screen';
import { BudgetLimits, EXPENSE_CATEGORIES, formatCurrency, parseAmountToCents } from '../../domain/finance';
import { colors, radii, spacing, typography } from '../../theme/tokens';

type BudgetEditScreenProps = {
  limits: BudgetLimits;
  configured: boolean;
  onBack: () => void;
  onSave: (limits: BudgetLimits) => Promise<void>;
};

const toDigits = (limits: BudgetLimits) =>
  Object.fromEntries(EXPENSE_CATEGORIES.map((category) => [category, String(limits[category] ?? 0)]));

export default function BudgetEditScreen({ limits, configured, onBack, onSave }: BudgetEditScreenProps) {
  const [digits, setDigits] = useState<Record<string, string>>(() => toDigits(limits));
  const [saving, setSaving] = useState(false);

  const draft = useMemo(
    () => Object.fromEntries(EXPENSE_CATEGORIES.map((category) => [category, parseAmountToCents(digits[category] ?? '')])),
    [digits],
  );
  const total = useMemo(() => Object.values(draft).reduce((sum, value) => sum + value, 0), [draft]);
  const invalid = EXPENSE_CATEGORIES.some((category) => draft[category] <= 0);
  const unchanged = configured && EXPENSE_CATEGORIES.every((category) => draft[category] === limits[category]);

  const handleSave = async () => {
    if (invalid || saving) return;
    setSaving(true);
    try {
      await onSave(draft);
      onBack();
    } catch {
      Alert.alert('Não foi possível salvar', 'Tente novamente em instantes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen onBack={onBack} title={configured ? 'Editar orçamento' : 'Definir orçamento'}>
      <Text style={shared.body}>Defina quanto você pretende gastar por mês em cada categoria. Avisamos quando você chegar perto do limite.</Text>

      <View style={styles.fields}>
        {EXPENSE_CATEGORIES.map((category) => {
          const cents = draft[category];
          return (
            <FormField
              error={cents > 0 ? undefined : 'Informe um limite maior que zero.'}
              key={category}
              keyboardType="number-pad"
              label={category}
              onChangeText={(text) => setDigits((current) => ({ ...current, [category]: String(parseAmountToCents(text)) }))}
              placeholder="R$ 0,00"
              touched
              value={cents > 0 ? formatCurrency(cents) : ''}
            />
          );
        })}
      </View>

      <View accessible accessibilityLabel={`Total mensal: ${formatCurrency(total)}`} style={styles.total}>
        <Text style={styles.totalLabel}>Total mensal</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>

      <PrimaryButton disabled={invalid || unchanged || saving} label={saving ? 'Salvando…' : 'Salvar orçamento'} onPress={handleSave} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fields: { gap: spacing.md, marginBottom: spacing.lg, marginTop: spacing.lg },
  total: { alignItems: 'center', backgroundColor: colors.rowSurface, borderRadius: radii.control, flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg, padding: spacing.md },
  totalLabel: { color: colors.mutedOnDark, fontSize: typography.size.body },
  totalValue: { color: colors.surface, fontSize: typography.size.title, fontWeight: typography.weight.extraBold },
});
