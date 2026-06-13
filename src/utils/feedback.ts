// Platform-safe haptics + destructive-action confirmation.
// expo-haptics rejects on web; RN-web's Alert is a no-op — both handled here.
import * as Haptics from 'expo-haptics';
import { Alert, Platform } from 'react-native';

export function hapticTap() {
  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function hapticSelect() {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
}

export function hapticSuccess() {
  if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function confirmAction(title: string, message: string, confirmLabel: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'cancel', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
