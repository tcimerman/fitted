import {
  Gabarito_500Medium,
  Gabarito_600SemiBold,
  Gabarito_700Bold,
  Gabarito_800ExtraBold,
  Gabarito_900Black,
} from '@expo-google-fonts/gabarito';
import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_800ExtraBold,
} from '@expo-google-fonts/hanken-grotesk';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastHost } from '@/components/sorbet';
import { ensureDirs } from '@/services/images';
import { useOutfitStore } from '@/store/useOutfitStore';
import { usePlannerStore } from '@/store/usePlannerStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

type Persisted = { persist: { hasHydrated: () => boolean; onFinishHydration: (fn: () => void) => () => void } };
const hydrated = (store: Persisted) =>
  new Promise<void>((resolve) => {
    if (store.persist.hasHydrated()) resolve();
    else store.persist.onFinishHydration(() => resolve());
  });

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Gabarito_500Medium,
    Gabarito_600SemiBold,
    Gabarito_700Bold,
    Gabarito_800ExtraBold,
    Gabarito_900Black,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    HankenGrotesk_800ExtraBold,
  });
  const profileHydrated = useProfileStore((s) => s.hasHydrated);
  const onboardingCompleted = useProfileStore((s) => s.onboardingCompleted);
  const [dataReady, setDataReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      await ensureDirs().catch(() => {});
      await Promise.all([
        useWardrobeStore.getState().hydrate().catch(() => {}),
        useOutfitStore.getState().hydrate().catch(() => {}),
        hydrated(useSubscriptionStore),
        hydrated(usePlannerStore),
      ]);
      setDataReady(true);
    })();
  }, []);

  const ready = fontsLoaded && profileHydrated && dataReady;

  React.useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.petal }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.petal } }}>
          <Stack.Protected guard={!onboardingCompleted}>
            <Stack.Screen name="(onboarding)" />
          </Stack.Protected>
          <Stack.Protected guard={onboardingCompleted}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add-garment" options={{ presentation: 'modal' }} />
            <Stack.Screen name="garment/[id]" />
            <Stack.Screen name="try-on/[outfitId]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="outfit/[id]" />
            <Stack.Screen name="dev/gallery" />
            <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
            <Stack.Screen name="streak" options={{ presentation: 'modal' }} />
            <Stack.Screen name="planner" />
            <Stack.Screen name="invite" options={{ presentation: 'modal' }} />
          </Stack.Protected>
        </Stack>
        <ToastHost />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
