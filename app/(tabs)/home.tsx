import { useRouter } from 'expo-router';
import { useSession } from '../../src/context/SessionContext';
import { useBudget } from '../../src/hooks/useBudget';
import { useTransactions } from '../../src/hooks/useTransactions';
import HomeScreen from '../../src/screens/home/home-screen';

export default function HomeRoute() {
  const router = useRouter();
  const { user } = useSession();
  const { transactions, ready } = useTransactions();
  const { limits } = useBudget();
  const [firstName] = (user?.fullName ?? '').trim().split(/\s+/);

  return (
    <HomeScreen
      limits={limits}
      onNewTransaction={() => router.navigate('/nova')}
      onOpenBudget={() => router.push('/orcamento')}
      onOpenStatement={() => router.navigate('/extrato')}
      onOpenTransaction={(id) => router.push({ pathname: '/transacao/[id]', params: { id } })}
      preferredName={user?.preferredName ?? firstName}
      ready={ready}
      transactions={transactions}
    />
  );
}
