import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { confirmAction } from '../../services/confirm';
import Screen, { screenStyles as shared } from '../../components/Screen';
import { ConnectionInfo } from '../../hooks/useConnection';
import { colors, spacing } from '../../theme/tokens';

type ProfileScreenProps = {
  fullName: string;
  email: string;
  preferredName: string;
  connection: ConnectionInfo;
  appVersion: string;
  updateId: string | null;
  onChangeName: () => void;
  onOpenBudget: () => void;
  onSignOut: () => void;
};

export default function ProfileScreen({ fullName, email, preferredName, connection, appVersion, updateId, onChangeName, onOpenBudget, onSignOut }: ProfileScreenProps) {
  const confirmSignOut = async () => {
    if (await confirmAction('Sair da conta?', 'Você precisará entrar novamente para ver suas movimentações.', 'Sair')) onSignOut();
  };

  return (
    <Screen title="Perfil">
      <View style={[shared.card, shared.stack]}>
        <View style={styles.identity}>
          <View accessibilityElementsHidden style={styles.avatar}>
            <Text style={styles.avatarText}>{(preferredName || fullName).charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.identityText}>
            <Text style={shared.value}>{fullName}</Text>
            <Text style={shared.label}>{email}</Text>
          </View>
        </View>
        <View>
          <Text style={shared.label}>Como chamamos você</Text>
          <Text style={shared.value}>{preferredName || '—'}</Text>
        </View>
        <PrimaryButton label="Alterar nome de exibição" onPress={onChangeName} variant="secondary" />
      </View>

      <Text accessibilityRole="header" style={shared.sectionTitle}>Orçamento</Text>
      <View style={[shared.card, shared.stack]}>
        <Text style={styles.cardText}>Defina quanto pretende gastar por mês em cada categoria e acompanhe o uso dos limites.</Text>
        <PrimaryButton label="Ver e editar orçamento" onPress={onOpenBudget} variant="secondary" />
      </View>

      <Text accessibilityRole="header" style={shared.sectionTitle}>Conexão</Text>
      <View style={[shared.card, styles.connectionRow]}>
        <View accessibilityElementsHidden style={[styles.dot, connection.online ? styles.dotOnline : styles.dotOffline]} />
        <View style={styles.identityText}>
          <Text style={shared.value}>{connection.online ? 'Online' : 'Offline'}</Text>
          <Text style={shared.label}>{connection.label}</Text>
        </View>
      </View>

      <Text accessibilityRole="header" style={shared.sectionTitle}>Sobre o app</Text>
      <View style={[shared.card, shared.stack]}>
        <View>
          <Text style={shared.label}>Versão</Text>
          <Text style={shared.value}>{appVersion}</Text>
        </View>
        <View>
          <Text style={shared.label}>Atualização instalada</Text>
          <Text style={shared.value}>{updateId ? updateId.slice(0, 8) : 'Versão original'}</Text>
        </View>
      </View>

      <PrimaryButton label="Sair da conta" onPress={confirmSignOut} style={styles.signOut} variant="secondary" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  identityText: { flex: 1 },
  avatar: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 28, height: 56, justifyContent: 'center', width: 56 },
  avatarText: { color: colors.surface, fontSize: 22, fontWeight: '800' },
  cardText: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  connectionRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  dot: { borderRadius: 7, height: 14, width: 14 },
  dotOnline: { backgroundColor: colors.brand },
  dotOffline: { backgroundColor: colors.danger },
  signOut: { marginTop: spacing.lg },
});
