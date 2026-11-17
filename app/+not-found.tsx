import { useRouter } from 'expo-router';
import { Text } from 'react-native';
import PrimaryButton from '../src/components/PrimaryButton';
import Screen from '../src/components/Screen';
import { colors, spacing, typography } from '../src/theme/tokens';

/** Shown for any address the app does not know, e.g. an old link or a mistyped web URL. */
export default function NotFoundRoute() {
  const router = useRouter();

  return (
    <Screen title="Página não encontrada">
      <Text style={{ color: colors.mutedOnDark, fontSize: typography.size.body, lineHeight: typography.lineHeight.body, marginBottom: spacing.lg }}>
        Este endereço não existe ou foi movido. Volte ao início para continuar.
      </Text>
      <PrimaryButton label="Voltar ao início" onPress={() => router.replace('/')} />
    </Screen>
  );
}
