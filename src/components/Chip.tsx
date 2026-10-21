import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, interactions, minTouchTarget, radii, spacing } from '../theme/tokens';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected ? styles.selected : undefined, pressed ? styles.pressed : undefined]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : undefined]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { alignItems: 'center', borderColor: colors.track, borderRadius: radii.pill, borderWidth: 1, justifyContent: 'center', minHeight: minTouchTarget, paddingHorizontal: spacing.md },
  selected: { backgroundColor: colors.primary, borderColor: colors.accent },
  pressed: { opacity: interactions.pressedOpacity },
  label: { color: colors.mutedOnDark, fontSize: 14, fontWeight: '600' },
  labelSelected: { color: colors.surface, fontWeight: '800' },
});
