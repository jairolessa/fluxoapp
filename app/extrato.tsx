import { useRouter } from 'expo-router';
import StatementScreen from '../src/screens/statement/StatementScreen';

export default function StatementRoute() {
  const router = useRouter();
  return (
    <StatementScreen
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      onOpenTransaction={(id) => router.push({ pathname: '/transacao/[id]', params: { id } })}
    />
  );
}
