import { useRouter } from 'expo-router';
import LoginScreen from '../src/screens/login';

export default function LoginRoute() {
  const router = useRouter();

  return <LoginScreen onCreateAccount={() => router.push('/register')} />;
}
