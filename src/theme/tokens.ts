export const colors = {
  brand: '#16A34A',
  primary: '#166534',
  navy: '#0F172A',
  surface: '#FFFFFF',
  muted: '#64748B',
  mutedOnDark: '#CBD5E1',
  danger: '#B91C1C',
  border: '#CBD5E1',
  softGreen: '#DCFCE7',
  noticeBackground: '#FEF3C7',
  noticeText: '#78350F',
  rowSurface: '#1E293B',
  disabled: '#64748B',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radii = { control: 12, card: 24, pill: 999 } as const;
export const minTouchTarget = 44;

export const typography = {
  size: { caption: 12, label: 14, body: 15, button: 16, title: 18, screenTitle: 28, amount: 32 },
  lineHeight: { caption: 18, body: 22, title: 24, screenTitle: 36 },
  weight: { regular: '400', medium: '600', bold: '700', extraBold: '800' },
} as const;

export const interactions = {
  focusOnLight: '#0F172A',
  focusOnDark: '#4ADE80',
  focusOnPrimary: '#FFFFFF',
  pressedOpacity: 0.82,
} as const;
