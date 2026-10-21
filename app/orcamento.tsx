import { useRouter } from 'expo-router';
import { useBudget } from '../src/hooks/useBudget';
import { useTransactions } from '../src/hooks/useTransactions';
import BudgetScreen from '../src/screens/budget/BudgetScreen';

export default function BudgetRoute() {
  const router = useRouter();
  const { transactions } = useTransactions();
  const { limits, configured } = useBudget();

  return (
    <BudgetScreen
      configured={configured}
      limits={limits}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      onEdit={() => router.push('/orcamento-editar')}
      transactions={transactions}
    />
  );
}
