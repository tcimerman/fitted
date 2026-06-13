// Hidden component gallery — visual regression surface for the Sorbet kit.
// Reachable from You → "component gallery".
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Garment, SAvatar, SBadge, SButton, SChip, SFab, SGarmentTile, SIconButton, SInput,
  SItemRow, SProgress, SSegmented, SStars, SToggle, SWeatherPill, UIcon, toast,
} from '@/components/sorbet';
import { colors, radii } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.rule, borderRadius: radii.card, padding: 18, gap: 14 }}>
      <Text style={{ fontFamily: fonts.body800, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: colors.muted }}>{title}</Text>
      {children}
    </View>
  );
}

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [seg, setSeg] = React.useState(0);
  const [chip, setChip] = React.useState(0);
  const [tog, setTog] = React.useState(true);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.petal }}
      contentContainerStyle={{ paddingTop: insets.top + 10, paddingHorizontal: 20, paddingBottom: 60, gap: 16 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={type.h1}>sorbet kit</Text>
        <SIconButton icon="x" onPress={() => router.back()} />
      </View>

      <Block title="buttons">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <SButton variant="primary" icon="bolt" onPress={() => toast('wear it tapped ✨')}>wear it</SButton>
          <SButton variant="secondary" icon="shuffle">remix</SButton>
          <SButton variant="mint">save</SButton>
          <SButton variant="ghost">maybe</SButton>
          <SButton variant="outline">skip</SButton>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <SIconButton icon="heart" tone="punch" />
          <SIconButton icon="heart" tone="punch" filled />
          <SFab onPress={() => toast('fab!')} />
        </View>
      </Block>

      <Block title="chips & segmented">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {['All', 'Tops', 'Bottoms', 'Shoes', 'Bags'].map((o, i) => (
            <SChip key={o} active={chip === i} onPress={() => setChip(i)}>{o}</SChip>
          ))}
        </View>
        <SSegmented options={['Outfits', 'Items']} index={seg} onChange={setSeg} />
      </Block>

      <Block title="badges & stars">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <SBadge tone="mint" icon="star">92% match</SBadge>
          <SBadge tone="punch">new</SBadge>
          <SBadge tone="grape">date night</SBadge>
          <SBadge tone="lemon">5★ fit</SBadge>
          <SBadge tone="neutral">worn 4×</SBadge>
        </View>
        <SStars n={4} />
        <SWeatherPill>17° · sunny all day</SWeatherPill>
      </Block>

      <Block title="inputs & controls">
        <SInput icon="search" placeholder="search your closet…" pill />
        <SInput label="item name" icon="hanger" placeholder="pink cargo pants" />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={type.bodyBold}>weather-based picks</Text>
          <SToggle value={tog} onChange={setTog} />
        </View>
        <SProgress pct={70} label="closet logged" />
      </Block>

      <Block title="tiles & rows">
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <SGarmentTile silhouette="tee" silhouetteColor={colors.punch} match={92} label="tee" />
          <SGarmentTile silhouette="jacket" silhouetteColor={colors.grape} selected label="jacket" />
          <SGarmentTile silhouette="dress" silhouetteColor={colors.mint} badge="new" label="dress" />
        </View>
        <SItemRow title="denim jacket" sub="worn 4× · last week" silhouette="jacket" />
        <SAvatar letter="m" />
      </Block>

      <Block title="garment silhouettes">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {(['tee', 'jacket', 'coat', 'pants', 'dress', 'skirt', 'sweater', 'shoe', 'tote', 'hat'] as const).map((t, i) => (
            <View key={t} style={{ width: 64, height: 64, borderRadius: 14, backgroundColor: colors.petal, borderWidth: 1, borderColor: colors.rule, alignItems: 'center', justifyContent: 'center' }}>
              <Garment type={t} color={[colors.punch, colors.grape, colors.mint, colors.lemon][i % 4]} size={42} />
            </View>
          ))}
        </View>
      </Block>

      <Block title="ui icons">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
          {(['sun', 'hanger', 'plus', 'heart', 'user', 'search', 'sliders', 'check', 'shuffle', 'bolt', 'cloud', 'star', 'camera', 'image', 'trash', 'gear', 'pin', 'mail', 'send', 'sparkle', 'key'] as const).map((n) => (
            <UIcon key={n} name={n} size={24} color={colors.grape} />
          ))}
        </View>
      </Block>
    </ScrollView>
  );
}
