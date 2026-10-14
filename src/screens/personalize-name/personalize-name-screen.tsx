import { Formik } from 'formik';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { colors as themeColors, typography } from '../../theme/tokens';

const colors = {
  green: themeColors.brand,
  navy: themeColors.navy,
  white: themeColors.surface,
  muted: themeColors.muted,
  danger: themeColors.danger,
  border: themeColors.border,
};

type PersonalizeNameScreenProps = {
  initialName: string;
  onContinue: (preferredName: string) => void;
};

type PersonalizeNameValues = {
  preferredName: string;
};

const personalizeNameSchema = Yup.object({
  preferredName: Yup.string()
    .trim()
    .min(2, 'Informe um nome com pelo menos 2 caracteres.')
    .required('Informe como você quer ser chamado.'),
});

export default function PersonalizeNameScreen({ initialName, onContinue }: PersonalizeNameScreenProps) {
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isContinueFocused, setIsContinueFocused] = useState(false);
  const initialValues: PersonalizeNameValues = { preferredName: initialName };

  const handleContinue = (values: PersonalizeNameValues) => {
    onContinue(values.preferredName.trim());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}>
            <View accessibilityElementsHidden style={styles.brandMark}>
              <Text style={styles.brandCurrency}>R$</Text>
            </View>
            <Text style={styles.brandName}>FLUXO</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Como você quer ser chamado?</Text>
            <Text style={styles.subtitle}>É assim que vamos te chamar por aqui.</Text>

            <Formik
              enableReinitialize
              initialValues={initialValues}
              validateOnMount
              onSubmit={handleContinue}
              validationSchema={personalizeNameSchema}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, isValid, isValidating, touched, values }) => (
                <View style={styles.form}>
                  <View>
                    <Text style={styles.label}>Seu nome</Text>
                    <TextInput
                      accessibilityLabel="Como você quer ser chamado"
                      autoCapitalize="words"
                      autoComplete="name"
                      onBlur={(event) => { setIsNameFocused(false); handleBlur('preferredName')(event); }}
                      onChangeText={handleChange('preferredName')}
                      onFocus={() => setIsNameFocused(true)}
                      onSubmitEditing={() => handleSubmit()}
                      placeholder="Seu nome"
                      placeholderTextColor={colors.muted}
                      returnKeyType="done"
                      style={[styles.input, isNameFocused ? styles.inputFocused : undefined, touched.preferredName && errors.preferredName ? styles.inputError : undefined]}
                      textContentType="givenName"
                      value={values.preferredName}
                    />
                    {touched.preferredName && errors.preferredName ? (
                      <Text accessibilityLiveRegion="polite" style={styles.errorText}>{errors.preferredName}</Text>
                    ) : null}
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    disabled={!isValid || isValidating}
                    onFocus={() => setIsContinueFocused(true)}
                    onBlur={() => setIsContinueFocused(false)}
                    onPress={() => handleSubmit()}
                    style={({ pressed }) => [
                      styles.continueButton,
                      !isValid || isValidating ? styles.continueButtonDisabled : undefined,
                      pressed && isValid && !isValidating ? styles.buttonPressed : undefined,
                      isContinueFocused ? styles.buttonFocused : undefined,
                    ]}
                  >
                    <Text style={styles.continueButtonText}>Continuar</Text>
                  </Pressable>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.navy },
  keyboardAvoidingView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  brandRow: { alignItems: 'center', flexDirection: 'row', gap: 10, marginBottom: 32, paddingHorizontal: 4 },
  brandMark: { alignItems: 'center', borderColor: colors.green, borderRadius: 22, borderWidth: 3, height: 44, justifyContent: 'center', width: 44 },
  brandCurrency: { color: colors.green, fontSize: 16, fontWeight: '800' },
  brandName: { color: colors.white, fontSize: 30, fontWeight: '800', letterSpacing: 2 },
  card: { backgroundColor: colors.white, borderRadius: 24, padding: 24 },
  title: { color: colors.navy, fontSize: typography.size.screenTitle, fontWeight: typography.weight.extraBold, lineHeight: typography.lineHeight.screenTitle },
  subtitle: { color: colors.muted, fontSize: typography.size.body, lineHeight: typography.lineHeight.body, marginTop: 8 },
  form: { gap: 24, marginTop: 32 },
  label: { color: colors.navy, fontSize: typography.size.label, fontWeight: typography.weight.bold, marginBottom: 8 },
  input: { borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.navy, fontSize: typography.size.body, height: 52, paddingHorizontal: 16 },
  inputError: { borderColor: colors.danger },
  inputFocused: { borderColor: themeColors.primary, borderWidth: 2 },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 6 },
  continueButton: { alignItems: 'center', backgroundColor: themeColors.primary, borderRadius: 12, justifyContent: 'center', minHeight: 54 },
  continueButtonDisabled: { backgroundColor: '#64748B' },
  buttonPressed: { opacity: 0.86 },
  buttonFocused: { borderColor: themeColors.brand, borderWidth: 3 },
  continueButtonText: { color: colors.white, fontSize: 16, fontWeight: '800' },
});
