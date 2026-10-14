import { Text, View } from 'react-native';
import DemoPage, { demoPageStyles as styles } from '../../components/DemoPage';
import PrimaryButton from '../../components/PrimaryButton';
import TransactionListItem from '../../components/TransactionListItem';
import { useDemoTransactions } from '../../hooks/useDemoTransactions';

type StatementScreenProps = {
  onBack: () => void;
  onOpenTransaction: (id: string) => void;
};

export default function StatementScreen({ onBack, onOpenTransaction }: StatementScreenProps) {
  const transactions = useDemoTransactions();
  return (
    <DemoPage title="Extrato" onBack={onBack}>
      <Text style={styles.body}>Toque em uma movimentação para consultar os detalhes e alterar sua categoria.</Text>
      {transactions.length === 0 ? (
        <View style={[styles.card, styles.empty]}>
          <Text style={styles.value}>Nenhuma movimentação</Text>
          <Text style={[styles.body, { textAlign: 'center', marginTop: 8 }]}>Quando houver dados de demonstração, eles aparecerão aqui.</Text>
          <PrimaryButton label="Voltar" onPress={onBack} style={{ marginTop: 20, minWidth: 160 }} />
        </View>
      ) : (
        <View>
          <Text style={styles.sectionTitle}>Outubro de 2026</Text>
          {transactions.map((transaction) => (
            <TransactionListItem key={transaction.id} transaction={transaction} onPress={() => onOpenTransaction(transaction.id)} />
          ))}
        </View>
      )}
    </DemoPage>
  );
}
