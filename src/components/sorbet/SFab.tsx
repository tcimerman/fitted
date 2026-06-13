import React from 'react';
import { UIcon, IconName } from './icons';
import { Springy } from './Springy';
import { colors, shadow } from '@/theme/tokens';

export function SFab({ icon = 'plus', onPress }: { icon?: IconName; onPress?: () => void }) {
  return (
    <Springy
      onPress={onPress}
      style={[
        { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.punch, alignItems: 'center', justifyContent: 'center' },
        shadow('fab'),
      ]}
    >
      <UIcon name={icon} size={28} color="#fff" stroke={2.6} />
    </Springy>
  );
}
