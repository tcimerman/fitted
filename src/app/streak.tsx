// Streak celebration after "wear it" (Speak / Alta pattern): big count, this
// week's dots, then either the try-on or back to Today.
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Confetti, EnterIn, SButton, SIconButton, UIcon, toast } from '@/components/sorbet';
import { useStreak } from '@/store/useStreak';
import { entitlementSnapshot } from '@/store/useSubscriptionStore';
import { colors } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';

function message(n: number, best: number): string {
  if (n <= 1) return 'first fit locked in. come back tomorrow and it’s a streak.';
  if (n >= best && n > 2) return 'that’s your longest streak ever. don’t you dare stop.';
  if (n < 7) return `${7 - n} more ${7 - n === 1 ? 'day' : 'days'} to a full week of fits.`;
  return 'a whole week+ of intentional fits. main character behaviour.';
}

export default function StreakScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { outfitId, tryon } = useLocalSearchParams<{ outfitId?: string; tryon?: string }>();
  const { current, best, week } = useStreak();
  const [run, setRun] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setRun(1), 250);
    return () => clearTimeout(t);
  }, []);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const seeOnMe = () => {
    if (!outfitId) return close();
    if (entitlementSnapshot().tryOnsLeft <= 0) {
      router.replace('/paywall?reason=tryon' as never);
      return;
    }
    router.replace(`/try-on/${outfitId}` as never);
  };

  const share = async () => {
    try {
      await Share.share({ message: `${current}-day outfit streak on OutfitSpin 🔥 my closet finally works for me → https://outfitspin.com` });
    } catch {
      toast('couldn’t open sharing here', 'lemon', 'share');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingTop: insets.top + 10, paddingHorizontal: 24 }}>
      <Confetti run={run} />
      <View style={{ alignItems: 'flex-end' }}>
        <SIconButton icon="x" size={40} onPress={close} accessibilityLabel="close" />
      </View>
      <EnterIn style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 }}>
        <Text style={{ fontSize: 84 }}>🔥</Text>
        <Text style={{ fontFamily: fonts.display900, fontSize: 88, lineHeight: 92, color: colors.punch, letterSpacing: -3 }}>{current}</Text>
        <Text style={[type.h2, { marginTop: -2 }]}>day streak</Text>
        <Text style={[type.bodyMuted, { textAlign: 'center', marginTop: 10, maxWidth: 290 }]}>{message(current, best)}</Text>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 28, backgroundColor: colors.white, borderRadius: 24, borderWidth: 1.5, borderColor: colors.rule, paddingVertical: 16, paddingHorizontal: 16 }}>
          {week.map((d) => (
            <View key={d.key} style={{ alignItems: 'center', gap: 6 }}>
              <Text style={{ fontFamily: d.isToday ? fonts.body800 : fonts.body600, fontSize: 12, color: d.isToday ? colors.punch : colors.muted }}>{d.label}</Text>
              <View
                style={{
                  width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: d.worn ? colors.punch : colors.petalDeep,
                  borderWidth: d.isToday && !d.worn ? 2 : 0, borderColor: colors.punch,
                }}
              >
                {d.worn ? <UIcon name="check" size={15} color="#fff" stroke={2.8} /> : null}
              </View>
            </View>
          ))}
        </View>
        {best > 1 ? <Text style={[type.small, { marginTop: 12 }]}>best streak · {best} days</Text> : null}
      </EnterIn>
      <View style={{ paddingBottom: Math.max(insets.bottom, 16), gap: 10 }}>
        {tryon === '1' ? (
          <SButton variant="primary" size="lg" full icon="sparkle" onPress={seeOnMe}>
            see it on me
          </SButton>
        ) : (
          <SButton variant="primary" size="lg" full icon="check" onPress={close}>
            keep it going
          </SButton>
        )}
        <SButton variant="ghost" full icon="share" onPress={() => void share()}>
          share my streak
        </SButton>
      </View>
    </View>
  );
}
