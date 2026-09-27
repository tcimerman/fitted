// Saved-outfit detail: try-on image, pieces, favorite toggle, delete.
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SBadge, SButton, SIconButton, SItemRow, toast } from '@/components/sorbet';
import { isConfigured } from '@/services/gemini/client';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useProfileStore } from '@/store/useProfileStore';
import { entitlementSnapshot } from '@/store/useSubscriptionStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { colors, radii, shadow } from '@/theme/tokens';
import { type } from '@/theme/typography';
import { confirmAction } from '@/utils/feedback';

export default function OutfitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const outfit = useOutfitStore((s) => s.saved.find((o) => o.id === id));
  const persistOutfit = useOutfitStore((s) => s.persistOutfit);
  const removeSaved = useOutfitStore((s) => s.removeSaved);
  const garments = useWardrobeStore((s) => s.garments);
  const profile = useProfileStore((s) => s.profile);

  if (!outfit) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.petal, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Text style={type.bodyMuted}>this lewk is gone</Text>
        <SButton variant="ghost" icon="arrowL" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>back</SButton>
      </View>
    );
  }

  const byId = new Map(garments.map((g) => [g.id, g]));
  const pieces = [...new Set(outfit.slots.map((s) => s.itemId))].map((gid) => byId.get(gid));
  const canTryOn = isConfigured() && (!!profile.bodyPhotos.front || !!profile.facePhotoUri);

  const confirmDelete = () =>
    confirmAction('remove this lewk?', 'it disappears from saved — your closet pieces stay.', 'remove', () => {
      void removeSaved(outfit.id).then(() => router.back());
    });

  const toggleFav = () => {
    const fav = { ...outfit, isFavorite: !outfit.isFavorite };
    void persistOutfit(fav);
    toast(fav.isFavorite ? 'saved to faves ✨' : 'removed from faves', fav.isFavorite ? 'punch' : 'grape', 'heart');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingTop: insets.top + 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 }}>
        <SIconButton icon="arrowL" onPress={() => router.back()} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <SIconButton icon="heart" tone="punch" filled={outfit.isFavorite} onPress={toggleFav} />
          <SIconButton icon="trash" tone="punch" onPress={confirmDelete} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 30 }} showsVerticalScrollIndicator={false}>
        {outfit.tryOnUri ? (
          <View style={[{ borderRadius: radii.card, overflow: 'hidden', backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.rule }, shadow('md')]}>
            <Image source={{ uri: outfit.tryOnUri }} style={{ width: '100%', aspectRatio: 0.72 }} contentFit="cover" transition={200} />
          </View>
        ) : null}

        <Text style={[type.h2, { marginTop: 18 }]}>{outfit.occasion || 'a regular day'}</Text>
        <Text style={[type.bodyMuted, { marginTop: 6 }]}>“{outfit.why}”</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          <SBadge tone="mint" icon="star">{outfit.matchScore}% match</SBadge>
          {outfit.wornOn ? <SBadge tone="grape">worn {outfit.wornOn}</SBadge> : null}
          {outfit.weather ? (
            <SBadge tone="neutral">{Math.round(outfit.weather.tempC)}° · {outfit.weather.summary}</SBadge>
          ) : null}
        </View>

        <Text style={[type.label, { marginTop: 24, marginBottom: 10 }]}>the pieces</Text>
        <View style={{ gap: 10 }}>
          {pieces.map((g, i) =>
            g ? (
              <SItemRow key={g.id} title={g.name} sub={g.category} imageUri={g.thumbUri} onPress={() => router.push(`/garment/${g.id}` as never)} />
            ) : (
              <SItemRow key={`gone-${i}`} title="(piece left the closet)" sub="removed from wardrobe" icon="hanger" trailing={null} />
            ),
          )}
        </View>

        {!outfit.tryOnUri && canTryOn ? (
          <View style={{ marginTop: 24 }}>
            <SButton
              variant="secondary"
              full
              icon="sparkle"
              onPress={() => router.push((entitlementSnapshot().tryOnsLeft > 0 ? `/try-on/${outfit.id}` : '/paywall?reason=tryon') as never)}
            >
              see it on you
            </SButton>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
