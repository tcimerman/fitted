import React from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Garment, GarmentType, UIcon } from './icons';
import { SBadge } from './SBadge';
import { Springy } from './Springy';
import { colors, radii } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

interface SGarmentTileProps {
  imageUri?: string;
  silhouette?: GarmentType;
  silhouetteColor?: string;
  label?: string;
  badge?: string;
  match?: number;
  selected?: boolean;
  onPress?: () => void;
  size?: number; // image area height
}

export function SGarmentTile({ imageUri, silhouette = 'tee', silhouetteColor = colors.punch, label, badge, match, selected, onPress, size = 84 }: SGarmentTileProps) {
  return (
    <Springy
      onPress={onPress}
      style={{
        flex: 1, position: 'relative', backgroundColor: colors.white,
        borderWidth: selected ? 2 : 1.5, borderColor: selected ? colors.punch : colors.rule,
        borderRadius: radii.tile, alignItems: 'center', gap: 6, paddingTop: 12, paddingBottom: 10, paddingHorizontal: 8,
      }}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: size, borderRadius: 10, backgroundColor: '#fff' }} contentFit="contain" transition={150} />
      ) : (
        <View style={{ height: size, alignItems: 'center', justifyContent: 'center' }}>
          <Garment type={silhouette} color={silhouetteColor} size={size * 0.74} />
        </View>
      )}
      {label ? (
        <Text numberOfLines={1} style={{ fontFamily: fonts.body600, fontSize: 12, color: colors.muted, maxWidth: '100%' }}>
          {label}
        </Text>
      ) : null}
      {selected ? (
        <View style={{ position: 'absolute', top: 9, right: 9, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.punch, alignItems: 'center', justifyContent: 'center' }}>
          <UIcon name="check" size={13} color="#fff" stroke={2.6} />
        </View>
      ) : null}
      {match != null ? (
        <View style={{ position: 'absolute', top: 9, left: 9 }}>
          <SBadge tone="mint">{match}%</SBadge>
        </View>
      ) : badge ? (
        <View style={{ position: 'absolute', top: 9, left: 9 }}>
          <SBadge tone="punch">{badge}</SBadge>
        </View>
      ) : null}
    </Springy>
  );
}
