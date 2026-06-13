import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { NavItem, SBottomNav } from '@/components/sorbet';
import { colors } from '@/theme/tokens';

const NAV_ITEMS: NavItem[] = [
  { key: 'index', icon: 'sun', label: 'Today' },
  { key: 'closet', icon: 'hanger', label: 'Closet' },
  { key: 'saved', icon: 'heart', label: 'Saved' },
  { key: 'you', icon: 'user', label: 'You' },
];

export default function TabsLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.petal } }}
      tabBar={({ state, navigation }) => (
        <SBottomNav
          items={NAV_ITEMS}
          activeKey={state.routes[state.index].name}
          onTab={(key) => navigation.navigate(key as never)}
          onFab={() => router.push('/add-garment')}
        />
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="closet" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="you" />
    </Tabs>
  );
}
