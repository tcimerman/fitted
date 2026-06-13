// Tappable photo capture slot used for body/face photos.
import React from 'react';
import { ActionSheetIOS, Alert, Platform, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Springy, UIcon } from '@/components/sorbet';
import { pickImage, PickSource } from '@/services/images';
import { colors, radii } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

interface PhotoSlotProps {
  label: string;
  uri?: string;
  aspect?: number; // width/height
  onPicked: (sourceUri: string) => void;
}

export function choosePhotoSource(onSource: (s: PickSource) => void) {
  if (Platform.OS === 'web') {
    // browser: straight to the file picker, no action sheet
    onSource('library');
    return;
  }
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      { options: ['take a photo', 'pick from library', 'cancel'], cancelButtonIndex: 2 },
      (i) => {
        if (i === 0) onSource('camera');
        if (i === 1) onSource('library');
      },
    );
  } else {
    Alert.alert('add a photo', undefined, [
      { text: 'take a photo', onPress: () => onSource('camera') },
      { text: 'pick from library', onPress: () => onSource('library') },
      { text: 'cancel', style: 'cancel' },
    ]);
  }
}

export function PhotoSlot({ label, uri, aspect = 0.72, onPicked }: PhotoSlotProps) {
  const handlePress = () => {
    choosePhotoSource(async (source) => {
      const picked = await pickImage(source);
      if (picked) onPicked(picked);
    });
  };
  return (
    <Springy onPress={handlePress} style={{ flex: 1 }}>
      <View
        style={{
          aspectRatio: aspect, borderRadius: radii.tile, overflow: 'hidden',
          backgroundColor: uri ? colors.white : colors.petalDeep,
          borderWidth: 1.5, borderColor: uri ? colors.mint : colors.rule,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        {uri ? (
          <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        ) : (
          <UIcon name="camera" size={28} color={colors.muted} stroke={1.8} />
        )}
        {uri ? (
          <View style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' }}>
            <UIcon name="check" size={13} color="#fff" stroke={2.6} />
          </View>
        ) : null}
      </View>
      <Text style={{ fontFamily: fonts.body600, fontSize: 12.5, color: colors.muted, textAlign: 'center', marginTop: 7 }}>{label}</Text>
    </Springy>
  );
}
