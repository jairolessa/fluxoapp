import { useLocalSearchParams, useRouter } from 'expo-router';
import TransactionDetailScreen from '../../src/screens/transaction-detail/TransactionDetailScreen';
import { useDemoTransactions } from '../../src/hooks/useDemoTransactions';

export default function TransactionDetailRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = rawId?.slice(0, 80) ?? '';
  const transactions = useDemoTransactions();
  const transaction = transactions.find((item) => item.id === id) ?? null;

  return (
    <TransactionDetailScreen
      transaction={transaction}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/extrato'))}
      onChangeCategory={() => router.push({ pathname: '/transacao/[id]/categoria', params: { id } })}
    />
  );
}
