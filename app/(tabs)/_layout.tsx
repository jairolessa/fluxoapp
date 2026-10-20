import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors, typography } from '../../src/theme/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: { name: string; title: string; icon: IconName; iconFocused: IconName }[] = [
  { name: 'home', title: 'Início', icon: 'home-outline', iconFocused: 'home' },
  { name: 'extrato', title: 'Extrato', icon: 'list-outline', iconFocused: 'list' },
  { name: 'nova', title: 'Nova', icon: 'add-circle-outline', iconFocused: 'add-circle' },
  { name: 'perfil', title: 'Perfil', icon: 'person-outline', iconFocused: 'person' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.mutedOnDark,
        tabBarLabelStyle: { fontSize: typography.size.caption, fontWeight: typography.weight.medium },
        tabBarStyle: { backgroundColor: colors.rowSurface, borderTopColor: colors.track },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarAccessibilityLabel: tab.title,
            tabBarIcon: ({ color, focused, size }) => <Ionicons color={color} name={focused ? tab.iconFocused : tab.icon} size={size} />,
          }}
        />
      ))}
    </Tabs>
  );
}
