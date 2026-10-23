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
  track: '#334155',
  incomeOnDark: '#86EFAC',
  expenseOnDark: '#FCA5A5',
  warningOnDark: '#FCD34D',
  accent: '#4ADE80',
  placeholderOnDark: '#94A3B8',
  /** Border of inputs and unselected chips: 3.07:1 on rowSurface, 3.75:1 on navy (non-text contrast). */
  fieldBorder: '#64748B',
  successSurface: '#DCFCE7',
  errorSurface: '#FEE2E2',
  errorText: '#7F1D1D',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radii = { control: 12, card: 24, pill: 999 } as const;
export const minTouchTarget = 44;

export const typography = {
  size: { caption: 12, label: 14, body: 15, button: 16, title: 18, screenTitle: 28, amount: 32 },
  lineHeight: { caption: 18, body: 22, title: 24, screenTitle: 36 },
  weight: { regular: '400', medium: '600', bold: '700', extraBold: '800' },
} as const;

/** Durations in ms. Components skip animation when the OS asks for reduced motion. */
export const motion = { fast: 120, base: 220, notice: 3500 } as const;

export const interactions = {
  focusOnLight: '#0F172A',
  focusOnDark: '#4ADE80',
  focusOnPrimary: '#FFFFFF',
  pressedOpacity: 0.82,
  pressedScale: 0.98,
} as const;
