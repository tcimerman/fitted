import React from 'react';
import { Text, View } from 'react-native';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { SInput, SItemRow, UIcon } from '@/components/sorbet';
import { requestLocationPermission } from '@/services/location';
import { CityResult, searchCity } from '@/services/weather';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/typography';

export default function LocationStep() {
  const { next } = useOnboardingNav('location');
  const setManualCity = useSettingsStore((s) => s.setManualCity);
  const [asking, setAsking] = React.useState(false);
  const [denied, setDenied] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<CityResult[]>([]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      const q = query.trim();
      if (q.length < 2) setResults([]);
      else searchCity(q).then(setResults).catch(() => setResults([]));
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const askPermission = async () => {
    setAsking(true);
    const granted = await requestLocationPermission().finally(() => setAsking(false));
    if (granted) {
      setManualCity(undefined);
      next();
    } else {
      setDenied(true);
    }
  };

  return (
    <StepScaffold
      kicker="weather check"
      title="where does the day find you?"
      body="we peek at the forecast so your fit matches the sky — sun, rain, or rogue cold snap."
      ctaLabel={asking ? 'asking…' : 'use my location'}
      ctaLoading={asking}
      onNext={askPermission}
      skipLabel="skip for now"
      onSkip={() => next()}
    >
      {denied ? (
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 14 }}>
          <UIcon name="pin" size={16} color={colors.punch} />
          <Text style={[type.small, { color: colors.punch, flex: 1 }]}>no worries — type your city instead:</Text>
        </View>
      ) : null}
      <SInput icon="search" placeholder="or search your city…" value={query} onChangeText={setQuery} pill />
      <View style={{ gap: 10, marginTop: 14 }}>
        {results.map((r) => (
          <SItemRow
            key={`${r.name}-${r.lat}`}
            title={r.name}
            sub={r.country}
            icon="pin"
            onPress={() => {
              setManualCity({ name: r.name, lat: r.lat, lon: r.lon });
              next();
            }}
          />
        ))}
      </View>
    </StepScaffold>
  );
}
