import { useLocalSearchParams, useRouter } from 'expo-router';
import HomeScreen from '../src/screens/home/home-screen';

export default function HomeRoute() {
  const router = useRouter();
  const { preferredName } = useLocalSearchParams<{ preferredName?: string | string[] }>();
  const rawName = Array.isArray(preferredName) ? preferredName[0] : preferredName;
  const name = rawName?.trim().slice(0, 40);

  return (
    <HomeScreen
      preferredName={name ?? ''}
      onLogout={() => router.replace('/')}
      onOpenStatement={() => router.push('/extrato')}
    />
  );
}
