import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import { useSession } from '../../src/context/SessionContext';
import { useConnection } from '../../src/hooks/useConnection';
import ProfileScreen from '../../src/screens/profile/ProfileScreen';

export default function ProfileRoute() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const connection = useConnection();

  if (!user) return null;

  return (
    <ProfileScreen
      appVersion={Constants.expoConfig?.version ?? '1.0.0'}
      connection={connection}
      email={user.email}
      fullName={user.fullName}
      onChangeName={() => router.push('/personalize-name')}
      onOpenBudget={() => router.push('/orcamento')}
      onSignOut={() => void signOut()}
      preferredName={user.preferredName ?? ''}
      updateId={Updates.updateId}
    />
  );
}
