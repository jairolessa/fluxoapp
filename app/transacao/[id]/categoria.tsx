import { useLocalSearchParams, useRouter } from 'expo-router';
import TransactionCategoryScreen from '../../../src/screens/transaction-category/TransactionCategoryScreen';
import { getDemoTransaction, updateDemoTransactionCategory } from '../../../src/services/mockDashboardData';

export default function TransactionCategoryRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = rawId?.slice(0, 80) ?? '';
  const transaction = getDemoTransaction(id);

  return (
    <TransactionCategoryScreen
      transaction={transaction}
      onBack={() => (router.canGoBack() ? router.back() : router.replace({ pathname: '/transacao/[id]', params: { id } }))}
      onSave={(category) => updateDemoTransactionCategory(id, category)}
    />
  );
}
