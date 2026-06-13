import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Confetti, EnterIn, SButton } from '@/components/sorbet';
import { useProfileStore } from '@/store/useProfileStore';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/typography';

export default function DoneStep() {
  const insets = useSafeAreaInsets();
  const name = useProfileStore((s) => s.profile.name);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);
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
        <Text style={[type.hero, { fontSize: 40, lineHeight: 44 }]}>
          you&apos;re in, {name ? name.toLowerCase() : 'bestie'}!
        </Text>
        <Text style={[type.bodyMuted, { fontSize: 16, lineHeight: 24, marginTop: 14, maxWidth: 300 }]}>
          closet&apos;s stocked, vibes are set. let&apos;s find out what today&apos;s lewk is.
        </Text>
      </EnterIn>
      <View style={{ position: 'absolute', left: 24, right: 24, bottom: Math.max(insets.bottom, 16) + 8 }}>
        <SButton variant="primary" size="lg" full icon="sparkle" onPress={completeOnboarding}>
          style my day
        </SButton>
      </View>
    </View>
  );
}
