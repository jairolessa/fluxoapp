import { Formik } from 'formik';
import { cache, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  Alert
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

type RegisterValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

type RegisterScreenProps = {
  onBackToLogin: () => void;
  onRegistrationComplete: (fullName: string, userId: string) => void;
};

const initialValues: RegisterValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
};

const registerSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(10, 'Informe seu nome completo.')
    .required('O nome completo é obrigatório.'),
  email: Yup.string()
    .trim()
    .email('Informe um e-mail válido.')
    .required('O e-mail é obrigatório.'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .required('A senha é obrigatória.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'As senhas devem ser iguais.')
    .required('Confirme sua senha.'),
  acceptedTerms: Yup.boolean()
    .oneOf([true], 'Você precisa aceitar os termos para continuar.')
    .required('Você precisa aceitar os termos para continuar.'),
});

export default function RegisterScreen({
  onBackToLogin,
  onRegistrationComplete,
}: RegisterScreenProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const handleRegister = (values: RegisterValues) => {
    try{
      const user = mockAuthStore.register(values.fullName, values.email, values.password)
      onRegistrationComplete(values.fullName, user.id);
    } catch(err){
      Alert.alert('Não foi possível criar a conta', (err as Error).message);
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
            <Pressable accessibilityRole="button" onPress={onBackToLogin} style={styles.backButton}>
              <Text style={styles.backButtonText}>‹ Voltar para entrar</Text>
            </Pressable>
            <View style={styles.brandRow}>
              <View accessibilityElementsHidden style={styles.brandMark}>
                <Text style={styles.brandCurrency}>R$</Text>
              </View>
              <Text style={styles.brandName}>FLUXO</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>Comece a ter uma visão mais clara da sua vida financeira.</Text>

            <Formik
              initialValues={initialValues}
              validationSchema={registerSchema}
              onSubmit={handleRegister}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isValid,
                setFieldTouched,
                setFieldValue,
                touched,
                values,
              }) => (
                <View style={styles.form}>
                  <Field
                    accessibilityLabel="Nome completo"
                    autoComplete="name"
                    error={errors.fullName}
                    label="Nome completo"
                    onBlur={handleBlur('fullName')}
                    onChangeText={handleChange('fullName')}
                    placeholder="Digite seu nome completo!"
                    touched={touched.fullName}
                    value={values.fullName}
                  />

                  <Field
                    accessibilityLabel="E-mail"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    error={errors.email}
                    keyboardType="email-address"
                    label="E-mail"
                    onBlur={handleBlur('email')}
                    onChangeText={handleChange('email')}
                    placeholder="voce@exemplo.com"
                    textContentType="emailAddress"
                    touched={touched.email}
                    value={values.email}
                  />

                  <PasswordField
                    error={errors.password}
                    isVisible={isPasswordVisible}
                    label="Senha"
                    onBlur={handleBlur('password')}
                    onChangeText={handleChange('password')}
                    onToggleVisibility={() => setIsPasswordVisible((visible) => !visible)}
                    placeholder="Crie uma senha segura"
                    touched={touched.password}
                    value={values.password}
                  />

                  <PasswordField
                    error={errors.confirmPassword}
                    isVisible={isConfirmationVisible}
                    label="Confirmar senha"
                    onBlur={handleBlur('confirmPassword')}
                    onChangeText={handleChange('confirmPassword')}
                    onSubmitEditing={() => handleSubmit()}
                    onToggleVisibility={() => setIsConfirmationVisible((visible) => !visible)}
                    placeholder="Repita sua senha"
                    touched={touched.confirmPassword}
                    value={values.confirmPassword}
                  />

                  <View>
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: values.acceptedTerms }}
                      onPress={() => {
                        setFieldValue('acceptedTerms', !values.acceptedTerms);
                        setFieldTouched('acceptedTerms', true, false);
                      }}
                      style={styles.termsRow}
                    >
                      <View style={[styles.checkbox, values.acceptedTerms ? styles.checkboxChecked : undefined]}>
                        {values.acceptedTerms ? <Text style={styles.checkboxMark}>✓</Text> : null}
                      </View>
                      <Text style={styles.termsText}>
                        Li e aceito os <Text style={styles.termsLink}>Termos de Uso</Text> e a{' '}
                        <Text style={styles.termsLink}>Política de Privacidade</Text>.
                      </Text>
                    </Pressable>
                    {touched.acceptedTerms && errors.acceptedTerms ? (
                      <Text accessibilityLiveRegion="polite" style={styles.errorText}>{errors.acceptedTerms}</Text>
                    ) : null}
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    disabled={!isValid}
                    onPress={() => handleSubmit()}
                    style={({ pressed }) => [
                      styles.createButton,
                      !isValid ? styles.createButtonDisabled : undefined,
                      pressed && isValid ? styles.buttonPressed : undefined,
                    ]}
                  >
                    <Text style={styles.createButtonText}>Criar conta</Text>
                  </Pressable>
                </View>
              )}
            </Formik>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Já possui uma conta?</Text>
              <Pressable accessibilityRole="link" onPress={onBackToLogin}>
                <Text style={styles.loginLink}> Entrar</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = {
  accessibilityLabel: string;
  autoCapitalize?: 'none';
  autoComplete?: 'email' | 'name';
  autoCorrect?: boolean;
  error?: string;
  keyboardType?: 'email-address';
  label: string;
  onBlur: NonNullable<TextInputProps['onBlur']>;
  onChangeText: (text: string) => void;
  placeholder: string;
  textContentType?: 'emailAddress';
  touched?: boolean;
  value: string;
};

function Field({ error, label, touched, ...inputProps }: FieldProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        placeholderTextColor={colors.muted}
        style={[styles.input, touched && error ? styles.inputError : undefined]}
      />
      {touched && error ? <Text accessibilityLiveRegion="polite" style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

type PasswordFieldProps = {
  error?: string;
  isVisible: boolean;
  label: string;
  onBlur: NonNullable<TextInputProps['onBlur']>;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  onToggleVisibility: () => void;
  placeholder: string;
  touched?: boolean;
  value: string;
};

function PasswordField({
  error,
  isVisible,
  label,
  onBlur,
  onChangeText,
  onSubmitEditing,
  onToggleVisibility,
  placeholder,
  touched,
  value,
}: PasswordFieldProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.passwordContainer, touched && error ? styles.inputError : undefined]}>
        <TextInput
          accessibilityLabel={label}
          autoComplete="new-password"
          onBlur={onBlur}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          returnKeyType={onSubmitEditing ? 'done' : 'next'}
          secureTextEntry={!isVisible}
          style={styles.passwordInput}
          textContentType="newPassword"
          value={value}
        />
        <Pressable
          accessibilityLabel={isVisible ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`}
          hitSlop={8}
          onPress={onToggleVisibility}
          style={styles.visibilityButton}
        >
          <Text style={styles.visibilityText}>{isVisible ? 'Ocultar' : 'Mostrar'}</Text>
        </Pressable>
      </View>
      {touched && error ? <Text accessibilityLiveRegion="polite" style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.navy },
  keyboardAvoidingView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  hero: { marginBottom: 24, paddingHorizontal: 4 },
  backButton: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', marginBottom: 16 },
  backButtonText: { color: '#BBF7D0', fontSize: 14, fontWeight: '700' },
  brandRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  brandMark: { alignItems: 'center', borderColor: colors.green, borderRadius: 22, borderWidth: 3, height: 44, justifyContent: 'center', width: 44 },
  brandCurrency: { color: colors.green, fontSize: 16, fontWeight: '800' },
  brandName: { color: colors.white, fontSize: 30, fontWeight: '800', letterSpacing: 2 },
  card: { backgroundColor: colors.white, borderRadius: 24, padding: 24 },
  title: { color: colors.navy, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 8 },
  form: { gap: 18, marginTop: 28 },
  label: { color: colors.navy, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  input: { borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.navy, fontSize: 16, height: 52, paddingHorizontal: 16 },
  passwordContainer: { alignItems: 'center', borderColor: colors.border, borderRadius: 12, borderWidth: 1, flexDirection: 'row', height: 52 },
  passwordInput: { color: colors.navy, flex: 1, fontSize: 16, height: '100%', paddingHorizontal: 16 },
  visibilityButton: { justifyContent: 'center', minHeight: 44, paddingHorizontal: 14 },
  visibilityText: { color: colors.darkGreen, fontSize: 13, fontWeight: '700' },
  termsRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 10 },
  checkbox: { alignItems: 'center', borderColor: colors.border, borderRadius: 5, borderWidth: 1.5, height: 22, justifyContent: 'center', marginTop: 1, width: 22 },
  checkboxChecked: { backgroundColor: colors.green, borderColor: colors.green },
  checkboxMark: { color: colors.white, fontSize: 15, fontWeight: '800' },
  termsText: { color: colors.muted, flex: 1, fontSize: 13, lineHeight: 20 },
  termsLink: { color: colors.darkGreen, fontWeight: '800' },
  inputError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 6 },
  createButton: { alignItems: 'center', backgroundColor: colors.green, borderRadius: 12, justifyContent: 'center', minHeight: 54, marginTop: 2 },
  createButtonDisabled: { backgroundColor: '#86BFA0' },
  buttonPressed: { opacity: 0.86 },
  createButtonText: { color: colors.white, fontSize: 16, fontWeight: '800' },
  loginRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 26 },
  loginText: { color: colors.muted, fontSize: 14 },
  loginLink: { color: colors.darkGreen, fontSize: 14, fontWeight: '800' },
});
