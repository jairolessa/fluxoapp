import { useRouter } from 'expo-router';
import RegisterScreen from '../src/screens/register/register-screen';

export default function RegisterRoute() {
  const router = useRouter();

  return (
    <RegisterScreen
      onBackToLogin={() => router.replace('/')}
      onRegistrationComplete={(fullName, userId) => {
        const [firstName] = fullName.trim().split(/\s+/);
        router.push({ pathname: '/personalize-name', params: { firstName, userId } });
      }}
    />
  );
}
