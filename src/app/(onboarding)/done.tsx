import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Confetti, EnterIn, SButton, SPlusBadge } from '@/components/sorbet';
import { useEntitlements } from '@/store/useSubscriptionStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useProfileStore } from '@/store/useProfileStore';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/typography';

export default function DoneStep() {
  const insets = useSafeAreaInsets();
  const name = useProfileStore((s) => s.profile.name);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);
  const { isPlus, limits } = useEntitlements();
  const pieces = useWardrobeStore((s) => s.garments.length);
  const lead = pieces > 0 ? 'closet’s stocked, vibes are set.' : 'vibes are set — add a few pieces and the stylist takes it from there.';
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
            ? `${lead} unlimited spins unlocked.`
            : `${lead} you’ve got ${limits.spinsPerDay} free spins a day.`}
        </Text>
      </EnterIn>
      <View style={{ position: 'absolute', left: 24, right: 24, bottom: Math.max(insets.bottom, 16) + 8 }}>
        <SButton variant="primary" size="lg" full icon="sparkle" onPress={completeOnboarding}>
          {pieces > 0 ? 'spin today’s fit' : 'let’s go'}
        </SButton>
      </View>
    </View>
  );
}
