import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, interactions, minTouchTarget, radii, typography } from '../theme/tokens';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Shows a spinner, blocks repeated taps and announces the busy state to screen readers. */
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  accessibilityHint?: string;
  style?: ViewStyle;
};

export default function PrimaryButton({ label, onPress, disabled = false, loading = false, variant = 'primary', accessibilityHint, style }: PrimaryButtonProps) {
  const [focused, setFocused] = useState(false);
  const inactive = disabled || loading;
  const filled = variant !== 'secondary';
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondary : variant === 'danger' ? styles.danger : styles.primary,
        disabled && !loading ? styles.disabled : undefined,
        pressed && !inactive ? styles.pressed : undefined,
        focused ? (filled ? styles.focusedFilled : styles.focusedLight) : undefined,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={filled ? colors.surface : colors.primary} size="small" /> : null}
      <Text style={[styles.label, variant === 'secondary' && !disabled ? styles.secondaryLabel : undefined]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', borderRadius: radii.control, flexDirection: 'row', gap: 8, justifyContent: 'center', minHeight: minTouchTarget, paddingHorizontal: 16, paddingVertical: 12 },
  primary: { backgroundColor: colors.primary },
  danger: { backgroundColor: colors.danger },
  secondary: { backgroundColor: colors.surface, borderColor: colors.primary, borderWidth: 1 },
  disabled: { backgroundColor: colors.disabled, borderColor: colors.disabled },
  pressed: { opacity: interactions.pressedOpacity, transform: [{ scale: interactions.pressedScale }] },
  focusedFilled: { borderColor: interactions.focusOnPrimary, borderWidth: 3 },
  focusedLight: { borderColor: interactions.focusOnLight, borderWidth: 3 },
  label: { color: colors.surface, fontSize: typography.size.button, fontWeight: typography.weight.bold, textAlign: 'center' },
  secondaryLabel: { color: colors.primary },
});
