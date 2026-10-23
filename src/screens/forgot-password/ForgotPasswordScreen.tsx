import { Formik } from 'formik';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import * as Yup from 'yup';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import Screen from '../../components/Screen';
import { colors, spacing, typography } from '../../theme/tokens';
import { noticeStore } from '../../services/noticeStore';

type Values = { email: string; password: string; confirmPassword: string };

const schema = Yup.object({
  email: Yup.string().trim().email('Informe um e-mail válido.').required('O e-mail é obrigatório.'),
  password: Yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres.').required('A senha é obrigatória.'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'As senhas devem ser iguais.').required('Confirme sua senha.'),
});

type ForgotPasswordScreenProps = {
  onBack: () => void;
  onSubmit: (email: string, newPassword: string) => Promise<void>;
  onDone: () => void;
};

export default function ForgotPasswordScreen({ onBack, onSubmit, onDone }: ForgotPasswordScreenProps) {
  const handleSubmit = async (values: Values) => {
    try {
      await onSubmit(values.email, values.password);
      noticeStore.show('Senha redefinida. Use a nova senha para entrar.');
      onDone();
    } catch (error) {
      noticeStore.show(error instanceof Error ? error.message : 'Não foi possível redefinir. Tente novamente.', 'error');
    }
  };

  return (
    <Screen onBack={onBack} scroll={false} title="Redefinir senha">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <Formik initialValues={{ email: '', password: '', confirmPassword: '' }} onSubmit={handleSubmit} validateOnMount validationSchema={schema}>
          {({ errors, handleBlur, handleChange, handleSubmit: submit, isSubmitting, isValid, touched, values }) => (
            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={styles.intro}>Informe o e-mail da sua conta e escolha uma nova senha.</Text>
              <FormField autoCapitalize="none" autoComplete="email" autoCorrect={false} error={errors.email} keyboardType="email-address" label="E-mail" onBlur={handleBlur('email')} onChangeText={handleChange('email')} placeholder="voce@exemplo.com" touched={touched.email} value={values.email} />
              <FormField autoComplete="new-password" error={errors.password} label="Nova senha" onBlur={handleBlur('password')} onChangeText={handleChange('password')} placeholder="Mínimo de 6 caracteres" secureTextEntry touched={touched.password} value={values.password} />
              <FormField autoComplete="new-password" error={errors.confirmPassword} label="Confirmar nova senha" onBlur={handleBlur('confirmPassword')} onChangeText={handleChange('confirmPassword')} onSubmitEditing={() => submit()} placeholder="Repita a nova senha" returnKeyType="done" secureTextEntry touched={touched.confirmPassword} value={values.confirmPassword} />
              <PrimaryButton disabled={!isValid} label={isSubmitting ? 'Redefinindo…' : 'Redefinir senha'} loading={isSubmitting} onPress={() => submit()} />
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  form: { gap: spacing.lg, paddingBottom: spacing.xl },
  intro: { color: colors.mutedOnDark, fontSize: typography.size.body, lineHeight: typography.lineHeight.body },
});
