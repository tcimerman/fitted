// Brand bottom nav: Today · Closet · [+ FAB] · Saved · You. Used as the custom
// tabBar for the (tabs) group; the FAB is not a tab — it pushes /add-garment.
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticSelect } from '@/utils/feedback';
import { UIcon, IconName } from './icons';
import { SFab } from './SFab';
import { colors, radii, shadow } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export interface NavItem { key: string; icon: IconName; label: string }

interface SBottomNavProps {
  items: NavItem[]; // 4 tabs; FAB is rendered between items[1] and items[2]
  activeKey: string;
  onTab: (key: string) => void;
  onFab: () => void;
}

export function SBottomNav({ items, activeKey, onTab, onFab }: SBottomNavProps) {
  const insets = useSafeAreaInsets();
  const renderTab = (it: NavItem) => {
    const active = it.key === activeKey;
    return (
      <Pressable
        key={it.key}
        onPress={() => {
          hapticSelect();
          onTab(it.key);
        }}
        style={{ alignItems: 'center', gap: 3, width: 56 }}
      >
        <UIcon name={it.icon} size={22} color={active ? colors.punch : colors.muted} stroke={active ? 2.3 : 1.8} />
        <Text style={{ fontFamily: active ? fonts.body700 : fonts.body500, fontSize: 10.5, color: active ? colors.plum : colors.muted }}>
          {it.label}
        </Text>
      </Pressable>
    );
  };
  return (
    <View style={{ position: 'absolute', left: 14, right: 14, bottom: Math.max(insets.bottom, 10) }}>
      <View
        style={[
          {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
            backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.rule,
            borderRadius: radii.card, paddingTop: 10, paddingBottom: 8, paddingHorizontal: 14,
          },
          shadow('md'),
        ]}
      >
        {items.slice(0, 2).map(renderTab)}
        <View style={{ marginTop: -26 }}>
          <SFab onPress={onFab} />
        </View>
        {items.slice(2).map(renderTab)}
      </View>
    </View>
  );
}
