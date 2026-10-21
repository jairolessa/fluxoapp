import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTransaction } from '../../src/hooks/useTransactions';
import TransactionDetailScreen from '../../src/screens/transaction-detail/TransactionDetailScreen';

export default function TransactionDetailRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = rawId?.slice(0, 80) ?? '';
  const { transaction, ready } = useTransaction(id);

  return (
    <TransactionDetailScreen
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/extrato'))}
      onChangeCategory={() => router.push({ pathname: '/transaction/[id]/category', params: { id } })}
      ready={ready}
      transaction={transaction}
    />
  );
}
