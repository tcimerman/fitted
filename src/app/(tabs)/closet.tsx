import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnterIn, Garment as GarmentIcon, SBadge, SChip, SGarmentTile, SInput, CATEGORY_GARMENT } from '@/components/sorbet';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { Garment, GarmentCategory } from '@/types';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/typography';

const FILTERS: { key: 'all' | GarmentCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'top', label: 'Tops' },
  { key: 'bottom', label: 'Bottoms' },
  { key: 'dress', label: 'Dresses' },
  { key: 'shoes', label: 'Shoes' },
  { key: 'outerwear', label: 'Outerwear' },
  { key: 'accessory', label: 'Accessories' },
  { key: 'socks', label: 'Socks' },
];

export default function ClosetScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const garments = useWardrobeStore((s) => s.garments);
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | GarmentCategory>('all');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return garments.filter((g) => {
      if (filter !== 'all' && g.category !== filter) return false;
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        g.colors.some((c) => c.includes(q)) ||
        g.styleTags.some((t) => t.includes(q))
      );
    });
  }, [garments, query, filter]);

  const renderTile = ({ item }: { item: Garment }) => (
    <View style={{ flex: 1 / 3, padding: 4 }}>
      <SGarmentTile
        imageUri={item.thumbUri}
        label={item.name}
        badge={!item.enhancedUri ? undefined : undefined}
        onPress={() => router.push(`/garment/${item.id}` as never)}
        size={84}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.petal, paddingTop: insets.top + 8 }}>
      <View style={{ paddingHorizontal: 20, gap: 14, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={type.h1}>my closet</Text>
          <SBadge tone="grape">{garments.length} {garments.length === 1 ? 'piece' : 'pieces'}</SBadge>
        </View>
        <SInput icon="search" placeholder="search your closet…" value={query} onChangeText={setQuery} pill />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={(f) => f.key}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item: f }) => (
            <SChip active={filter === f.key} onPress={() => setFilter(f.key)}>
              {f.label}
            </SChip>
          )}
        />
      </View>
      {filtered.length === 0 ? (
        <EnterIn style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingBottom: 120 }}>
          <GarmentIcon type={filter !== 'all' ? (CATEGORY_GARMENT[filter] as never) : 'tee'} color={colors.punchSoft} size={84} />
          <Text style={[type.h3, { textAlign: 'center', marginTop: 16 }]}>
            {garments.length === 0 ? 'closet’s empty??' : 'nothing matches'}
          </Text>
          <Text style={[type.bodyMuted, { textAlign: 'center', marginTop: 6 }]}>
            {garments.length === 0 ? 'let’s fix that — tap the big pink + and drop your first fit.' : 'try a different search or filter.'}
          </Text>
        </EnterIn>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(g) => g.id}
          numColumns={3}
          renderItem={renderTile}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
