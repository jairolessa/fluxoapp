import { useState, ReactNode } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, interactions, minTouchTarget, radii, spacing, typography } from '../theme/tokens';

type DemoPageProps = {
  title: string;
  onBack: () => void;
  children: ReactNode;
};

export default function DemoPage({ title, onBack, children }: DemoPageProps) {
  const [backFocused, setBackFocused] = useState(false);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar à tela anterior"
          onFocus={() => setBackFocused(true)}
          onBlur={() => setBackFocused(false)}
          onPress={onBack}
          style={({ pressed }) => [styles.back, pressed ? styles.pressed : undefined, backFocused ? styles.focused : undefined]}
        >
          <Text style={styles.backText}>‹ Voltar</Text>
        </Pressable>
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        <View accessibilityRole="summary" style={styles.notice}>
          <Text style={styles.noticeText}>Demonstração acadêmica: valores e movimentações fictícios, sem conexão bancária.</Text>
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export const demoPageStyles = StyleSheet.create({
  sectionTitle: { color: colors.surface, fontSize: typography.size.title, fontWeight: typography.weight.extraBold, lineHeight: typography.lineHeight.title, marginBottom: spacing.sm, marginTop: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.lg },
  label: { color: colors.muted, fontSize: 13, marginBottom: spacing.xs },
  value: { color: colors.navy, fontSize: 18, fontWeight: '700' },
  amount: { color: colors.navy, fontSize: 28, fontWeight: '800' },
  body: { color: colors.muted, fontSize: typography.size.body, lineHeight: typography.lineHeight.body },
  stack: { gap: spacing.md },
  empty: { alignItems: 'center', padding: spacing.xl },
});

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.navy, flex: 1 },
  content: { flexGrow: 1, padding: spacing.lg },
  back: { alignSelf: 'flex-start', justifyContent: 'center', minHeight: minTouchTarget, minWidth: minTouchTarget, paddingHorizontal: spacing.sm },
  backText: { color: '#BBF7D0', fontSize: 15, fontWeight: '700' },
  pressed: { opacity: interactions.pressedOpacity },
  focused: { borderColor: interactions.focusOnDark, borderWidth: 2 },
  title: { color: colors.surface, fontSize: typography.size.screenTitle, fontWeight: typography.weight.extraBold, lineHeight: typography.lineHeight.screenTitle, marginBottom: spacing.md, marginTop: spacing.sm },
  notice: { backgroundColor: colors.noticeBackground, borderRadius: radii.control, marginBottom: spacing.lg, padding: spacing.md },
  noticeText: { color: colors.noticeText, fontSize: 13, lineHeight: 19 },
});
