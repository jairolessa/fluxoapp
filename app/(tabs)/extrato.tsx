import { useRouter } from 'expo-router';
import { useTransactions } from '../../src/hooks/useTransactions';
import StatementScreen from '../../src/screens/statement/StatementScreen';

export default function StatementRoute() {
  const router = useRouter();
  const { transactions, ready } = useTransactions();

  return (
    <StatementScreen
      onNewTransaction={() => router.navigate('/nova')}
      onOpenTransaction={(id) => router.push({ pathname: '/transaction/[id]', params: { id } })}
      ready={ready}
      transactions={transactions}
    />
  );
}
