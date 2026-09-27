// "Aha" #2 — the personal style plan, with a first spin from the pieces the
// user just added (offline composer, instant, no key needed).
import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';
import { goalTitle, hoursSavedPerYear } from '@/components/onboarding/quiz';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { Garment, SBadge, SChip, UIcon } from '@/components/sorbet';
import { spinLocally } from '@/services/localStylist';
import { useProfileStore } from '@/store/useProfileStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { colors, radii, shadow } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={[{ backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.rule, borderRadius: radii.card, padding: 16, gap: 10 }, shadow('sm')]}>
      <Text style={{ fontFamily: fonts.body800, fontSize: 11.5, letterSpacing: 1.5, textTransform: 'uppercase', color: colors.muted }}>{title}</Text>
      {children}
    </View>
  );
}

export default function PlanStep() {
  const { next } = useOnboardingNav('plan');
  const profile = useProfileStore((s) => s.profile);
  const garments = useWardrobeStore((s) => s.garments);
  const city = useSettingsStore((s) => s.manualCity?.name);
  const reminderOn = useSettingsStore((s) => s.dailyReminder);
  const reminderTime = useSettingsStore((s) => s.reminderTime);

  const preview = React.useMemo(() => {
    const [o] = spinLocally({
      occasion: '', weather: undefined, profile, garments, avoidSets: [],
      enabledSlots: ['top', 'bottom', 'shoes', 'accessory'],
    });
    if (!o) return [];
    const byId = new Map(garments.map((g) => [g.id, g]));
    return [...new Set(o.slots.map((s) => s.itemId))].map((id) => byId.get(id)!).filter(Boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [garments.length]);

  const goals = profile.quiz?.goals ?? [];

  return (
    <StepScaffold
      kicker="your style plan is ready"
      title={profile.name ? `here’s the plan, ${profile.name}` : 'here’s the plan'}
      ctaLabel="looks good — continue"
      onNext={() => next()}
    >
      <View style={{ gap: 12 }}>
        <Card title="first spin from your closet">
          {preview.length >= 2 ? (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {preview.slice(0, 4).map((g) => (
                <View key={g.id} style={{ flex: 1, aspectRatio: 0.8, borderRadius: 12, backgroundColor: colors.petalDeep, overflow: 'hidden' }}>
                  <Image source={{ uri: g.thumbUri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                </View>
              ))}
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              {(['tee', 'pants', 'shoe'] as const).map((t, i) => (
                <View key={t} style={{ flex: 1, aspectRatio: 1, borderRadius: 12, backgroundColor: colors.petalDeep, alignItems: 'center', justifyContent: 'center' }}>
                  <Garment type={t} color={[colors.punch, colors.grape, colors.mint][i]} size={40} />
                </View>
              ))}
            </View>
          )}
          <Text style={type.small}>
            {preview.length >= 2 ? 'made from pieces you just added — tomorrow’s spin checks the weather too.' : 'add a top, bottom and shoes and your first real spin lands on today.'}
          </Text>
        </Card>

        <Card title="your vibe">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {profile.preferredStyles.length ? profile.preferredStyles.map((s) => <SChip key={s} active>{s}</SChip>) : <SChip>still exploring</SChip>}
          </View>
        </Card>

        <Card title="what we’ll do for you">
          {goals.slice(0, 3).map((g) => (
            <View key={g} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <UIcon name="check" size={16} color={colors.mintDeep} stroke={2.6} />
              <Text style={[type.body, { flex: 1, fontSize: 14.5 }]}>{goalTitle(g)}</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <UIcon name="clock" size={16} color={colors.mintDeep} stroke={2.4} />
            <Text style={[type.body, { flex: 1, fontSize: 14.5 }]}>give you back ~{hoursSavedPerYear(profile.quiz)} hours a year</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
            <SBadge tone="mint" icon="pin">{city ? `weather: ${city.toLowerCase()}` : 'weather: your location'}</SBadge>
            {reminderOn ? <SBadge tone="grape" icon="bell">daily spin {reminderTime}</SBadge> : null}
            <SBadge tone="punch" icon="hanger">{garments.length} {garments.length === 1 ? 'piece' : 'pieces'}</SBadge>
          </View>
        </Card>
      </View>
    </StepScaffold>
  );
}
