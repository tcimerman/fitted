// Referral: "give a friend a month of plus, get a month free" (Cherrypick /
// Rocket Money pattern). Sharing works today; crediting the reward needs a
// backend that tracks installs by code — see docs/NEXT-LEVEL.md (wave 2).
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnterIn, SButton, SIconButton, UIcon, IconName, toast } from '@/components/sorbet';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { colors, radii, shadow } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';

const STEPS: { icon: IconName; title: string; sub: string }[] = [
  { icon: 'share', title: 'share your link', sub: 'send it to the friend who always asks “what should i wear?”' },
  { icon: 'gift', title: 'they get a month of plus', sub: 'free, on top of the normal 7-day trial.' },
  { icon: 'crown', title: 'you get a month free', sub: 'for every friend who starts plus. up to 12 months.' },
];

export default function InviteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const code = useSubscriptionStore((s) => s.referralCode);
  const link = `https://outfitspin.com/i/${code}`;

  const share = async () => {
    try {
      await Share.share({ message: `i use OutfitSpin to pick my outfits every morning — here’s a free month of plus 👗✨ ${link}` });
    } catch {
      toast(`copy your link: ${link}`, 'grape', 'share');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.lemonSoft, paddingTop: insets.top + 10 }}>
      <View style={{ alignItems: 'flex-end', paddingHorizontal: 20 }}>
        <SIconButton icon="x" size={40} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} accessibilityLabel="close" />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 30 }}>
        <EnterIn style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 64 }}>🎁</Text>
          <Text style={[type.hero, { fontSize: 32, lineHeight: 36, textAlign: 'center', marginTop: 8 }]}>give a month of plus, get a month free</Text>
          <Text style={[type.bodyMuted, { textAlign: 'center', marginTop: 10, maxWidth: 300 }]}>
            good fits are better with friends. share outfitspin and you both win.
          </Text>
        </EnterIn>

        <View style={[{ marginTop: 22, backgroundColor: colors.white, borderRadius: radii.card, borderWidth: 1.5, borderColor: colors.rule, padding: 16, alignItems: 'center', gap: 4 }, shadow('sm')]}>
          <Text style={type.overline}>your code</Text>
          <Text selectable style={{ fontFamily: fonts.display900, fontSize: 34, letterSpacing: 4, color: colors.plum }}>{code}</Text>
          <Text selectable style={type.small}>{link}</Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <SButton variant="primary" size="lg" full icon="share" onPress={() => void share()}>
            share my invite link
          </SButton>
        </View>

        <Text style={[type.label, { marginTop: 26, marginBottom: 12 }]}>how it works</Text>
        <View style={{ gap: 14 }}>
          {STEPS.map((s) => (
            <View key={s.title} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
                <UIcon name={s.icon} size={18} color={colors.punch} stroke={2.2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.body700, fontSize: 15, color: colors.plum }}>{s.title}</Text>
                <Text style={type.small}>{s.sub}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={[type.small, { marginTop: 20, textAlign: 'center' }]}>rewards are credited once your friend’s plus starts.</Text>
      </ScrollView>
    </View>
  );
}
