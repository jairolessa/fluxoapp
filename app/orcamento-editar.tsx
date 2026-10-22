import { useRouter } from 'expo-router';
import { useBudget } from '../src/hooks/useBudget';
import BudgetEditScreen from '../src/screens/budget/BudgetEditScreen';
import { noticeStore } from '../src/services/noticeStore';
import { budgetStore } from '../src/services/budgetStore';

export default function BudgetEditRoute() {
  const router = useRouter();
  const { limits, configured, ready } = useBudget();

  if (!ready) return null;

  return (
    <BudgetEditScreen
      configured={configured}
      limits={limits}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/orcamento'))}
      onSave={async (next) => {
        await budgetStore.save(next);
        noticeStore.show('Orçamento atualizado.');
      }}
    />
  );
}
