import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTransaction } from '../../../src/hooks/useTransactions';
import TransactionCategoryScreen from '../../../src/screens/transaction-category/TransactionCategoryScreen';
import { transactionStore } from '../../../src/services/transactionStore';

export default function TransactionCategoryRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = rawId?.slice(0, 80) ?? '';
  const { transaction, ready } = useTransaction(id);

  return (
    <TransactionCategoryScreen
      onBack={() => (router.canGoBack() ? router.back() : router.replace({ pathname: '/transaction/[id]', params: { id } }))}
      onSave={(category) => transactionStore.updateCategory(id, category)}
      ready={ready}
      transaction={transaction}
    />
  );
}
