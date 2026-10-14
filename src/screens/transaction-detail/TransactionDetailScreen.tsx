import { Text, View } from 'react-native';
import DemoPage, { demoPageStyles as styles } from '../../components/DemoPage';
import PrimaryButton from '../../components/PrimaryButton';
import { DemoTransaction, formatDemoCurrency } from '../../services/mockDashboardData';

type TransactionDetailScreenProps = {
  transaction: DemoTransaction | null;
  onBack: () => void;
  onChangeCategory: () => void;
};

export default function TransactionDetailScreen({ transaction, onBack, onChangeCategory }: TransactionDetailScreenProps) {
  return (
    <DemoPage title="Detalhes da movimentação" onBack={onBack}>
      {transaction ? (
        <View style={[styles.card, styles.stack]}>
          <View>
            <Text style={styles.label}>Descrição</Text>
            <Text style={styles.value}>{transaction.description}</Text>
          </View>
          <View>
            <Text style={styles.label}>Valor</Text>
            <Text style={styles.amount}>{transaction.type === 'income' ? '+' : '−'}{formatDemoCurrency(transaction.amountInCents)}</Text>
          </View>
          <View>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.value}>{transaction.date}</Text>
          </View>
          <View>
            <Text style={styles.label}>Categoria atual</Text>
            <Text style={styles.value}>{transaction.category}</Text>
          </View>
          <PrimaryButton label="Alterar categoria" onPress={onChangeCategory} style={{ marginTop: 8 }} />
        </View>
      ) : (
        <View style={[styles.card, styles.empty]}>
          <Text style={styles.value}>Movimentação não encontrada</Text>
          <Text style={[styles.body, { textAlign: 'center', marginTop: 8 }]}>Volte ao extrato e escolha um item da lista.</Text>
          <PrimaryButton label="Voltar ao extrato" onPress={onBack} style={{ marginTop: 20, minWidth: 180 }} />
        </View>
      )}
    </DemoPage>
  );
}
