import { ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, interactions, minTouchTarget, spacing, typography } from '../theme/tokens';

type ScreenProps = {
  title: string;
  onBack?: () => void;
  scroll?: boolean;
  children: ReactNode;
};

export default function Screen({ title, onBack, scroll = true, children }: ScreenProps) {
  const [backFocused, setBackFocused] = useState(false);

  const header = (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar à tela anterior"
          onBlur={() => setBackFocused(false)}
          onFocus={() => setBackFocused(true)}
          onPress={onBack}
          style={({ pressed }) => [styles.back, pressed ? styles.pressed : undefined, backFocused ? styles.focused : undefined]}
        >
          <Text style={styles.backText}>‹ Voltar</Text>
        </Pressable>
      ) : null}
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {header}
          {children}
        </ScrollView>
      ) : (
        <View style={styles.fixed}>
          {header}
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

export const screenStyles = StyleSheet.create({
  sectionTitle: { color: colors.surface, fontSize: typography.size.title, fontWeight: typography.weight.extraBold, lineHeight: typography.lineHeight.title, marginBottom: spacing.sm, marginTop: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: 24, padding: spacing.lg },
  label: { color: colors.muted, fontSize: 13, marginBottom: spacing.xs },
  value: { color: colors.navy, fontSize: 18, fontWeight: '700' },
  body: { color: colors.mutedOnDark, fontSize: typography.size.body, lineHeight: typography.lineHeight.body },
  stack: { gap: spacing.md },
  empty: { alignItems: 'center', padding: spacing.xl },
});

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.navy, flex: 1 },
  content: { flexGrow: 1, padding: spacing.lg, paddingBottom: spacing.xl },
  fixed: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  header: { marginBottom: spacing.md },
  back: { alignSelf: 'flex-start', justifyContent: 'center', marginLeft: -spacing.sm, minHeight: minTouchTarget, minWidth: minTouchTarget, paddingHorizontal: spacing.sm },
  backText: { color: '#BBF7D0', fontSize: 15, fontWeight: '700' },
  pressed: { opacity: interactions.pressedOpacity },
  focused: { borderColor: interactions.focusOnDark, borderWidth: 2 },
  title: { color: colors.surface, fontSize: typography.size.screenTitle, fontWeight: typography.weight.extraBold, lineHeight: typography.lineHeight.screenTitle, marginTop: spacing.sm },
});
