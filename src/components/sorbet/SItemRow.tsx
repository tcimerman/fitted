import React from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Garment, GarmentType, UIcon, IconName } from './icons';
import { Springy } from './Springy';
import { colors, radii } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

interface SItemRowProps {
  title: string;
  sub?: string;
  imageUri?: string;
  silhouette?: GarmentType;
  silhouetteColor?: string;
  icon?: IconName;
  iconTone?: string;
  trailing?: IconName | null;
  onPress?: () => void;
}

export function SItemRow({ title, sub, imageUri, silhouette, silhouetteColor = colors.grape, icon, iconTone = colors.grape, trailing = 'arrowR', onPress }: SItemRowProps) {
  return (
    <Springy
      onPress={onPress}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.rule,
        borderRadius: radii.tile, paddingVertical: 12, paddingHorizontal: 14,
      }}
    >
      <View style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: colors.petalDeep, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: 52, height: 52 }} contentFit="cover" />
        ) : icon ? (
          <UIcon name={icon} size={24} color={iconTone} stroke={2} />
        ) : (
          <Garment type={silhouette ?? 'jacket'} color={silhouetteColor} size={38} />
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontFamily: fonts.body700, fontSize: 15, color: colors.plum }}>{title}</Text>
        {sub ? <Text numberOfLines={1} style={{ fontFamily: fonts.body400, fontSize: 12.5, color: colors.muted, marginTop: 1 }}>{sub}</Text> : null}
      </View>
      {trailing ? <UIcon name={trailing} size={20} color={colors.muted} /> : null}
    </Springy>
  );
}
