import { Formik } from 'formik';
import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Yup from 'yup';
import Chip from '../../components/Chip';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import Screen from '../../components/Screen';
import { categoriesFor, formatCurrency, NewTransactionInput, parseAmountToCents, TransactionLocation, TransactionType } from '../../domain/finance';
import { useConnection } from '../../hooks/useConnection';
import { DevicePermissionError, getCurrentPlace, pickReceipt } from '../../services/device';
import { colors, radii, spacing, typography } from '../../theme/tokens';
import { noticeStore } from '../../services/noticeStore';

type Values = {
  type: TransactionType;
  description: string;
  amountDigits: string;
  category: string;
  receiptUri?: string;
  location?: TransactionLocation;
};

const initialValues: Values = { type: 'expense', description: '', amountDigits: '', category: '' };

const schema = Yup.object({
  description: Yup.string().trim().min(2, 'Informe uma descrição com pelo menos 2 caracteres.').required('A descrição é obrigatória.'),
  amountDigits: Yup.string().test('amount', 'Informe um valor maior que zero.', (value) => parseAmountToCents(value ?? '') > 0),
  category: Yup.string().required('Escolha uma categoria.'),
});

type NewTransactionScreenProps = {
  onSave: (input: NewTransactionInput) => Promise<void>;
};

export default function NewTransactionScreen({ onSave }: NewTransactionScreenProps) {
  const connection = useConnection();
  const [locating, setLocating] = useState(false);

  const handleDeviceError = (title: string, error: unknown) => {
    const message = error instanceof DevicePermissionError ? error.message : 'Não foi possível concluir agora. Tente novamente.';
    noticeStore.show(`${title}. ${message}`, 'error');
  };

  const submit = async (values: Values, resetForm: () => void) => {
    try {
      await onSave({
        description: values.description.trim(),
        category: values.category,
        amountInCents: parseAmountToCents(values.amountDigits),
        type: values.type,
        occurredAt: Date.now(),
        receiptUri: values.receiptUri,
        location: values.location,
      });
      resetForm();
    } catch {
      noticeStore.show('Não foi possível salvar. Tente novamente em instantes.', 'error');
    }
  };

  return (
    <Screen scroll={false} title="Nova movimentação">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <Formik initialValues={initialValues} onSubmit={(values, helpers) => submit(values, helpers.resetForm)} validateOnMount validationSchema={schema}>
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, isValid, setFieldTouched, setFieldValue, touched, values }) => {
            const cents = parseAmountToCents(values.amountDigits);

            const attachReceipt = async (source: 'camera' | 'library') => {
              try {
                const uri = await pickReceipt(source);
                if (uri) setFieldValue('receiptUri', uri);
              } catch (error) {
                handleDeviceError('Comprovante', error);
              }
            };

            const attachLocation = async () => {
              setLocating(true);
              try {
                setFieldValue('location', await getCurrentPlace());
              } catch (error) {
                handleDeviceError('Localização', error);
              } finally {
                setLocating(false);
              }
            };

            return (
              <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View accessibilityRole="radiogroup" style={styles.row}>
                  <Chip label="Despesa" onPress={() => { setFieldValue('type', 'expense'); setFieldValue('category', ''); }} selected={values.type === 'expense'} />
                  <Chip label="Receita" onPress={() => { setFieldValue('type', 'income'); setFieldValue('category', ''); }} selected={values.type === 'income'} />
                </View>

                <FormField
                  error={errors.amountDigits}
                  keyboardType="number-pad"
                  label="Valor"
                  onBlur={handleBlur('amountDigits')}
                  onChangeText={(text) => setFieldValue('amountDigits', cents === 0 && !text ? '' : String(parseAmountToCents(text)))}
                  placeholder="R$ 0,00"
                  touched={touched.amountDigits}
                  value={cents > 0 ? formatCurrency(cents) : ''}
                />

                <FormField
                  autoCapitalize="sentences"
                  error={errors.description}
                  label="Descrição"
                  maxLength={60}
                  onBlur={handleBlur('description')}
                  onChangeText={handleChange('description')}
                  placeholder="Ex.: Almoço com a equipe"
                  touched={touched.description}
                  value={values.description}
                />

                <View>
                  <Text style={styles.label}>Categoria</Text>
                  <View accessibilityRole="radiogroup" style={styles.wrap}>
                    {categoriesFor(values.type).map((category) => (
                      <Chip key={category} label={category} onPress={() => { setFieldValue('category', category); setFieldTouched('category', true, false); }} selected={values.category === category} />
                    ))}
                  </View>
                  {touched.category && errors.category ? <Text accessibilityLiveRegion="polite" style={styles.error}>{errors.category}</Text> : null}
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Comprovante</Text>
                  {values.receiptUri ? <Image accessibilityLabel="Foto do comprovante" resizeMode="cover" source={{ uri: values.receiptUri }} style={styles.preview} /> : null}
                  <View style={styles.row}>
                    <PrimaryButton label={values.receiptUri ? 'Tirar outra foto' : 'Fotografar'} onPress={() => attachReceipt('camera')} style={styles.flex} variant="secondary" />
                    <PrimaryButton label="Galeria" onPress={() => attachReceipt('library')} style={styles.flex} variant="secondary" />
                  </View>
                  {values.receiptUri ? <PrimaryButton label="Remover foto" onPress={() => setFieldValue('receiptUri', undefined)} variant="secondary" /> : null}
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Local</Text>
                  {values.location ? (
                    <Text style={styles.cardText}>
                      {values.location.label ?? `${values.location.latitude.toFixed(5)}, ${values.location.longitude.toFixed(5)}`}
                    </Text>
                  ) : (
                    <Text style={styles.cardText}>Registre onde esta movimentação aconteceu.</Text>
                  )}
                  {locating ? (
                    <ActivityIndicator accessibilityLabel="Obtendo localização" color={colors.primary} />
                  ) : (
                    <View style={styles.row}>
                      <PrimaryButton label={values.location ? 'Atualizar local' : 'Usar minha localização'} onPress={attachLocation} style={styles.flex} variant="secondary" />
                      {values.location ? <PrimaryButton label="Remover" onPress={() => setFieldValue('location', undefined)} variant="secondary" /> : null}
                    </View>
                  )}
                </View>

                <Text accessibilityLiveRegion="polite" style={styles.connection}>
                  {connection.online ? `Conectado: ${connection.label}.` : 'Sem conexão: a movimentação será salva neste aparelho.'}
                </Text>

                <PrimaryButton disabled={!isValid} label={isSubmitting ? 'Salvando…' : 'Salvar movimentação'} loading={isSubmitting} onPress={() => handleSubmit()} />
              </ScrollView>
            );
          }}
        </Formik>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  form: { gap: spacing.lg, paddingBottom: spacing.xl },
  row: { flexDirection: 'row', gap: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  label: { color: colors.surface, fontSize: typography.size.label, fontWeight: typography.weight.bold, marginBottom: spacing.sm },
  error: { color: colors.expenseOnDark, fontSize: typography.size.caption, marginTop: 6 },
  card: { backgroundColor: colors.surface, borderRadius: radii.card, gap: spacing.md, padding: spacing.lg },
  cardTitle: { color: colors.navy, fontSize: typography.size.title, fontWeight: typography.weight.extraBold },
  cardText: { color: '#475569', fontSize: typography.size.body, lineHeight: typography.lineHeight.body },
  preview: { backgroundColor: colors.track, borderRadius: radii.control, height: 180, width: '100%' },
  connection: { color: colors.mutedOnDark, fontSize: typography.size.caption, textAlign: 'center' },
});
