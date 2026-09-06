import { useLocalSearchParams, useRouter } from 'expo-router';
import PersonalizeNameScreen from '../src/screens/personalize-name';

export default function PersonalizeNameRoute() {
  const router = useRouter();
  const { firstName } = useLocalSearchParams<{ firstName?: string | string[] }>();
  const initialName = Array.isArray(firstName) ? firstName[0] : firstName;

  return (
    <PersonalizeNameScreen
      initialName={initialName ?? ''}
      onContinue={(preferredName) => router.replace({ pathname: '/home', params: { preferredName } })}
    />
  );
}
