import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { choosePhotoSource } from '@/components/onboarding/PhotoSlot';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { useIngestGarment } from '@/components/closet/useIngestGarment';
import { SGarmentTile, Springy, UIcon } from '@/components/sorbet';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { colors, radii } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export default function WardrobeStep() {
  const { next } = useOnboardingNav('wardrobe');
  const garments = useWardrobeStore((s) => s.garments);
  const { phase, ingest } = useIngestGarment();
  const busy = phase === 'analyzing';

  const addOne = () => choosePhotoSource((source) => void ingest(source));

  return (
    <StepScaffold
      kicker="stock the closet"
      title="drop your first fits"
      body="snap a few pieces from your wardrobe — tops, bottoms, shoes. the ai tags each one and gives it a clean studio glow-up. you can add more any time."
      ctaLabel={garments.length > 0 ? `done — ${garments.length} in the closet` : 'add at least one piece'}
      ctaDisabled={garments.length === 0}
      onNext={() => next()}
      skipLabel="skip — closet stays empty"
      onSkip={() => next()}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {garments.map((g) => (
          <View key={g.id} style={{ width: '31%' }}>
            <SGarmentTile imageUri={g.thumbUri} label={g.name} size={72} />
          </View>
        ))}
        <Springy onPress={addOne} style={{ width: '31%' }} disabled={busy}>
          <View
            style={{
              aspectRatio: 0.78, borderRadius: radii.tile, borderWidth: 1.5, borderColor: colors.rule,
              borderStyle: 'dashed', backgroundColor: colors.petalDeep, alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {busy ? (
              <>
                <ActivityIndicator color={colors.punch} />
                <Text style={{ fontFamily: fonts.body600, fontSize: 11.5, color: colors.muted }}>tagging…</Text>
              </>
            ) : (
              <>
                <UIcon name="plus" size={26} color={colors.punch} stroke={2.4} />
                <Text style={{ fontFamily: fonts.body600, fontSize: 11.5, color: colors.muted }}>add piece</Text>
              </>
            )}
          </View>
        </Springy>
      </View>
    </StepScaffold>
  );
}
