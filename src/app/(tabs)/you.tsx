// You: profile, photos, style prefs, weather/city, units, toggles, ai status,
// clear-all-data, about.
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { choosePhotoSource, PhotoSlot } from '@/components/onboarding/PhotoSlot';
import { LinearGradient } from 'expo-linear-gradient';
import {
  SAvatar, SBadge, SChip, SInput, SItemRow, SPlusBadge, SSegmented, SToggle, SButton, SWordmark, Springy, toast,
} from '@/components/sorbet';
import { PLANS, formatPrice } from '@/services/purchases';
import { usePlannerStore } from '@/store/usePlannerStore';
import { useStreak } from '@/store/useStreak';
import { FREE_LIMITS, PLUS_LIMITS, useEntitlements, useSubscriptionStore } from '@/store/useSubscriptionStore';
import { isConfigured } from '@/services/gemini/client';
import { pickImage, storeProfilePhoto, wipeAllPhotos } from '@/services/images';
import { wipeDatabase } from '@/services/db';
import { CityResult, searchCity } from '@/services/weather';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { GenderPresentation } from '@/types';
import { colors, radii } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';
import { confirmAction } from '@/utils/feedback';

const STYLES = ['casual', 'business', 'streetwear', 'elegant', 'sporty', 'boho', 'edgy', 'classic', 'romantic'];
const PRESENTATIONS: { key: GenderPresentation; label: string }[] = [
  { key: 'feminine', label: 'feminine' },
  { key: 'masculine', label: 'masculine' },
  { key: 'androgynous', label: 'androgynous' },
  { key: 'unspecified', label: 'surprise me' },
];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.rule, borderRadius: radii.card, padding: 18, gap: 14 }}>
      <Text style={{ fontFamily: fonts.body800, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: colors.muted }}>{title}</Text>
      {children}
    </View>
  );
}

function ToggleRow({ label, sub, value, onChange }: { label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Text style={[type.bodyBold, { fontSize: 14.5 }]}>{label}</Text>
        {sub ? <Text style={[type.small, { marginTop: 1 }]}>{sub}</Text> : null}
      </View>
      <SToggle value={value} onChange={onChange} />
    </View>
  );
}

export default function YouScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);
  const setBodyPhoto = useProfileStore((s) => s.setBodyPhoto);
  const resetProfile = useProfileStore((s) => s.resetAll);
  const settings = useSettingsStore();
  const garmentCount = useWardrobeStore((s) => s.garments.length);
  const { isPlus, entitlement, usage, tryOnsLeft } = useEntitlements();
  const restore = useSubscriptionStore((s) => s.restore);
  const cancelSub = useSubscriptionStore((s) => s.cancel);
  const busy = useSubscriptionStore((s) => s.busy);
  const streak = useStreak();

  const [cityQuery, setCityQuery] = React.useState('');
  const [cityResults, setCityResults] = React.useState<CityResult[]>([]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      const q = cityQuery.trim();
      if (q.length < 2) setCityResults([]);
      else searchCity(q).then(setCityResults).catch(() => setCityResults([]));
    }, 350);
    return () => clearTimeout(t);
  }, [cityQuery]);

  const rePickFace = () =>
    choosePhotoSource(async (source) => {
      const picked = await pickImage(source);
      if (!picked) return;
      const stored = await storeProfilePhoto(picked, 'face');
      setProfile({ facePhotoUri: stored });
      toast('new face, who dis ✨', 'mint');
    });

  const clearAll = () =>
    confirmAction('clear everything?', 'closet, outfits, photos, profile — all gone for good. this restarts onboarding.', 'clear it all', () => {
      void (async () => {
        await wipeDatabase().catch(() => {});
        await wipeAllPhotos().catch(() => {});
        useWardrobeStore.getState().clear();
        useOutfitStore.getState().clear();
        usePlannerStore.getState().resetAll();
        useSubscriptionStore.getState().resetAll();
        settings.resetAll();
        resetProfile(); // flips onboardingCompleted → router remounts into onboarding
      })();
    });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.petal }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 140, gap: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <SAvatar letter={(profile.name || 'o')[0].toLowerCase()} uri={profile.facePhotoUri} size={54} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={type.h1}>{profile.name || 'you'}</Text>
            {isPlus ? <SPlusBadge size="sm" /> : null}
          </View>
          <Text style={type.small}>
            {garmentCount} {garmentCount === 1 ? 'piece' : 'pieces'} in the closet · 🔥 {streak.current}-day streak
          </Text>
        </View>
      </View>

      {isPlus && entitlement ? (
        <Card title="outfitspin plus">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <SPlusBadge label={entitlement.status === 'trial' ? 'free trial' : 'active'} />
            <Text style={type.small}>{PLANS[entitlement.planId].period === 'year' ? 'yearly' : 'monthly'} · {formatPrice(PLANS[entitlement.planId].price)}</Text>
          </View>
          <Text style={type.body}>
            {entitlement.status === 'trial' && entitlement.trialEndsAt
              ? `trial ends ${new Date(entitlement.trialEndsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toLowerCase()} — cancel before and you pay nothing.`
              : `renews ${new Date(entitlement.renewsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toLowerCase()}.`}
          </Text>
          <Text style={type.small}>{tryOnsLeft} of {PLUS_LIMITS.tryOnsPerMonth} try-ons left this month · unlimited spins</Text>
          <SButton
            variant="outline"
            full
            onPress={() =>
              confirmAction('cancel plus? (demo)', 'in the real app this opens your app store subscription settings. here it just switches you back to free.', 'cancel plus', () => void cancelSub())
            }
          >
            manage subscription
          </SButton>
        </Card>
      ) : (
        <Springy onPress={() => router.push('/paywall?reason=profile' as never)} accessibilityRole="button" style={{ borderRadius: radii.card, overflow: 'hidden' }}>
          <LinearGradient colors={[colors.grape, colors.punch]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 18, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: fonts.display800, fontSize: 21, color: '#fff' }}>try plus free for 7 days</Text>
              <Text style={{ fontSize: 24 }}>👑</Text>
            </View>
            <Text style={{ fontFamily: fonts.body500, fontSize: 14, color: '#fff', opacity: 0.92 }}>
              unlimited spins, {PLUS_LIMITS.tryOnsPerMonth} try-ons a month, the whole week planned. {formatPrice(PLANS.plus_yearly.price)}/year after.
            </Text>
            <View style={{ gap: 10, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 16, padding: 12 }}>
              {[
                { label: 'spins today', used: usage.spins, max: FREE_LIMITS.spinsPerDay },
                { label: 'try-ons this month', used: usage.tryOns, max: FREE_LIMITS.tryOnsPerMonth },
                { label: 'closet pieces', used: garmentCount, max: FREE_LIMITS.closetPieces },
              ].map((m) => (
                <View key={m.label} style={{ gap: 5 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: fonts.body700, fontSize: 12.5, color: '#fff' }}>{m.label}</Text>
                    <Text style={{ fontFamily: fonts.body700, fontSize: 12.5, color: '#fff' }}>{Math.min(m.used, m.max)} / {m.max}</Text>
                  </View>
                  <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}>
                    <View style={{ height: 6, width: `${Math.min(100, (m.used / m.max) * 100)}%`, backgroundColor: '#fff', borderRadius: 3 }} />
                  </View>
                </View>
              ))}
            </View>
            <Text style={{ fontFamily: fonts.body800, fontSize: 14, color: '#fff' }}>see plans →</Text>
          </LinearGradient>
        </Springy>
      )}

      <View style={{ gap: 10 }}>
        <SItemRow title="plan your week" sub="a fit for every day, ready when you wake up" icon="calendar" iconTone={colors.grape} onPress={() => router.push('/planner' as never)} />
        <SItemRow title="invite friends, get plus free" sub="give a month, get a month" icon="gift" iconTone={colors.punch} onPress={() => router.push('/invite' as never)} />
      </View>

      <Card title="profile">
        <SInput label="name" icon="user" value={profile.name} onChangeText={(name) => setProfile({ name })} />
        <SInput label="email" icon="mail" value={profile.email} onChangeText={(email) => setProfile({ email })} autoCapitalize="none" keyboardType="email-address" />
      </Card>

      <Card title="your photos (for the try-on)">
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {(['front', 'side', 'back'] as const).map((key) => (
            <PhotoSlot
              key={key}
              label={key}
              uri={profile.bodyPhotos[key]}
              onPicked={(uri) => {
                void storeProfilePhoto(uri, key).then((stored) => {
                  setBodyPhoto(key, stored);
                  toast(`${key} photo updated`, 'mint');
                });
              }}
            />
          ))}
        </View>
        <SButton variant="ghost" full icon="camera" onPress={rePickFace}>
          {profile.facePhotoUri ? 'update face photo' : 'add face photo'}
        </SButton>
      </Card>

      <Card title="style">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {PRESENTATIONS.map((p) => (
            <SChip key={p.key} active={profile.genderPresentation === p.key} tone="grape" onPress={() => setProfile({ genderPresentation: p.key })}>
              {p.label}
            </SChip>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {STYLES.map((s) => (
            <SChip
              key={s}
              active={profile.preferredStyles.includes(s)}
              onPress={() =>
                setProfile({
                  preferredStyles: profile.preferredStyles.includes(s)
                    ? profile.preferredStyles.filter((x) => x !== s)
                    : [...profile.preferredStyles, s],
                })
              }
            >
              {s}
            </SChip>
          ))}
        </View>
      </Card>

      <Card title="weather">
        <ToggleRow label="weather-based picks" sub="let the forecast steer the fit" value={settings.weatherPicks} onChange={settings.setWeatherPicks} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[type.bodyBold, { fontSize: 14.5 }]}>units</Text>
          <SSegmented options={['°C', '°F']} index={settings.unit === 'C' ? 0 : 1} onChange={(i) => settings.setUnit(i === 0 ? 'C' : 'F')} />
        </View>
        <View>
          <Text style={[type.bodyBold, { fontSize: 14.5, marginBottom: 8 }]}>
            city {settings.manualCity ? `· ${settings.manualCity.name}` : '· using gps'}
          </Text>
          <SInput icon="search" placeholder="search a city (or leave empty for gps)…" value={cityQuery} onChangeText={setCityQuery} pill />
          <View style={{ gap: 8, marginTop: 8 }}>
            {cityResults.map((r) => (
              <SChip
                key={`${r.name}-${r.lat}`}
                tone="grape"
                onPress={() => {
                  settings.setManualCity({ name: r.name, lat: r.lat, lon: r.lon });
                  setCityQuery('');
                  setCityResults([]);
                  toast(`weather set to ${r.name}`, 'mint', 'pin');
                }}
              >
                {r.name}{r.country ? `, ${r.country}` : ''}
              </SChip>
            ))}
            {settings.manualCity ? (
              <SChip tone="punch" onPress={() => settings.setManualCity(undefined)}>
                ✕ back to gps
              </SChip>
            ) : null}
          </View>
        </View>
      </Card>

      <Card title="nudges">
        <ToggleRow
          label="daily reminder"
          sub={`your daily spin at ${settings.reminderTime} (needs the app build, not expo go)`}
          value={settings.dailyReminder}
          onChange={settings.setDailyReminder}
        />
      </Card>

      <Card title="ai">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[type.bodyBold, { fontSize: 14.5 }]}>gemini key</Text>
          <SBadge tone={isConfigured() ? 'mint' : 'lemon'} icon="key">
            {isConfigured() ? 'connected' : 'missing — add to .env'}
          </SBadge>
        </View>
        <Text style={type.small}>
          the key lives in your local .env and powers tagging, outfit picks, studio shots, and the try-on.
        </Text>
      </Card>

      <Card title="purchases">
        <SButton
          variant="ghost"
          full
          icon="refresh"
          loading={busy}
          onPress={() => void restore().then((ok) => toast(ok ? 'plus restored ✨' : 'no purchase found on this account', ok ? 'mint' : 'lemon', ok ? 'crown' : 'x'))}
        >
          restore purchases
        </SButton>
      </Card>

      <Card title="danger zone">
        <SButton variant="outline" full icon="trash" onPress={clearAll}>
          clear all data
        </SButton>
      </Card>

      <View style={{ alignItems: 'center', gap: 4, marginTop: 8 }}>
        <SWordmark size={18} />
        <Text style={type.small}>v1.0 · spin your closet into a fit · outfitspin.com</Text>
        <Text onPress={() => router.push('/dev/gallery' as never)} style={[type.small, { opacity: 0.45, padding: 6 }]}>
          component gallery
        </Text>
      </View>
    </ScrollView>
  );
}
