import { Formik } from 'formik';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import PrimaryButton from '../../components/PrimaryButton';
import { colors as themeColors, typography } from '../../theme/tokens';
import { noticeStore } from '../../services/noticeStore';

const colors = {
  green: themeColors.brand,
  darkGreen: themeColors.primary,
  navy: themeColors.navy,
  white: themeColors.surface,
  muted: themeColors.muted,
  danger: themeColors.danger,
  border: themeColors.border,
};

type LoginValues = {
  email: string;
  password: string;
};

const initialValues: LoginValues = {
  email: '',
  password: '',
};

const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Informe um e-mail válido.')
    .required('O e-mail é obrigatório.'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .required('A senha é obrigatória.'),
});

type LoginScreenProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
  onCreateAccount: () => void;
  onForgotPassword: () => void;
};

export default function LoginScreen({ onSubmit, onCreateAccount, onForgotPassword }: LoginScreenProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | 'submit' | 'signup' | 'forgot' | null>(null);

  const handleLogin = async (values: LoginValues) => {
    try {
      await onSubmit(values.email, values.password);
    } catch (err) {
      noticeStore.show(err instanceof Error ? err.message : 'Não foi possível entrar. Tente novamente.', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.brandRow}>
              <View accessibilityElementsHidden style={styles.brandMark}>
                <Text style={styles.brandCurrency}>R$</Text>
              </View>
              <Text style={styles.brandName}>FLUXO</Text>
            </View>
            <Text style={styles.tagline}>Seu dinheiro no piloto automático.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Boas-vindas</Text>
            <Text style={styles.subtitle}>Entre para cuidar melhor da sua vida financeira.</Text>

            <Formik
              initialValues={initialValues}
              validateOnMount
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isValid,
                isSubmitting,
                isValidating,
                touched,
                values,
              }) => (
                <View style={styles.form}>
                  <View>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                      accessibilityLabel="E-mail"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect={false}
                      keyboardType="email-address"
                      onBlur={(event) => { setFocusedField(null); handleBlur('email')(event); }}
                      onChangeText={handleChange('email')}
                      onFocus={() => setFocusedField('email')}
                      placeholder="voce@exemplo.com"
                      placeholderTextColor={colors.muted}
                      style={[styles.input, focusedField === 'email' ? styles.inputFocused : undefined, touched.email && errors.email ? styles.inputError : undefined]}
                      textContentType="emailAddress"
                      value={values.email}
                    />
                    {touched.email && errors.email ? (
                      <Text accessibilityLiveRegion="polite" style={styles.errorText}>{errors.email}</Text>
                    ) : null}
                  </View>

                  <View>
                    <Text style={styles.label}>Senha</Text>
                    <View style={[styles.passwordContainer, focusedField === 'password' ? styles.inputFocused : undefined, touched.password && errors.password ? styles.inputError : undefined]}>
                      <TextInput
                        accessibilityLabel="Senha"
                        autoComplete="current-password"
                        onBlur={(event) => { setFocusedField(null); handleBlur('password')(event); }}
                        onChangeText={handleChange('password')}
                        onFocus={() => setFocusedField('password')}
                        onSubmitEditing={() => handleSubmit()}
                        placeholder="Digite sua senha"
                        placeholderTextColor={colors.muted}
                        returnKeyType="go"
                        secureTextEntry={!isPasswordVisible}
                        style={styles.passwordInput}
                        textContentType="password"
                        value={values.password}
                      />
                      <Pressable
                        accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                        accessibilityRole="button"
                        hitSlop={8}
                        onPress={() => setIsPasswordVisible((visible) => !visible)}
                        style={styles.visibilityButton}
                      >
                        <Text style={styles.visibilityText}>{isPasswordVisible ? 'Ocultar' : 'Mostrar'}</Text>
                      </Pressable>
                    </View>
                    {touched.password && errors.password ? (
                      <Text accessibilityLiveRegion="polite" style={styles.errorText}>{errors.password}</Text>
                    ) : null}
                  </View>

                  <Pressable
                    accessibilityRole="link"
                    onFocus={() => setFocusedField('forgot')}
                    onBlur={() => setFocusedField(null)}
                    onPress={onForgotPassword}
                    style={({ pressed }) => [styles.forgotPasswordButton, focusedField === 'forgot' ? styles.linkFocused : undefined, pressed ? styles.buttonPressed : undefined]}
                  >
                    <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
                  </Pressable>

                  <PrimaryButton disabled={!isValid || isValidating} label={isSubmitting ? 'Entrando…' : 'Entrar'} loading={isSubmitting} onPress={() => handleSubmit()} />
                </View>
              )}
            </Formik>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Ainda não tem uma conta?</Text>
              <Pressable
                accessibilityRole="link"
                onFocus={() => setFocusedField('signup')}
                onBlur={() => setFocusedField(null)}
                onPress={onCreateAccount}
                style={({ pressed }) => [styles.signupLinkTarget, focusedField === 'signup' ? styles.linkFocused : undefined, pressed ? styles.buttonPressed : undefined]}
              >
                <Text style={styles.signupLink}> Criar conta</Text>
              </Pressable>
            </View>
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
  hero: { marginBottom: 32, paddingHorizontal: 4 },
  brandRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  brandMark: {
    alignItems: 'center', borderColor: colors.green, borderRadius: 22, borderWidth: 3,
    height: 44, justifyContent: 'center', width: 44,
  },
  brandCurrency: { color: colors.green, fontSize: 16, fontWeight: '800' },
  brandName: { color: colors.white, fontSize: 30, fontWeight: '800', letterSpacing: 2 },
  tagline: { color: '#86EFAC', fontSize: 16, marginTop: 10 },
  card: { backgroundColor: colors.white, borderRadius: 24, padding: 24 },
  title: { color: colors.navy, fontSize: typography.size.screenTitle, fontWeight: typography.weight.extraBold, lineHeight: typography.lineHeight.screenTitle },
  subtitle: { color: colors.muted, fontSize: typography.size.body, lineHeight: typography.lineHeight.body, marginTop: 8 },
  form: { gap: 18, marginTop: 28 },
  label: { color: colors.navy, fontSize: typography.size.label, fontWeight: typography.weight.bold, marginBottom: 8 },
  input: {
    borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.navy,
    fontSize: typography.size.body, height: 52, paddingHorizontal: 16,
  },
  passwordContainer: {
    alignItems: 'center', borderColor: colors.border, borderRadius: 12, borderWidth: 1,
    flexDirection: 'row', height: 52,
  },
  passwordInput: { color: colors.navy, flex: 1, fontSize: typography.size.body, height: '100%', paddingHorizontal: 16 },
  visibilityButton: { justifyContent: 'center', minHeight: 44, paddingHorizontal: 14 },
  visibilityText: { color: colors.darkGreen, fontSize: 13, fontWeight: '700' },
  inputError: { borderColor: colors.danger },
  inputFocused: { borderColor: colors.darkGreen, borderWidth: 2 },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 6 },
  forgotPasswordButton: { alignSelf: 'flex-end', justifyContent: 'center', marginTop: -6, minHeight: 44, minWidth: 44 },
  forgotPasswordText: { color: colors.darkGreen, fontSize: 14, fontWeight: '700' },
  loginButton: {
    alignItems: 'center', backgroundColor: colors.darkGreen, borderRadius: 12,
    justifyContent: 'center', minHeight: 54, marginTop: 2,
  },
  loginButtonDisabled: { backgroundColor: '#64748B' },
  buttonPressed: { opacity: 0.86 },
  buttonFocused: { borderColor: colors.green, borderWidth: 3 },
  loginButtonText: { color: colors.white, fontSize: 16, fontWeight: '800' },
  signupRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 26, minHeight: 44 },
  signupText: { color: colors.muted, fontSize: 14 },
  signupLink: { color: colors.darkGreen, fontSize: 14, fontWeight: '800' },
  signupLinkTarget: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44 },
  linkFocused: { borderColor: colors.green, borderRadius: 6, borderWidth: 2 },
});
