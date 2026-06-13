// Today: greeting + weather + occasion chat input + slot toggles + swipeable
// outfit suggestions with per-slot swap arrows, wear-it and remix.
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator, Dimensions, FlatList, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OutfitCard } from '@/components/today/OutfitCard';
import { Confetti, EnterIn, SAvatar, SBadge, SButton, SChip, SWeatherPill, Springy, UIcon, toast } from '@/components/sorbet';
import { friendlyError, isConfigured } from '@/services/gemini/client';
import { generateOutfits } from '@/services/gemini/generateOutfits';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useWeather } from '@/store/useWeather';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Outfit, Slot } from '@/types';
import { colors, radii } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';
import { dateLine, formatTemp, greeting, todayKey, weatherSummary } from '@/utils';
import { hapticSuccess } from '@/utils/feedback';

const SLOT_OPTIONS: { key: Slot; label: string }[] = [
  { key: 'top', label: 'top' },
  { key: 'bottom', label: 'bottom' },
  { key: 'shoes', label: 'shoes' },
  { key: 'socks', label: 'socks' },
  { key: 'accessory', label: 'accessories' },
  { key: 'outerwear', label: 'outerwear' },
];

const GEN_LINES = ['reading the forecast…', 'raiding your closet…', 'matching colors & vibes…', 'final fit check…'];

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const profile = useProfileStore((s) => s.profile);
  const garments = useWardrobeStore((s) => s.garments);
  const { weather } = useWeather();
  const unit = useSettingsStore((s) => s.unit);
  const weatherPicks = useSettingsStore((s) => s.weatherPicks);
  const { suggestions, generating, setSuggestions, setGenerating, updateSuggestion, persistOutfit, suggestionIndex, setSuggestionIndex } = useOutfitStore();

  const [occasion, setOccasion] = React.useState('');
  const [enabledSlots, setEnabledSlots] = React.useState<Slot[]>(['top', 'bottom', 'shoes', 'outerwear']);
  const [genLine, setGenLine] = React.useState(0);
  const [confettiRun, setConfettiRun] = React.useState(0);
  const listRef = React.useRef<FlatList<Outfit>>(null);

  React.useEffect(() => {
    if (!generating) return;
    const t = setInterval(() => setGenLine((i) => (i + 1) % GEN_LINES.length), 1700);
    return () => clearInterval(t);
  }, [generating]);

  const toggleSlot = (key: Slot) =>
    setEnabledSlots((cur) => (cur.includes(key) ? cur.filter((s) => s !== key) : [...cur, key]));

  const generate = async (avoid: string[][] = []) => {
    if (!isConfigured()) {
      toast('ai is napping — add a gemini key in .env to wake it up', 'lemon', 'key');
      return;
    }
    if (garments.length < 2) {
      toast('closet’s too empty — add a few pieces first', 'punch', 'hanger');
      return;
    }
    if (enabledSlots.length === 0) {
      toast('pick at least one slot for the ai to fill', 'punch', 'x');
      return;
    }
    setGenLine(0);
    setGenerating(true);
    try {
      const outfits = await generateOutfits({
        occasion: occasion.trim(),
        weather: weatherPicks ? weather : undefined,
        profile,
        enabledSlots,
        garments,
        avoidSets: avoid,
      });
      setSuggestions(outfits, occasion.trim());
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      hapticSuccess();
    } catch (e) {
      toast(friendlyError(e), 'punch', 'x');
    } finally {
      setGenerating(false);
    }
  };

  const remix = () => {
    const avoid = suggestions.map((o) => o.slots.map((s) => s.itemId));
    void generate(avoid);
  };

  const rotateSlot = (outfit: Outfit, slotKey: string, dir: 1 | -1) => {
    const slots = outfit.slots.map((s) => {
      if (s.slot !== slotKey || s.alternatives.length === 0) return s;
      const pool = [s.itemId, ...s.alternatives];
      const idx = (0 + dir + pool.length) % pool.length;
      const next = pool[idx];
      const rest = pool.filter((id) => id !== next);
      return { ...s, itemId: next, alternatives: rest };
    });
    updateSuggestion({ ...outfit, slots });
  };

  const wearIt = async (outfit: Outfit) => {
    const worn = { ...outfit, wornOn: todayKey() };
    updateSuggestion(worn);
    await persistOutfit(worn);
    setConfettiRun((r) => r + 1);
    hapticSuccess();
    const canTryOn = !!profile.bodyPhotos.front || !!profile.facePhotoUri;
    if (canTryOn && isConfigured()) {
      setTimeout(() => router.push(`/try-on/${worn.id}` as never), 650);
    } else {
      toast('locked in — that’s today’s lewk 🔥', 'mint');
    }
  };

  const toggleFavorite = async (outfit: Outfit) => {
    const fav = { ...outfit, isFavorite: !outfit.isFavorite };
    updateSuggestion(fav);
    await persistOutfit(fav);
    toast(fav.isFavorite ? 'saved to faves ✨' : 'removed from faves', fav.isFavorite ? 'punch' : 'grape', 'heart');
  };

  const cardWidth = width - 40;
  const wIcon = weather ? weatherSummary(weather.weatherCode).icon : 'sun';

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.petal }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Confetti run={confettiRun} />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 140 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20 }}>
          <View>
            <Text style={{ fontFamily: fonts.body700, fontSize: 12, color: colors.muted, letterSpacing: 0.3 }}>{dateLine()}</Text>
            <Text style={[type.h1, { marginTop: 2 }]}>{greeting()}</Text>
          </View>
          <Springy onPress={() => router.push('/you' as never)} haptic={false}>
            <SAvatar letter={(profile.name || 'f')[0].toLowerCase()} uri={profile.facePhotoUri} />
          </Springy>
        </View>

        {/* weather */}
        <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
          {weather ? (
            <SWeatherPill icon={wIcon} tone={weather.tempC <= 8 ? 'grape' : 'mint'}>
              {formatTemp(weather.tempC, unit)} · {weather.summary} · {weather.city.toLowerCase()}
            </SWeatherPill>
          ) : (
            <SWeatherPill tone="lemon" icon="pin">no weather — set your city in settings</SWeatherPill>
          )}
        </View>

        {/* occasion input */}
        <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
          <View
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white,
              borderWidth: 1.5, borderColor: colors.rule, borderRadius: radii.pill, paddingLeft: 18, paddingRight: 6, paddingVertical: 5,
            }}
          >
            <TextInput
              style={{ flex: 1, fontFamily: fonts.body600, fontSize: 15, color: colors.plum, paddingVertical: 9 }}
              placeholder="what's the day like? “business meeting, then dinner…”"
              placeholderTextColor={colors.muted}
              value={occasion}
              onChangeText={setOccasion}
              onSubmitEditing={() => void generate()}
              returnKeyType="send"
              editable={!generating}
            />
            <Springy
              onPress={() => void generate()}
              disabled={generating}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.punch, alignItems: 'center', justifyContent: 'center' }}
            >
              <UIcon name="send" size={18} color="#fff" stroke={2.2} />
            </Springy>
          </View>
        </View>

        {/* slot toggles */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, marginTop: 14 }}>
          {SLOT_OPTIONS.map((s) => (
            <SChip key={s.key} active={enabledSlots.includes(s.key)} onPress={() => toggleSlot(s.key)}>
              {s.label}
            </SChip>
          ))}
        </ScrollView>

        {/* suggestions */}
        <View style={{ marginTop: 20 }}>
          {generating ? (
            <EnterIn style={{ alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 }}>
              <ActivityIndicator size="large" color={colors.punch} />
              <Text style={[type.displaySub, { marginTop: 18 }]}>{GEN_LINES[genLine]}</Text>
            </EnterIn>
          ) : suggestions.length > 0 ? (
            <>
              <FlatList
                ref={listRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={suggestions}
                keyExtractor={(o) => o.id}
                snapToInterval={cardWidth + 12}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                onMomentumScrollEnd={(e) => {
                  const i = Math.round(e.nativeEvent.contentOffset.x / (cardWidth + 12));
                  setSuggestionIndex(Math.max(0, Math.min(suggestions.length - 1, i)));
                }}
                renderItem={({ item }) => (
                  <View style={{ width: cardWidth }}>
                    <OutfitCard
                      outfit={item}
                      onRotateSlot={(slotKey, dir) => rotateSlot(item, slotKey, dir)}
                      onWear={() => void wearIt(item)}
                      onFavorite={() => void toggleFavorite(item)}
                    />
                  </View>
                )}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14 }}>
                {suggestions.map((o, i) => (
                  <View
                    key={o.id}
                    style={{
                      width: i === suggestionIndex ? 18 : 7, height: 7, borderRadius: 4,
                      backgroundColor: i === suggestionIndex ? colors.punch : colors.rule,
                    }}
                  />
                ))}
              </View>
              <View style={{ paddingHorizontal: 20, marginTop: 14, alignItems: 'center' }}>
                <SButton variant="secondary" icon="shuffle" onPress={remix}>
                  remix — new ideas
                </SButton>
              </View>
            </>
          ) : (
            <EnterIn style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 36 }}>
              {garments.length === 0 ? (
                <>
                  <Text style={{ fontSize: 44 }}>🫧</Text>
                  <Text style={[type.h3, { textAlign: 'center', marginTop: 12 }]}>closet’s empty??</Text>
                  <Text style={[type.bodyMuted, { textAlign: 'center', marginTop: 6 }]}>
                    drop a few pieces with the big pink + and the ai gets to styling.
                  </Text>
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 44 }}>💭</Text>
                  <Text style={[type.h3, { textAlign: 'center', marginTop: 12 }]}>tuesday’s lewk is loading</Text>
                  <Text style={[type.bodyMuted, { textAlign: 'center', marginTop: 6 }]}>
                    tell me about your day above — or just hit send and i’ll style the weather.
                  </Text>
                  {!isConfigured() ? (
                    <View style={{ marginTop: 14 }}>
                      <SBadge tone="lemon" icon="key">ai is napping — add a gemini key in .env</SBadge>
                    </View>
                  ) : null}
                </>
              )}
            </EnterIn>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
