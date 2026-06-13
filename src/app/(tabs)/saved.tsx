// Saved: favorited outfits + outfit-of-the-day history, with try-on images.
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnterIn, SBadge, SSegmented, Springy, UIcon } from '@/components/sorbet';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { Outfit } from '@/types';
import { colors, radii, shadow } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';

function OutfitRow({ outfit, onPress }: { outfit: Outfit; onPress: () => void }) {
  const garments = useWardrobeStore((s) => s.garments);
  const byId = new Map(garments.map((g) => [g.id, g]));
  const thumbs = [...new Set(outfit.slots.map((s) => s.itemId))]
    .map((id) => byId.get(id))
    .filter(Boolean)
    .slice(0, 4);
  return (
    <Springy
      onPress={onPress}
      style={[
        {
          flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.white,
          borderWidth: 1.5, borderColor: colors.rule, borderRadius: radii.card, padding: 14,
        },
        shadow('sm'),
      ] as never}
    >
      {outfit.tryOnUri ? (
        <Image source={{ uri: outfit.tryOnUri }} style={{ width: 64, height: 86, borderRadius: 12 }} contentFit="cover" />
      ) : (
        <View style={{ width: 64, height: 86, borderRadius: 12, backgroundColor: colors.petalDeep, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden', padding: 3, gap: 2, alignContent: 'center', justifyContent: 'center' }}>
          {thumbs.map((g) => (
            <Image key={g!.id} source={{ uri: g!.thumbUri }} style={{ width: 27, height: 27, borderRadius: 6, backgroundColor: '#fff' }} contentFit="contain" />
          ))}
        </View>
      )}
      <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
        <Text numberOfLines={1} style={{ fontFamily: fonts.display700, fontSize: 17, color: colors.plum }}>
          {outfit.occasion || 'a regular day'}
        </Text>
        <Text numberOfLines={2} style={[type.small, { lineHeight: 17 }]}>“{outfit.why}”</Text>
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          <SBadge tone="mint">{outfit.matchScore}%</SBadge>
          {outfit.wornOn ? <SBadge tone="grape">worn {outfit.wornOn}</SBadge> : null}
          {outfit.isFavorite ? <SBadge tone="punch" icon="heart">fave</SBadge> : null}
        </View>
      </View>
      <UIcon name="arrowR" size={20} color={colors.muted} />
    </Springy>
  );
}

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const saved = useOutfitStore((s) => s.saved);
  const [tab, setTab] = React.useState(0); // 0 = all, 1 = faves, 2 = worn

  const filtered = saved.filter((o) => (tab === 1 ? o.isFavorite : tab === 2 ? !!o.wornOn : true));

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingTop: insets.top + 8 }}>
      <View style={{ paddingHorizontal: 20, gap: 14, paddingBottom: 12 }}>
        <Text style={type.h1}>saved lewks</Text>
        <SSegmented options={['all', 'faves', 'worn']} index={tab} onChange={setTab} />
      </View>
      {filtered.length === 0 ? (
        <EnterIn style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingBottom: 120 }}>
          <Text style={{ fontSize: 44 }}>🤍</Text>
          <Text style={[type.h3, { textAlign: 'center', marginTop: 12 }]}>nothing saved yet</Text>
          <Text style={[type.bodyMuted, { textAlign: 'center', marginTop: 6 }]}>
            heart an outfit or tap “wear it” on today’s pick and it lands here.
          </Text>
        </EnterIn>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(o) => o.id}
          renderItem={({ item }) => <OutfitRow outfit={item} onPress={() => router.push(`/outfit/${item.id}` as never)} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130, gap: 12 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
