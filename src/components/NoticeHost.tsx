import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { noticeStore } from '../services/noticeStore';
import { colors, minTouchTarget, motion, radii, spacing, typography } from '../theme/tokens';

/** Renders the current notice above every screen: announced politely, auto-dismissed, closable. */
export default function NoticeHost() {
  const notice = useSyncExternalStore(noticeStore.subscribe, noticeStore.getSnapshot, noticeStore.getSnapshot);
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!notice) return;
    progress.setValue(reduceMotion ? 1 : 0);
    if (!reduceMotion) Animated.timing(progress, { toValue: 1, duration: motion.base, useNativeDriver: true }).start();
    AccessibilityInfo.announceForAccessibility(notice.message);
    const timer = setTimeout(() => noticeStore.dismiss(), motion.notice);
    return () => clearTimeout(timer);
  }, [notice, progress, reduceMotion]);

  if (!notice) return null;
  const isError = notice.tone === 'error';

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      pointerEvents="box-none"
      style={[styles.wrap, { top: insets.top + spacing.sm, opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) }] }]}
    >
      <Pressable
        accessibilityHint="Toque para fechar"
        accessibilityLabel={notice.message}
        accessibilityRole="alert"
        onPress={() => noticeStore.dismiss()}
        style={[styles.notice, isError ? styles.error : styles.success]}
      >
        <Text style={[styles.text, isError ? styles.errorText : styles.successText]}>{isError ? '✕  ' : '✓  '}{notice.message}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { left: spacing.md, position: 'absolute', right: spacing.md, zIndex: 10 },
  notice: { borderRadius: radii.control, justifyContent: 'center', minHeight: minTouchTarget, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  success: { backgroundColor: colors.successSurface, borderColor: colors.primary, borderWidth: 1 },
  error: { backgroundColor: colors.errorSurface, borderColor: colors.danger, borderWidth: 1 },
  text: { fontSize: typography.size.label, fontWeight: typography.weight.bold },
  successText: { color: colors.primary },
  errorText: { color: colors.errorText },
});
