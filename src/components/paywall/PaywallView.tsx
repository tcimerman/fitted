// OutfitSpin Plus paywall. Used as the last onboarding step and as a modal
// (soft paywall) when a free limit is hit. Yearly + 7-day trial is the default;
// the trial timeline makes "when do I pay" explicit (Quizlet / 5 Minute Journal).
// Purchases are MOCKED — see src/services/purchases.ts.
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnterIn, SButton, SIconButton, SPlusBadge, Springy, UIcon, IconName, toast } from '@/components/sorbet';
import {
  formatPrice, IS_MOCK_PURCHASES, perMonth, PlanId, PLANS, trialTimeline, yearlySavingsPct,
} from '@/services/purchases';
import { FREE_LIMITS, PaywallReason, PLUS_LIMITS, useSubscriptionStore } from '@/store/useSubscriptionStore';
import { useProfileStore } from '@/store/useProfileStore';
import { colors, radii, shadow } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';
import { hapticSuccess } from '@/utils/feedback';

const HEADLINES: Record<PaywallReason, { kicker: string; title: (name: string) => string }> = {
  onboarding: { kicker: 'your stylist is ready', title: (n) => (n ? `${n}, unlock your full closet stylist` : 'unlock your full closet stylist') },
  spins: { kicker: `you used today’s ${FREE_LIMITS.spinsPerDay} free spins`, title: () => 'keep spinning — no daily limit' },
  tryon: { kicker: 'free try-ons used up this month', title: () => 'see every fit on you first' },
  closet: { kicker: `free closet is full (${FREE_LIMITS.closetPieces} pieces)`, title: () => 'room for your whole wardrobe' },
  planner: { kicker: 'plan the whole week', title: () => 'plan 7 days ahead, not just tomorrow' },
  profile: { kicker: 'outfitspin plus', title: () => 'get the most out of your closet' },
};

const FEATURES: { icon: IconName; title: string; sub: string }[] = [
  { icon: 'shuffle', title: 'unlimited ai spins', sub: `free: ${FREE_LIMITS.spinsPerDay} a day` },
  { icon: 'sparkle', title: `${PLUS_LIMITS.tryOnsPerMonth} try-ons a month`, sub: `see yourself in the fit · free: ${FREE_LIMITS.tryOnsPerMonth}` },
  { icon: 'hanger', title: 'unlimited closet', sub: `free: ${FREE_LIMITS.closetPieces} pieces` },
  { icon: 'calendar', title: 'plan your whole week', sub: 'free: today + tomorrow' },
];

const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase();

function PlanCard({ id, selected, onPress }: { id: PlanId; selected: boolean; onPress: () => void }) {
  const plan = PLANS[id];
  const yearly = plan.period === 'year';
  return (
    <Springy
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={yearly ? 'yearly plan' : 'monthly plan'}
      style={[
        {
          borderWidth: 2, borderColor: selected ? colors.punch : colors.rule, borderRadius: radii.tile,
          backgroundColor: selected ? colors.white : colors.petal, paddingVertical: 14, paddingHorizontal: 16,
          flexDirection: 'row', alignItems: 'center', gap: 12,
        },
        selected ? shadow('sm') : {},
      ] as never}
    >
      <View
        style={{
          width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: selected ? colors.punch : colors.rule,
          backgroundColor: selected ? colors.punch : 'transparent', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {selected ? <UIcon name="check" size={14} color="#fff" stroke={2.8} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: fonts.display800, fontSize: 17, color: colors.plum }}>{yearly ? 'yearly' : 'monthly'}</Text>
          {yearly ? (
            <View style={{ backgroundColor: colors.lemon, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontFamily: fonts.body800, fontSize: 10.5, color: colors.plum }}>save {yearlySavingsPct()}%</Text>
            </View>
          ) : null}
        </View>
        <Text style={[type.small, { marginTop: 2 }]}>
          {yearly ? `${plan.trialDays} days free, then ${formatPrice(plan.price)}/year` : `${formatPrice(plan.price)}/month · cancel anytime`}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontFamily: fonts.display800, fontSize: 17, color: colors.plum }}>{perMonth(plan)}</Text>
        <Text style={type.small}>/month</Text>
      </View>
    </Springy>
  );
}

function Timeline({ planId }: { planId: PlanId }) {
  const plan = PLANS[planId];
  const { reminder, charge } = trialTimeline(plan);
  const items: { icon: IconName; tone: string; title: string; sub: string }[] = [
    { icon: 'lock', tone: colors.punch, title: 'today', sub: 'every plus feature unlocks. no charge.' },
    { icon: 'bell', tone: colors.grape, title: `${fmtDate(reminder)} · day ${plan.trialDays - 2}`, sub: 'we remind you your trial is ending.' },
    { icon: 'crown', tone: colors.mint, title: `${fmtDate(charge)} · day ${plan.trialDays}`, sub: `plus starts at ${formatPrice(plan.price)}/year. cancel before and pay nothing.` },
  ];
  return (
    <View style={{ gap: 0 }}>
      {items.map((it, i) => (
        <View key={it.title} style={{ flexDirection: 'row', gap: 14 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: it.tone, alignItems: 'center', justifyContent: 'center' }}>
              <UIcon name={it.icon} size={16} color="#fff" stroke={2.3} />
            </View>
            {i < items.length - 1 ? <View style={{ width: 3, flex: 1, minHeight: 18, backgroundColor: colors.rule, borderRadius: 2 }} /> : null}
          </View>
          <View style={{ flex: 1, paddingBottom: i < items.length - 1 ? 14 : 0, paddingTop: 5 }}>
            <Text style={{ fontFamily: fonts.body800, fontSize: 14.5, color: colors.plum }}>{it.title}</Text>
            <Text style={[type.small, { marginTop: 1, lineHeight: 17 }]}>{it.sub}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

interface PaywallViewProps {
  reason: PaywallReason;
  /** called after purchase/restore or when the user closes / continues free */
  onDone: (result: 'purchased' | 'closed') => void;
}

export function PaywallView({ reason, onDone }: PaywallViewProps) {
  const insets = useSafeAreaInsets();
  const name = useProfileStore((s) => s.profile.name);
  const purchase = useSubscriptionStore((s) => s.purchase);
  const restore = useSubscriptionStore((s) => s.restore);
  const busy = useSubscriptionStore((s) => s.busy);
  const [planId, setPlanId] = React.useState<PlanId>('plus_yearly');
  const plan = PLANS[planId];
  const head = HEADLINES[reason];
  const hasTrial = plan.trialDays > 0;

  const buy = async () => {
    const ok = await purchase(planId);
    if (ok) {
      hapticSuccess();
      toast(hasTrial ? 'welcome to plus — your free week starts now ✨' : 'welcome to plus ✨', 'mint', 'crown');
      onDone('purchased');
    } else {
      toast('purchase didn’t go through — you weren’t charged', 'punch', 'x');
    }
  };

  const doRestore = async () => {
    const ok = await restore();
    if (ok) {
      toast('plus restored — welcome back ✨', 'mint', 'crown');
      onDone('purchased');
    } else {
      toast('no purchase found on this account', 'lemon', 'refresh');
    }
  };

  const open = (path: string) => void WebBrowser.openBrowserAsync(`https://outfitspin.com/${path}`).catch(() => {});

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: insets.top + 8 }}>
        <SIconButton icon="x" size={40} accessibilityLabel="close" onPress={() => onDone('closed')} />
        <Text onPress={busy ? undefined : () => void doRestore()} accessibilityRole="button" style={{ fontFamily: fonts.body700, fontSize: 14, color: colors.muted, padding: 8 }}>
          restore
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 6, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <EnterIn>
          <SPlusBadge label="outfitspin plus" />
          <Text style={[type.kicker, { marginTop: 14 }]}>{head.kicker}</Text>
          <Text style={[type.hero, { fontSize: 33, lineHeight: 37, marginTop: 6 }]}>{head.title(name)}</Text>
        </EnterIn>

        <View style={{ gap: 12, marginTop: 20 }}>
          {FEATURES.map((f) => (
            <View key={f.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: colors.punchSoft, alignItems: 'center', justifyContent: 'center' }}>
                <UIcon name={f.icon} size={18} color={colors.punch} stroke={2.2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.body700, fontSize: 15, color: colors.plum }}>{f.title}</Text>
                <Text style={type.small}>{f.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ gap: 10, marginTop: 22 }}>
          <PlanCard id="plus_yearly" selected={planId === 'plus_yearly'} onPress={() => setPlanId('plus_yearly')} />
          <PlanCard id="plus_monthly" selected={planId === 'plus_monthly'} onPress={() => setPlanId('plus_monthly')} />
        </View>

        {hasTrial ? (
          <View style={{ marginTop: 22, backgroundColor: colors.white, borderRadius: radii.card, borderWidth: 1.5, borderColor: colors.rule, padding: 18 }}>
            <Text style={[type.overline, { marginBottom: 12 }]}>how your free week works</Text>
            <Timeline planId={planId} />
          </View>
        ) : null}

        <Text style={[type.small, { textAlign: 'center', marginTop: 18, lineHeight: 17 }]}>
          {hasTrial
            ? `${plan.trialDays}-day free trial, then ${formatPrice(plan.price)}/year, renews automatically. cancel anytime in your store settings.`
            : `${formatPrice(plan.price)}/month, renews automatically. cancel anytime in your store settings.`}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 8 }}>
          <Text onPress={() => open('terms')} style={[type.small, { textDecorationLine: 'underline' }]}>terms</Text>
          <Text onPress={() => open('privacy')} style={[type.small, { textDecorationLine: 'underline' }]}>privacy</Text>
          <Text onPress={busy ? undefined : () => void doRestore()} style={[type.small, { textDecorationLine: 'underline' }]}>restore purchase</Text>
        </View>
        {IS_MOCK_PURCHASES ? (
          <Text style={[type.small, { textAlign: 'center', marginTop: 10, color: colors.lemonInk }]}>demo mode · purchases are simulated, nothing is charged</Text>
        ) : null}
      </ScrollView>

      <View style={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: Math.max(insets.bottom, 16), gap: 8, borderTopWidth: 1, borderTopColor: colors.rule, backgroundColor: colors.petal }}>
        {hasTrial ? (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
            <UIcon name="check" size={15} color={colors.mintDeep} stroke={2.6} />
            <Text style={{ fontFamily: fonts.body700, fontSize: 13.5, color: colors.mintDeep }}>no payment due now</Text>
          </View>
        ) : null}
        <SButton variant="primary" size="lg" full loading={busy} onPress={() => void buy()}>
          {hasTrial ? 'start my free week' : `get plus · ${formatPrice(plan.price)}/mo`}
        </SButton>
        <Text
          onPress={() => onDone('closed')}
          accessibilityRole="button"
          style={{ fontFamily: fonts.body700, fontSize: 14, color: colors.muted, textAlign: 'center', paddingVertical: 6 }}
        >
          {reason === 'onboarding' ? 'continue with the free plan' : 'maybe later'}
        </Text>
      </View>
    </View>
  );
}
