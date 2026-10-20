import { useRouter } from 'expo-router';
import { useTransactions } from '../src/hooks/useTransactions';
import BudgetScreen from '../src/screens/budget/BudgetScreen';

export default function BudgetRoute() {
  const router = useRouter();
  const { transactions } = useTransactions();

  return <BudgetScreen onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))} transactions={transactions} />;
}
