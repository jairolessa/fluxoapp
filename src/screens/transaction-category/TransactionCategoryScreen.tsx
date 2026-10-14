import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DemoPage, { demoPageStyles as page } from '../../components/DemoPage';
import PrimaryButton from '../../components/PrimaryButton';
import { DemoTransaction } from '../../services/mockDashboardData';
import { colors, interactions, minTouchTarget, radii, spacing } from '../../theme/tokens';

const expenseCategories = ['Alimentação', 'Moradia', 'Mobilidade', 'Saúde', 'Lazer', 'Outros'];
const incomeCategories = ['Renda', 'Salário', 'Renda extra', 'Investimentos', 'Outros'];

type TransactionCategoryScreenProps = {
  transaction: DemoTransaction | null;
  onBack: () => void;
  onSave: (category: string) => boolean;
};

export default function TransactionCategoryScreen({ transaction, onBack, onSave }: TransactionCategoryScreenProps) {
  const [selected, setSelected] = useState(transaction?.category ?? '');
  const [savedCategory, setSavedCategory] = useState<string | null>(null);
  const [focusedCategory, setFocusedCategory] = useState<string | null>(null);
  const categories = transaction?.type === 'income' ? incomeCategories : expenseCategories;

  const handleSave = () => {
    if (selected && selected !== transaction?.category && onSave(selected)) setSavedCategory(selected);
  };

  return (
    <DemoPage title="Categoria da movimentação" onBack={onBack}>
      {!transaction ? (
        <View style={[page.card, page.empty]}>
          <Text style={page.value}>Movimentação não encontrada</Text>
          <PrimaryButton label="Voltar ao extrato" onPress={onBack} style={{ marginTop: 20 }} />
        </View>
      ) : savedCategory ? (
        <View style={[page.card, page.stack]}>
          <View accessibilityRole="summary" accessibilityLiveRegion="polite" style={styles.successBanner}>
            <Text style={styles.successTitle}>✓ Categoria atualizada</Text>
            <Text style={styles.successText}>{transaction.description} agora está em “{savedCategory}”.</Text>
          </View>
          <PrimaryButton label="Voltar aos detalhes" onPress={onBack} />
        </View>
      ) : (
        <View style={[page.card, page.stack]}>
          <Text style={page.body}>Escolha uma categoria para “{transaction.description}”. A alteração será aplicada a esta demonstração.</Text>
          <View style={styles.options}>
            {categories.map((category) => {
              const checked = selected === category;
              return (
                <Pressable
                  key={category}
                  accessibilityRole="radio"
                  accessibilityState={{ checked }}
                  onFocus={() => setFocusedCategory(category)}
                  onBlur={() => setFocusedCategory((current) => current === category ? null : current)}
                  onPress={() => setSelected(category)}
                  style={({ pressed }) => [styles.option, checked ? styles.optionSelected : undefined, pressed ? styles.pressed : undefined, focusedCategory === category ? styles.focused : undefined]}
                >
                  <Text style={[styles.optionText, checked ? styles.optionTextSelected : undefined]}>{category}</Text>
                  <Text accessibilityElementsHidden style={styles.radio}>{checked ? '●' : '○'}</Text>
                </Pressable>
              );
            })}
          </View>
          <PrimaryButton label="Salvar categoria" onPress={handleSave} disabled={!selected || selected === transaction.category} />
        </View>
      )}
    </DemoPage>
  );
}

const styles = StyleSheet.create({
  options: { gap: spacing.sm },
  option: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: minTouchTarget, paddingHorizontal: spacing.md },
  optionSelected: { backgroundColor: colors.softGreen, borderColor: colors.primary, borderWidth: 2 },
  optionText: { color: colors.navy, fontSize: 15 },
  optionTextSelected: { color: colors.primary, fontWeight: '700' },
  radio: { color: colors.primary, fontSize: 18, marginLeft: spacing.md },
  pressed: { opacity: 0.78 },
  focused: { borderColor: interactions.focusOnLight, borderWidth: 3 },
  successBanner: { backgroundColor: colors.softGreen, borderRadius: radii.control, padding: spacing.md },
  successTitle: { color: colors.primary, fontSize: 18, fontWeight: '800' },
  successText: { color: colors.navy, fontSize: 15, lineHeight: 22, marginTop: spacing.sm },
});
