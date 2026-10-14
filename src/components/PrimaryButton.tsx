import { useState } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, interactions, minTouchTarget, radii, typography } from '../theme/tokens';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export default function PrimaryButton({ label, onPress, disabled = false, variant = 'primary', style }: PrimaryButtonProps) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondary : styles.primary,
        disabled ? styles.disabled : undefined,
        pressed ? styles.pressed : undefined,
        focused ? (variant === 'primary' ? styles.focusedPrimary : styles.focusedLight) : undefined,
        style,
      ]}
    >
      <Text style={[styles.label, variant === 'secondary' && !disabled ? styles.secondaryLabel : undefined]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', borderRadius: radii.control, justifyContent: 'center', minHeight: minTouchTarget, paddingHorizontal: 16, paddingVertical: 12 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderColor: colors.primary, borderWidth: 1 },
  disabled: { backgroundColor: colors.disabled, borderColor: colors.disabled },
  pressed: { opacity: interactions.pressedOpacity },
  focusedPrimary: { borderColor: interactions.focusOnPrimary, borderWidth: 3 },
  focusedLight: { borderColor: interactions.focusOnLight, borderWidth: 3 },
  label: { color: colors.surface, fontSize: typography.size.button, fontWeight: typography.weight.bold, textAlign: 'center' },
  secondaryLabel: { color: colors.primary },
});
