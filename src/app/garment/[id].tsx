// Garment detail: enhanced/original views, retag category, delete.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SBadge, SButton, SChip, SIconButton, SSegmented, toast } from '@/components/sorbet';
import { isConfigured } from '@/services/gemini/client';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { ALL_CATEGORIES, GarmentCategory } from '@/types';
import { confirmAction } from '@/utils/feedback';
import { colors, radii } from '@/theme/tokens';
import { type } from '@/theme/typography';

export default function GarmentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const garment = useWardrobeStore((s) => s.garments.find((g) => g.id === id));
  const patch = useWardrobeStore((s) => s.patch);
  const remove = useWardrobeStore((s) => s.remove);
  const [view, setView] = React.useState(0); // 0 = studio, 1 = original

  if (!garment) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.petal, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={type.bodyMuted}>this piece left the closet</Text>
      </View>
    );
  }

  const shownUri = view === 0 ? garment.enhancedUri ?? garment.originalUri : garment.originalUri;

  const confirmDelete = () =>
    confirmAction('remove this piece?', `"${garment.name}" will leave your closet. saved outfits keep their history.`, 'remove', () => {
      void remove(garment.id).then(() => {
        toast('gone — closet updated', 'grape', 'trash');
        router.back();
      });
    });

  const retag = (category: GarmentCategory) => {
    void patch(garment.id, { category });
    toast(`retagged as ${category}`, 'mint');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingTop: insets.top + 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 }}>
        <SIconButton icon="arrowL" onPress={() => router.back()} />
        <SIconButton icon="trash" tone="punch" onPress={confirmDelete} />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 30 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: colors.white, borderRadius: radii.card, borderWidth: 1.5, borderColor: colors.rule, overflow: 'hidden' }}>
          <Image source={{ uri: shownUri }} style={{ width: '100%', aspectRatio: 0.9 }} contentFit="contain" transition={200} />
        </View>
        <View style={{ alignItems: 'center', marginTop: 14 }}>
          <SSegmented options={['studio', 'original']} index={view} onChange={setView} />
          {!garment.enhancedUri && view === 0 ? (
            <Text style={[type.small, { marginTop: 8 }]}>
              {isConfigured()
                ? 'studio glow-up still rendering — showing the original for now'
                : 'no studio glow-up without a gemini key — showing the original'}
            </Text>
          ) : null}
        </View>

        <Text style={[type.h2, { marginTop: 22 }]}>{garment.name}</Text>
        <Text style={[type.bodyMuted, { marginTop: 6 }]}>{garment.description}</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {garment.colors.map((c) => (
            <SBadge key={c} tone="neutral">{c}</SBadge>
          ))}
          {garment.styleTags.map((t) => (
            <SBadge key={t} tone="punch">{t}</SBadge>
          ))}
          <SBadge tone="grape">warmth {garment.warmth}/5</SBadge>
          <SBadge tone="lemon">dressy {garment.formality}/5</SBadge>
        </View>

        <Text style={[type.label, { marginTop: 26, marginBottom: 10 }]}>category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {ALL_CATEGORIES.map((c) => (
            <SChip key={c} active={garment.category === c} tone="grape" onPress={() => retag(c)}>
              {c}
            </SChip>
          ))}
        </View>

        <View style={{ marginTop: 30 }}>
          <SButton variant="outline" full onPress={() => router.back()}>
            back to the closet
          </SButton>
        </View>
      </ScrollView>
    </View>
  );
}
