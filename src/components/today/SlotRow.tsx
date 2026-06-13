// One outfit slot: ◀ thumb + name ▶ — arrows rotate through the AI's ranked
// alternatives locally (zero API calls).
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { UIcon } from '@/components/sorbet';
import { Garment, OutfitSlot } from '@/types';
import { colors, radii } from '@/theme/tokens';
import { fonts } from '@/theme/typography';
import { hapticSelect } from '@/utils/feedback';

interface SlotRowProps {
  slot: OutfitSlot;
  garment: Garment | undefined;
  onRotate: (direction: 1 | -1) => void;
}

const SLOT_EMOJI: Record<string, string> = {
  top: '👕', bottom: '👖', shoes: '👟', socks: '🧦', accessory: '👜', outerwear: '🧥',
};

export function SlotRow({ slot, garment, onRotate }: SlotRowProps) {
  if (!garment) return null;
  const hasAlts = slot.alternatives.length > 0;
  const arrow = (dir: 1 | -1) => (
    <Pressable
      disabled={!hasAlts}
      onPress={() => {
        hapticSelect();
        onRotate(dir);
      }}
      hitSlop={8}
      style={{
        width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center',
        backgroundColor: hasAlts ? colors.punchSoft : colors.petalDeep, opacity: hasAlts ? 1 : 0.45,
      }}
    >
      <UIcon name={dir === 1 ? 'chevronR' : 'chevronL'} size={17} color={hasAlts ? colors.punch : colors.muted} stroke={2.4} />
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      {arrow(-1)}
      <View
        style={{
          flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12,
          backgroundColor: colors.petal, borderRadius: radii.field, paddingVertical: 8, paddingHorizontal: 12,
        }}
      >
        <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.rule, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={{ uri: garment.thumbUri }} style={{ width: 46, height: 46 }} contentFit="contain" />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontFamily: fonts.body500, fontSize: 11, color: colors.muted }}>
            {SLOT_EMOJI[slot.slot] ?? ''} {slot.slot}
          </Text>
          <Text numberOfLines={1} style={{ fontFamily: fonts.body700, fontSize: 14.5, color: colors.plum }}>
            {garment.name}
          </Text>
        </View>
        {hasAlts ? (
          <Text style={{ fontFamily: fonts.body600, fontSize: 11, color: colors.muted }}>+{slot.alternatives.length}</Text>
        ) : null}
      </View>
      {arrow(1)}
    </View>
  );
}
