// The outfit suggestion card: match badge, "why" line, slot rows with arrows,
// heart / wear-it / remix actions. Built from the brand book's SOutfitCard.
import React from 'react';
import { Text, View } from 'react-native';
import { SBadge, SButton, SIconButton } from '@/components/sorbet';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { Outfit } from '@/types';
import { colors, radii, shadow } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';
import { SlotRow } from './SlotRow';

interface OutfitCardProps {
  outfit: Outfit;
  onRotateSlot: (slotKey: string, direction: 1 | -1) => void;
  onWear: () => void;
  onFavorite: () => void;
  onPlan?: () => void;
  wearing?: boolean;
}

export function OutfitCard({ outfit, onRotateSlot, onWear, onFavorite, onPlan, wearing }: OutfitCardProps) {
  const garments = useWardrobeStore((s) => s.garments);
  const byId = React.useMemo(() => new Map(garments.map((g) => [g.id, g])), [garments]);

  // a dress filling top+bottom renders once
  const seen = new Set<string>();
  const rows = outfit.slots.filter((s) => {
    if (seen.has(s.itemId)) return false;
    seen.add(s.itemId);
    return true;
  });

  return (
    <View
      style={[
        { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.rule, borderRadius: radii.card, padding: 18 },
        shadow('md'),
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontFamily: fonts.display800, fontSize: 23, letterSpacing: -0.5, color: colors.plum }}>today’s spin</Text>
        <SBadge tone="mint" icon="star">{outfit.matchScore}% match</SBadge>
      </View>
      <Text style={[type.bodyMuted, { fontSize: 14, marginBottom: 14 }]}>“{outfit.why}”</Text>
      <View style={{ gap: 10 }}>
        {rows.map((s) => (
          <SlotRow key={s.slot} slot={s} garment={byId.get(s.itemId)} onRotate={(dir) => onRotateSlot(s.slot, dir)} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, alignItems: 'center' }}>
        <SIconButton icon="heart" tone="punch" filled={outfit.isFavorite} onPress={onFavorite} accessibilityLabel="favourite" />
        {onPlan ? <SIconButton icon="calendar" tone="grape" onPress={onPlan} accessibilityLabel="plan for another day" /> : null}
        <View style={{ flex: 1 }}>
          <SButton variant="primary" full icon="sparkle" loading={wearing} onPress={onWear}>
            wear it ✨
          </SButton>
        </View>
      </View>
    </View>
  );
}
