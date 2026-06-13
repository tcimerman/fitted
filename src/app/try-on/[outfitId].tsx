// Try-on modal: long-running Gemini image composition of the user wearing the
// chosen outfit. Soft-fails — the outfit-of-the-day is already recorded.
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Confetti, EnterIn, SBadge, SButton, SIconButton, toast } from '@/components/sorbet';
import { friendlyError, SafetyBlockedError } from '@/services/gemini/client';
import { generateTryOn } from '@/services/gemini/tryOn';
import { storeTryOnImage } from '@/services/images';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { colors, radii, shadow } from '@/theme/tokens';
import { type } from '@/theme/typography';

const LINES = ['stitching your lewk…', 'tailoring the pixels…', 'adjusting the lighting…', 'final mirror check…', 'serving in 3, 2…'];

export default function TryOnModal() {
  const { outfitId } = useLocalSearchParams<{ outfitId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useProfileStore((s) => s.profile);
  const garments = useWardrobeStore((s) => s.garments);
  const outfit = useOutfitStore((s) => s.saved.find((o) => o.id === outfitId) ?? s.suggestions.find((o) => o.id === outfitId));
  const persistOutfit = useOutfitStore((s) => s.persistOutfit);
  const updateSuggestion = useOutfitStore((s) => s.updateSuggestion);

  // starts as 'done' when a try-on render already exists for this outfit
  const [status, setStatus] = React.useState<'working' | 'done' | 'failed'>(outfit?.tryOnUri ? 'done' : 'working');
  const [lineIdx, setLineIdx] = React.useState(0);
  const [run, setRun] = React.useState(0);
  const cancelled = React.useRef(false);
  const attemptRef = React.useRef(0);

  React.useEffect(() => {
    if (status !== 'working') return;
    const t = setInterval(() => setLineIdx((i) => (i + 1) % LINES.length), 2200);
    return () => clearInterval(t);
  }, [status]);

  const start = React.useCallback(async () => {
    if (!outfit || outfit.tryOnUri) return;
    const myAttempt = ++attemptRef.current;
    try {
      const ids = new Set(outfit.slots.map((s) => s.itemId));
      const outfitGarments = garments.filter((g) => ids.has(g.id));
      const base64 = await generateTryOn(profile, outfitGarments);
      if (cancelled.current || myAttempt !== attemptRef.current) return;
      const tryOnUri = await storeTryOnImage(base64, outfit.id);
      const updated = { ...outfit, tryOnUri };
      updateSuggestion(updated);
      await persistOutfit(updated);
      setStatus('done');
      setRun((r) => r + 1);
    } catch (e) {
      if (cancelled.current || myAttempt !== attemptRef.current) return;
      setStatus('failed');
      toast(e instanceof SafetyBlockedError ? "couldn't render the try-on this time — outfit's still locked in" : friendlyError(e), 'punch', 'x');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outfit?.id]);

  React.useEffect(() => {
    cancelled.current = false;
    const t = setTimeout(() => void start(), 0);
    return () => {
      clearTimeout(t);
      cancelled.current = true;
    };
  }, [start]);

  if (!outfit) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.petal, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={type.bodyMuted}>outfit not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingTop: insets.top + 10, paddingHorizontal: 24 }}>
      <Confetti run={run} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <Text style={type.h1}>the fit, on you</Text>
        <SIconButton icon="x" onPress={() => router.back()} />
      </View>

      {status === 'working' ? (
        <EnterIn style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
          <ActivityIndicator size="large" color={colors.grape} />
          <Text style={[type.displaySub, { marginTop: 22 }]}>{LINES[lineIdx]}</Text>
          <Text style={[type.bodyMuted, { marginTop: 8, textAlign: 'center' }]}>
            this takes ~20 seconds — your outfit of the day is already locked in
          </Text>
          <View style={{ marginTop: 30 }}>
            <SButton variant="ghost" onPress={() => router.back()}>
              keep it a surprise — close
            </SButton>
          </View>
        </EnterIn>
      ) : status === 'done' && outfit.tryOnUri ? (
        <EnterIn style={{ flex: 1 }}>
          <View style={[{ borderRadius: radii.card, overflow: 'hidden', backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.rule }, shadow('md')]}>
            <Image source={{ uri: outfit.tryOnUri }} style={{ width: '100%', aspectRatio: 0.72 }} contentFit="cover" transition={300} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 14 }}>
            <SBadge tone="mint" icon="star">{outfit.matchScore}% match · saved to your day</SBadge>
          </View>
          <View style={{ marginTop: 'auto', paddingBottom: Math.max(insets.bottom, 16), gap: 12 }}>
            <SButton variant="primary" size="lg" full icon="check" onPress={() => router.back()}>
              love it — i’m out the door
            </SButton>
          </View>
        </EnterIn>
      ) : (
        <EnterIn style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
          <Text style={{ fontSize: 44 }}>🪞</Text>
          <Text style={[type.h3, { marginTop: 14, textAlign: 'center' }]}>the mirror fogged up</Text>
          <Text style={[type.bodyMuted, { marginTop: 6, textAlign: 'center' }]}>
            couldn’t render the try-on — but the outfit is still saved as today’s pick.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <SButton
              variant="secondary"
              icon="shuffle"
              onPress={() => {
                setStatus('working');
                void start();
              }}
            >
              try again
            </SButton>
            <SButton variant="outline" onPress={() => router.back()}>
              close
            </SButton>
          </View>
        </EnterIn>
      )}
    </View>
  );
}
