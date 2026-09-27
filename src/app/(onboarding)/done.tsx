import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Confetti, EnterIn, SButton, SPlusBadge } from '@/components/sorbet';
import { useEntitlements } from '@/store/useSubscriptionStore';
import { useProfileStore } from '@/store/useProfileStore';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/typography';

export default function DoneStep() {
  const insets = useSafeAreaInsets();
  const name = useProfileStore((s) => s.profile.name);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);
  const { isPlus, limits } = useEntitlements();
  const [run, setRun] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setRun(1), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingHorizontal: 24, justifyContent: 'center' }}>
      <Confetti run={run} />
      <EnterIn>
        <Text style={{ fontSize: 56, marginBottom: 18 }}>🎉</Text>
        {isPlus ? <View style={{ marginBottom: 12 }}><SPlusBadge label="plus unlocked" /></View> : null}
        <Text style={[type.hero, { fontSize: 40, lineHeight: 44 }]}>
          you&apos;re in, {name || 'bestie'}!
        </Text>
        <Text style={[type.bodyMuted, { fontSize: 16, lineHeight: 24, marginTop: 14, maxWidth: 300 }]}>
          {isPlus
            ? 'closet’s stocked, vibes are set, unlimited spins unlocked. let’s find today’s fit.'
            : `closet’s stocked, vibes are set. you’ve got ${limits.spinsPerDay} free spins a day — let’s use the first one.`}
        </Text>
      </EnterIn>
      <View style={{ position: 'absolute', left: 24, right: 24, bottom: Math.max(insets.bottom, 16) + 8 }}>
        <SButton variant="primary" size="lg" full icon="sparkle" onPress={completeOnboarding}>
          spin today’s fit
        </SButton>
      </View>
    </View>
  );
}
