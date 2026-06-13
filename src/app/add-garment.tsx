// Modal: add a garment via camera or library → AI tagging → enhancement queue.
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIngestGarment } from '@/components/closet/useIngestGarment';
import { EnterIn, SBadge, SButton, SGarmentTile, SIconButton, Springy, UIcon, toast } from '@/components/sorbet';
import { isConfigured } from '@/services/gemini/client';
import { colors, radii, shadow } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';

const LOADING_LINES = ['checking the stitching…', 'reading the vibe…', 'tagging colors & style…', 'almost on the rack…'];

export default function AddGarmentModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phase, lastAdded, ingest, reset } = useIngestGarment();
  const [lineIdx, setLineIdx] = React.useState(0);

  React.useEffect(() => {
    if (phase !== 'analyzing') return;
    const t = setInterval(() => setLineIdx((i) => (i + 1) % LOADING_LINES.length), 1800);
    return () => clearInterval(t);
  }, [phase]);

  const pick = (source: 'camera' | 'library') => {
    setLineIdx(0);
    void ingest(source).then((g) => {
      if (g) toast(`${g.name} → added to the closet ✨`, 'mint');
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingTop: insets.top + 10, paddingHorizontal: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <Text style={type.h1}>new piece</Text>
        <SIconButton icon="x" onPress={() => router.back()} />
      </View>

      {!isConfigured() ? (
        <View style={{ marginBottom: 14 }}>
          <SBadge tone="lemon" icon="key">ai tagging off — add a gemini key in .env</SBadge>
        </View>
      ) : null}

      {phase === 'analyzing' ? (
        <EnterIn style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 }}>
          <ActivityIndicator size="large" color={colors.punch} />
          <Text style={[type.displaySub, { marginTop: 20 }]}>{LOADING_LINES[lineIdx]}</Text>
          <Text style={[type.bodyMuted, { marginTop: 6 }]}>the ai is meeting your garment</Text>
        </EnterIn>
      ) : phase === 'done' && lastAdded ? (
        <EnterIn style={{ flex: 1, paddingTop: 10 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 200 }}>
              <SGarmentTile imageUri={lastAdded.thumbUri} label={lastAdded.name} size={150} />
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16, justifyContent: 'center' }}>
              <SBadge tone="grape">{lastAdded.category}</SBadge>
              {lastAdded.colors.slice(0, 2).map((c) => (
                <SBadge key={c} tone="neutral">{c}</SBadge>
              ))}
              {lastAdded.styleTags.slice(0, 2).map((t) => (
                <SBadge key={t} tone="punch">{t}</SBadge>
              ))}
            </View>
            <Text style={[type.bodyMuted, { textAlign: 'center', marginTop: 12, maxWidth: 280 }]}>
              {lastAdded.description}
            </Text>
            <Text style={[type.small, { textAlign: 'center', marginTop: 8 }]}>
              studio glow-up is rendering in the background ✨
            </Text>
          </View>
          <View style={{ marginTop: 'auto', paddingBottom: Math.max(insets.bottom, 16), gap: 12 }}>
            <SButton variant="primary" size="lg" full icon="plus" onPress={reset}>
              add another
            </SButton>
            <SButton variant="ghost" size="md" full onPress={() => router.back()}>
              done
            </SButton>
          </View>
        </EnterIn>
      ) : (
        <EnterIn style={{ flex: 1 }}>
          <Text style={[type.bodyMuted, { fontSize: 16, lineHeight: 24, marginBottom: 24 }]}>
            snap it flat on the bed or hanging on a door — good light, whole piece in frame.
          </Text>
          <View style={{ gap: 14 }}>
            {(
              [
                { source: 'camera', icon: 'camera', title: 'take a photo', sub: 'point at the piece, we do the rest' },
                { source: 'library', icon: 'image', title: 'pick from library', sub: 'got fit pics already? perfect' },
              ] as const
            ).map((o) => (
              <Springy
                key={o.source}
                onPress={() => pick(o.source)}
                style={[
                  {
                    flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.white,
                    borderWidth: 1.5, borderColor: colors.rule, borderRadius: radii.card, padding: 20,
                  },
                  shadow('sm'),
                ] as never}
              >
                <View style={{ width: 54, height: 54, borderRadius: 16, backgroundColor: colors.punchSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <UIcon name={o.icon} size={26} color={colors.punch} stroke={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.display700, fontSize: 18, color: colors.plum }}>{o.title}</Text>
                  <Text style={[type.small, { marginTop: 2 }]}>{o.sub}</Text>
                </View>
                <UIcon name="arrowR" size={20} color={colors.muted} />
              </Springy>
            ))}
          </View>
        </EnterIn>
      )}
    </View>
  );
}
