import { useLocalSearchParams, useRouter } from 'expo-router';
import PersonalizeNameScreen from '../src/screens/personalize-name/personalize-name-screen';
import { mockAuthStore } from '../src/services/mockAuthStore';

export default function PersonalizeNameRoute() {
  const router = useRouter();
  const { firstName, userId } = useLocalSearchParams<{ 
    firstName?: string | string[];
    userId?: string | string[];
  }>();
  const initialName = Array.isArray(firstName) ? firstName[0] : firstName;
  const resolvedUserId = Array.isArray(userId) ? userId[0] : userId;

  return (
    <PersonalizeNameScreen
      initialName={initialName ?? ''}
      onContinue={(preferredName) => {
        if(resolvedUserId) mockAuthStore.setPreferredName(resolvedUserId, preferredName);
        router.dismissTo({ pathname: '/'});
      }}
    />
  );
}
