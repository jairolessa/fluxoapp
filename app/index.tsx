import { useRouter } from 'expo-router';
import { useSession } from '../src/context/SessionContext';
import LoginScreen from '../src/screens/login';

export default function LoginRoute() {
  const router = useRouter();
  const { signIn } = useSession();

  return (
    <LoginScreen
      onCreateAccount={() => router.push('/register')}
      onForgotPassword={() => router.push('/forgot-password')}
      onSubmit={async (email, password) => {
        await signIn(email, password);
      }}
    />
  );
}
