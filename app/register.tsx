import { useRouter } from 'expo-router';
import { useSession } from '../src/context/SessionContext';
import RegisterScreen from '../src/screens/register/register-screen';

export default function RegisterRoute() {
  const router = useRouter();
  const { register } = useSession();

  return (
    <RegisterScreen
      onBackToLogin={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      onSubmit={async (fullName, email, password) => {
        await register(fullName, email, password);
      }}
    />
  );
}
