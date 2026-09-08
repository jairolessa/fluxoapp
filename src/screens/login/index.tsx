import { Formik } from 'formik';
import { useState } from 'react';
import {
  Alert,
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
import { mockAuthStore } from '../../services/mockAuthStore';

const colors = {
  green: '#16A34A',
  darkGreen: '#166534',
  navy: '#0F172A',
  white: '#FFFFFF',
  muted: '#64748B',
  danger: '#DC2626',
  border: '#CBD5E1',
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
  onCreateAccount: () => void;
  onLoginSuccess: (user: { id: string; fullName: string; preferredName?: string }) => void;
};

export default function LoginScreen({ onCreateAccount, onLoginSuccess }: LoginScreenProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const showUnavailableAction = (title: string) => {
    Alert.alert(title, 'Esta funcionalidade será disponibilizada em breve.');
  };

  const handleLogin = (values: LoginValues) => {
    try{
      const user = mockAuthStore.login(values.email, values.password);
      onLoginSuccess(user);
    } catch(err) {
      Alert.alert('Não foi possível entrar', (err as Error).message);
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
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isValid,
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
                      onBlur={handleBlur('email')}
                      onChangeText={handleChange('email')}
                      placeholder="voce@exemplo.com"
                      placeholderTextColor={colors.muted}
                      style={[styles.input, touched.email && errors.email ? styles.inputError : undefined]}
                      textContentType="emailAddress"
                      value={values.email}
                    />
                    {touched.email && errors.email ? (
                      <Text accessibilityLiveRegion="polite" style={styles.errorText}>{errors.email}</Text>
                    ) : null}
                  </View>

                  <View>
                    <Text style={styles.label}>Senha</Text>
                    <View style={[styles.passwordContainer, touched.password && errors.password ? styles.inputError : undefined]}>
                      <TextInput
                        accessibilityLabel="Senha"
                        autoComplete="current-password"
                        onBlur={handleBlur('password')}
                        onChangeText={handleChange('password')}
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
                    onPress={() => showUnavailableAction('Redefinir senha')}
                    style={styles.forgotPasswordButton}
                  >
                    <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    disabled={!isValid}
                    onPress={() => handleSubmit()}
                    style={({ pressed }) => [
                      styles.loginButton,
                      !isValid ? styles.loginButtonDisabled : undefined,
                      pressed && isValid ? styles.buttonPressed : undefined,
                    ]}
                  >
                    <Text style={styles.loginButtonText}>Entrar</Text>
                  </Pressable>
                </View>
              )}
            </Formik>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Ainda não tem uma conta?</Text>
              <Pressable
                accessibilityRole="link"
                onPress={onCreateAccount}
              >
                <Text style={styles.signupLink}> Criar conta</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.securityNote}>Seus dados são protegidos e tratados com segurança.</Text>
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
  title: { color: colors.navy, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 8 },
  form: { gap: 18, marginTop: 28 },
  label: { color: colors.navy, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  input: {
    borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.navy,
    fontSize: 16, height: 52, paddingHorizontal: 16,
  },
  passwordContainer: {
    alignItems: 'center', borderColor: colors.border, borderRadius: 12, borderWidth: 1,
    flexDirection: 'row', height: 52,
  },
  passwordInput: { color: colors.navy, flex: 1, fontSize: 16, height: '100%', paddingHorizontal: 16 },
  visibilityButton: { justifyContent: 'center', minHeight: 44, paddingHorizontal: 14 },
  visibilityText: { color: colors.darkGreen, fontSize: 13, fontWeight: '700' },
  inputError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 6 },
  forgotPasswordButton: { alignSelf: 'flex-end', marginTop: -6 },
  forgotPasswordText: { color: colors.darkGreen, fontSize: 14, fontWeight: '700' },
  loginButton: {
    alignItems: 'center', backgroundColor: colors.green, borderRadius: 12,
    justifyContent: 'center', minHeight: 54, marginTop: 2,
  },
  loginButtonDisabled: { backgroundColor: '#86BFA0' },
  buttonPressed: { opacity: 0.86 },
  loginButtonText: { color: colors.white, fontSize: 16, fontWeight: '800' },
  signupRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 26 },
  signupText: { color: colors.muted, fontSize: 14 },
  signupLink: { color: colors.darkGreen, fontSize: 14, fontWeight: '800' },
  securityNote: { color: '#CBD5E1', fontSize: 12, lineHeight: 18, marginTop: 24, textAlign: 'center' },
});
