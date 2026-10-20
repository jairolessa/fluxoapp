import { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  touched?: boolean;
};

/** Labelled text input for dark screens, with focus ring and an accessible inline error. */
export default function FormField({ label, error, touched, onBlur, onFocus, style, ...inputProps }: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const showError = Boolean(touched && error);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        {...inputProps}
        onBlur={(event) => { setFocused(false); onBlur?.(event); }}
        onFocus={(event) => { setFocused(true); onFocus?.(event); }}
        style={[styles.input, focused ? styles.focused : undefined, showError ? styles.invalid : undefined, style]}
      />
      {showError ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.surface, fontSize: typography.size.label, fontWeight: typography.weight.bold, marginBottom: spacing.sm },
  input: { backgroundColor: colors.rowSurface, borderColor: colors.track, borderRadius: radii.control, borderWidth: 1, color: colors.surface, fontSize: typography.size.body, minHeight: 52, paddingHorizontal: spacing.md },
  focused: { borderColor: colors.accent, borderWidth: 2 },
  invalid: { borderColor: colors.expenseOnDark },
  error: { color: colors.expenseOnDark, fontSize: typography.size.caption, marginTop: 6 },
});
