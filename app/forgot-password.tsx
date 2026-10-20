import { useRouter } from 'expo-router';
import ForgotPasswordScreen from '../src/screens/forgot-password/ForgotPasswordScreen';
import { authStore } from '../src/services/authStore';

export default function ForgotPasswordRoute() {
  const router = useRouter();
  const goToLogin = () => router.replace('/');

  return (
    <ForgotPasswordScreen
      onBack={() => (router.canGoBack() ? router.back() : goToLogin())}
      onDone={goToLogin}
      onSubmit={(email, newPassword) => authStore.resetPassword(email, newPassword)}
    />
  );
}
