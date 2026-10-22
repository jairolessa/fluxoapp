import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import Screen, { screenStyles as page } from '../../components/Screen';
import { categoriesFor, Transaction } from '../../domain/finance';
import { colors, interactions, minTouchTarget, radii, spacing } from '../../theme/tokens';
import { noticeStore } from '../../services/noticeStore';

type TransactionCategoryScreenProps = {
  transaction: Transaction | null;
  ready: boolean;
  onBack: () => void;
  onSave: (category: string) => Promise<boolean>;
};

export default function TransactionCategoryScreen({ transaction, ready, onBack, onSave }: TransactionCategoryScreenProps) {
  const [selected, setSelected] = useState(transaction?.category ?? '');
  const [savedCategory, setSavedCategory] = useState<string | null>(null);
  const [focusedCategory, setFocusedCategory] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const unchanged = !selected || selected === transaction?.category;

  const handleSave = async () => {
    if (unchanged || saving) return;
    setSaving(true);
    try {
      if (await onSave(selected)) setSavedCategory(selected);
      else noticeStore.show('Não foi possível salvar. A movimentação não foi encontrada.', 'error');
    } catch {
      noticeStore.show('Não foi possível salvar. Tente novamente em instantes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen onBack={onBack} title="Categoria">
      {!ready ? null : !transaction ? (
        <View style={[page.card, page.empty]}>
          <Text style={page.value}>Movimentação não encontrada</Text>
          <PrimaryButton label="Voltar" onPress={onBack} style={styles.backButton} />
        </View>
      ) : savedCategory ? (
        <View style={[page.card, page.stack]}>
          <View accessibilityLiveRegion="polite" accessibilityRole="summary" style={styles.successBanner}>
            <Text style={styles.successTitle}>✓ Categoria atualizada</Text>
            <Text style={styles.successText}>{transaction.description} agora está em “{savedCategory}”.</Text>
          </View>
          <PrimaryButton label="Voltar aos detalhes" onPress={onBack} />
        </View>
      ) : (
        <View style={[page.card, page.stack]}>
          <Text style={styles.intro}>Escolha uma categoria para “{transaction.description}”.</Text>
          <View style={styles.options}>
            {categoriesFor(transaction.type).map((category) => {
              const checked = selected === category;
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked }}
                  key={category}
                  onBlur={() => setFocusedCategory((current) => (current === category ? null : current))}
                  onFocus={() => setFocusedCategory(category)}
                  onPress={() => setSelected(category)}
                  style={({ pressed }) => [styles.option, checked ? styles.optionSelected : undefined, pressed ? styles.pressed : undefined, focusedCategory === category ? styles.focused : undefined]}
                >
                  <Text style={[styles.optionText, checked ? styles.optionTextSelected : undefined]}>{category}</Text>
                  <Text accessibilityElementsHidden style={styles.radio}>{checked ? '●' : '○'}</Text>
                </Pressable>
              );
            })}
          </View>
          <PrimaryButton disabled={unchanged || saving} label={saving ? 'Salvando…' : 'Salvar categoria'} onPress={handleSave} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  backButton: { marginTop: 20 },
  options: { gap: spacing.sm },
  option: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: minTouchTarget, paddingHorizontal: spacing.md },
  optionSelected: { backgroundColor: colors.softGreen, borderColor: colors.primary, borderWidth: 2 },
  optionText: { color: colors.navy, fontSize: 15 },
  optionTextSelected: { color: colors.primary, fontWeight: '700' },
  radio: { color: colors.primary, fontSize: 18, marginLeft: spacing.md },
  pressed: { opacity: interactions.pressedOpacity },
  focused: { borderColor: interactions.focusOnLight, borderWidth: 3 },
  successBanner: { backgroundColor: colors.softGreen, borderRadius: radii.control, padding: spacing.md },
  successTitle: { color: colors.primary, fontSize: 18, fontWeight: '800' },
  successText: { color: colors.navy, fontSize: 15, lineHeight: 22, marginTop: spacing.sm },
});
