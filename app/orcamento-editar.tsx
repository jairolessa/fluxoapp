import { useRouter } from 'expo-router';
import { useBudget } from '../src/hooks/useBudget';
import BudgetEditScreen from '../src/screens/budget/BudgetEditScreen';
import { budgetStore } from '../src/services/budgetStore';

export default function BudgetEditRoute() {
  const router = useRouter();
  const { limits, configured, ready } = useBudget();

  // Wait for the stored budget so the form never starts from stale suggested values.
  if (!ready) return null;

  return (
    <BudgetEditScreen
      configured={configured}
      limits={limits}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/orcamento'))}
      onSave={(next) => budgetStore.save(next)}
    />
  );
}
