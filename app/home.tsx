import { useLocalSearchParams } from 'expo-router';
import HomeScreen from '../src/screens/home';

export default function HomeRoute() {
  const { preferredName } = useLocalSearchParams<{ preferredName?: string | string[] }>();
  const name = Array.isArray(preferredName) ? preferredName[0] : preferredName;

  return <HomeScreen preferredName={name ?? ''} />;
}
