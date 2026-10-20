import { Alert, Image, Linking, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import Screen, { screenStyles as styles } from '../../components/Screen';
import { formatDate, formatSignedCurrency, Transaction } from '../../domain/finance';
import { mapsUrl } from '../../services/device';
import { colors, radii } from '../../theme/tokens';

type TransactionDetailScreenProps = {
  transaction: Transaction | null;
  ready: boolean;
  onBack: () => void;
  onChangeCategory: () => void;
};

export default function TransactionDetailScreen({ transaction, ready, onBack, onChangeCategory }: TransactionDetailScreenProps) {
  const openMap = async () => {
    if (!transaction?.location) return;
    try {
      await Linking.openURL(mapsUrl(transaction.location));
    } catch {
      Alert.alert('Mapa indisponível', 'Não foi possível abrir o mapa neste aparelho.');
    }
  };

  return (
    <Screen onBack={onBack} title="Detalhes">
      {!ready ? null : transaction ? (
        <View style={[styles.card, styles.stack]}>
          <View>
            <Text style={styles.label}>Descrição</Text>
            <Text style={styles.value}>{transaction.description}</Text>
          </View>
          <View>
            <Text style={styles.label}>{transaction.type === 'income' ? 'Receita' : 'Despesa'}</Text>
            <Text style={local.amount}>{formatSignedCurrency(transaction)}</Text>
          </View>
          <View>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.value}>{formatDate(transaction.occurredAt)}</Text>
          </View>
          <View>
            <Text style={styles.label}>Categoria</Text>
            <Text style={styles.value}>{transaction.category}</Text>
          </View>
          {transaction.location ? (
            <View style={local.block}>
              <Text style={styles.label}>Local</Text>
              <Text style={styles.value}>
                {transaction.location.label ?? `${transaction.location.latitude.toFixed(5)}, ${transaction.location.longitude.toFixed(5)}`}
              </Text>
              <PrimaryButton label="Abrir no mapa" onPress={openMap} variant="secondary" />
            </View>
          ) : null}
          {transaction.receiptUri ? (
            <View>
              <Text style={styles.label}>Comprovante</Text>
              <Image accessibilityLabel="Foto do comprovante" resizeMode="cover" source={{ uri: transaction.receiptUri }} style={local.receipt} />
            </View>
          ) : null}
          <PrimaryButton label="Alterar categoria" onPress={onChangeCategory} />
        </View>
      ) : (
        <View style={[styles.card, styles.empty]}>
          <Text style={styles.value}>Movimentação não encontrada</Text>
          <Text style={[styles.label, local.centered]}>Volte ao extrato e escolha um item da lista.</Text>
          <PrimaryButton label="Voltar ao extrato" onPress={onBack} style={local.backButton} />
        </View>
      )}
    </Screen>
  );
}

const local = StyleSheet.create({
  amount: { color: colors.navy, fontSize: 28, fontWeight: '800' },
  block: { gap: 8 },
  receipt: { backgroundColor: colors.track, borderRadius: radii.control, height: 220, width: '100%' },
  centered: { marginTop: 8, textAlign: 'center' },
  backButton: { marginTop: 20, minWidth: 180 },
});
