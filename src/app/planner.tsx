// Weekly planner (Whering / Alta pattern): the next 7 days, one fit per day.
// /planner?outfitId=… opens in "assign" mode: tap a day to drop that outfit in.
// Free plans today + tomorrow; the rest of the week is Plus.
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnterIn, SBadge, SButton, SIconButton, SPlusBadge, Springy, UIcon, toast } from '@/components/sorbet';
import { useOutfitStore } from '@/store/useOutfitStore';
import { usePlannerStore } from '@/store/usePlannerStore';
import { useEntitlements } from '@/store/useSubscriptionStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { Outfit } from '@/types';
import { colors, radii, shadow } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';
import { todayKey } from '@/utils';
import { hapticSuccess } from '@/utils/feedback';

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function Thumbs({ outfit }: { outfit: Outfit }) {
  const garments = useWardrobeStore((s) => s.garments);
  const byId = new Map(garments.map((g) => [g.id, g]));
  const items = [...new Set(outfit.slots.map((s) => s.itemId))].map((id) => byId.get(id)).filter(Boolean).slice(0, 4);
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {items.map((g) => (
        <Image key={g!.id} source={{ uri: g!.thumbUri }} style={{ width: 44, height: 52, borderRadius: 10, backgroundColor: colors.petalDeep }} contentFit="cover" />
      ))}
    </View>
  );
}

export default function PlannerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { outfitId } = useLocalSearchParams<{ outfitId?: string }>();
  const plans = usePlannerStore((s) => s.plans);
  const plan = usePlannerStore((s) => s.plan);
  const unplan = usePlannerStore((s) => s.unplan);
  const suggestions = useOutfitStore((s) => s.suggestions);
  const saved = useOutfitStore((s) => s.saved);
  const setSuggestions = useOutfitStore((s) => s.setSuggestions);
  const { isPlus, limits } = useEntitlements();
  const [assigning, setAssigning] = React.useState<Outfit | undefined>(() =>
    outfitId ? suggestions.find((o) => o.id === outfitId) ?? saved.find((o) => o.id === outfitId) : undefined,
  );
  const [pickingDay, setPickingDay] = React.useState<string | null>(null);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { i, key: todayKey(d), label: i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[d.getDay()], date: `${d.getDate()}.${d.getMonth() + 1}.` };
  });

  // outfits the user can drop into a day: fresh suggestions first, then saved
  const pool = [...suggestions, ...saved.filter((o) => !suggestions.some((x) => x.id === o.id))].slice(0, 8);

  const assign = (day: string, outfit: Outfit, label: string) => {
    plan(day, outfit);
    hapticSuccess();
    toast(`planned for ${label} 📅`, 'mint', 'calendar');
    setAssigning(undefined);
    setPickingDay(null);
  };

  const onEmptyDay = (d: (typeof days)[number]) => {
    if (d.i > limits.planAheadDays) {
      router.push('/paywall?reason=planner' as never);
      return;
    }
    if (assigning) assign(d.key, assigning, d.label);
    else setPickingDay(pickingDay === d.key ? null : d.key);
  };

  const openOnToday = (o: Outfit) => {
    setSuggestions([o], o.occasion);
    router.navigate('/' as never);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingTop: insets.top + 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, marginBottom: 6 }}>
        <SIconButton icon="arrowL" size={42} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} accessibilityLabel="back" />
        <Text style={[type.h1, { flex: 1 }]}>your week</Text>
        {isPlus ? <SPlusBadge size="sm" /> : null}
      </View>

      {assigning ? (
        <EnterIn style={{ marginHorizontal: 20, marginTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.grapeSoft, borderRadius: radii.tile, padding: 12 }}>
            <UIcon name="calendar" size={18} color={colors.grape} stroke={2.2} />
            <Text style={[type.bodyBold, { flex: 1, color: colors.grape, fontSize: 14 }]}>tap a day to plan this fit</Text>
            <Text onPress={() => setAssigning(undefined)} style={[type.small, { color: colors.grape }]}>cancel</Text>
          </View>
        </EnterIn>
      ) : null}

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40, gap: 12 }} showsVerticalScrollIndicator={false}>
        {days.map((d) => {
          const planned = plans[d.key];
          const locked = d.i > limits.planAheadDays;
          return (
            <View key={d.key}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                <Text style={{ fontFamily: fonts.display800, fontSize: 18, color: d.i === 0 ? colors.punch : colors.plum }}>{d.label}</Text>
                <Text style={type.small}>{d.date}</Text>
                {locked && !isPlus ? <View style={{ marginLeft: 'auto' }}><SPlusBadge size="sm" /></View> : null}
              </View>
              {planned ? (
                <Springy
                  onPress={() => openOnToday(planned)}
                  accessibilityRole="button"
                  style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.rule, borderRadius: radii.tile, padding: 12 }, shadow('sm')] as never}
                >
                  <Thumbs outfit={planned} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text numberOfLines={1} style={{ fontFamily: fonts.body700, fontSize: 14.5, color: colors.plum }}>{planned.occasion || 'a regular day'}</Text>
                    <Text numberOfLines={2} style={[type.small, { lineHeight: 16 }]}>“{planned.why}”</Text>
                  </View>
                  <SIconButton icon="x" size={32} accessibilityLabel={`remove plan for ${d.label}`} onPress={() => unplan(d.key)} />
                </Springy>
              ) : (
                <Springy
                  onPress={() => onEmptyDay(d)}
                  accessibilityRole="button"
                  accessibilityLabel={locked ? `plan ${d.label} with plus` : `plan a fit for ${d.label}`}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 18,
                    borderRadius: radii.tile, borderWidth: 1.5, borderStyle: 'dashed',
                    borderColor: assigning && !locked ? colors.grape : colors.rule,
                    backgroundColor: assigning && !locked ? colors.grapeSoft : colors.petalDeep,
                    opacity: locked && !isPlus ? 0.7 : 1,
                  }}
                >
                  <UIcon name={locked && !isPlus ? 'lock' : 'plus'} size={18} color={locked && !isPlus ? colors.muted : colors.punch} stroke={2.4} />
                  <Text style={{ fontFamily: fonts.body700, fontSize: 14, color: locked && !isPlus ? colors.muted : colors.plum }}>
                    {locked && !isPlus ? 'plan ahead with plus' : assigning ? 'drop it here' : 'plan a fit'}
                  </Text>
                </Springy>
              )}

              {pickingDay === d.key ? (
                <EnterIn style={{ marginTop: 8, gap: 8 }}>
                  {pool.length === 0 ? (
                    <View style={{ alignItems: 'center', gap: 10, padding: 14, backgroundColor: colors.white, borderRadius: radii.tile, borderWidth: 1.5, borderColor: colors.rule }}>
                      <Text style={[type.small, { textAlign: 'center' }]}>no fits to plan yet — spin some on today, or heart one you love.</Text>
                      <SButton size="sm" icon="shuffle" onPress={() => router.navigate('/' as never)}>spin on today</SButton>
                    </View>
                  ) : (
                    pool.map((o) => (
                      <Springy
                        key={o.id}
                        onPress={() => assign(d.key, o, d.label)}
                        accessibilityRole="button"
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderRadius: radii.tile, borderWidth: 1.5, borderColor: colors.rule, padding: 10 }}
                      >
                        <Thumbs outfit={o} />
                        <Text numberOfLines={1} style={[type.small, { flex: 1 }]}>{o.occasion || o.why}</Text>
                        <SBadge tone="mint">{o.matchScore}%</SBadge>
                      </Springy>
                    ))
                  )}
                </EnterIn>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
