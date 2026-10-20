import { useRouter } from 'expo-router';
import { useSession } from '../src/context/SessionContext';
import PersonalizeNameScreen from '../src/screens/personalize-name/personalize-name-screen';

export default function PersonalizeNameRoute() {
  const router = useRouter();
  const { user, updatePreferredName } = useSession();
  const [firstName] = (user?.fullName ?? '').trim().split(/\s+/);

  return (
    <PersonalizeNameScreen
      initialName={user?.preferredName ?? firstName}
      onContinue={async (preferredName) => {
        await updatePreferredName(preferredName);
        router.replace('/home');
      }}
    />
  );
}
