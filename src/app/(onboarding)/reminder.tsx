// Habit hook: pick the time your daily spin drops. Saved to settings; the
// actual local notification needs expo-notifications in a dev build (next wave).
import React from 'react';
import { Text, View } from 'react-native';
import { StepScaffold } from '@/components/onboarding/StepScaffold';
import { useOnboardingNav } from '@/components/onboarding/useOnboardingNav';
import { SChip, UIcon } from '@/components/sorbet';
import { useSettingsStore } from '@/store/useSettingsStore';
import { colors, radii, shadow } from '@/theme/tokens';
import { fonts, type } from '@/theme/typography';

const TIMES = ['06:30', '07:00', '07:30', '08:00', '08:30', '09:00'];

export default function ReminderStep() {
  const { next } = useOnboardingNav('reminder');
  const saved = useSettingsStore((s) => s.reminderTime);
  const setReminderTime = useSettingsStore((s) => s.setReminderTime);
  const setDailyReminder = useSettingsStore((s) => s.setDailyReminder);
  const [time, setTime] = React.useState(saved);

  return (
    <StepScaffold
      kicker="make it a habit"
      title="when should your daily spin drop?"
      body="a tiny morning nudge with today’s fit + the weather — the easiest way to keep your streak alive."
      ctaLabel={`remind me at ${time}`}
      onNext={() => {
        setReminderTime(time);
        setDailyReminder(true);
        next();
      }}
      skipLabel="not now"
      onSkip={() => {
        setDailyReminder(false);
        next();
      }}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {TIMES.map((t) => (
          <SChip key={t} tone="grape" active={time === t} onPress={() => setTime(t)}>
            {t}
          </SChip>
        ))}
      </View>
      {/* preview of the notification */}
      <View style={[{ marginTop: 26, flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: colors.white, borderRadius: radii.tile, borderWidth: 1.5, borderColor: colors.rule, padding: 14 }, shadow('sm')]}>
        <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: colors.punch, alignItems: 'center', justifyContent: 'center' }}>
          <UIcon name="sparkle" size={20} color="#fff" stroke={2.2} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fonts.body800, fontSize: 13, color: colors.plum }}>OutfitSpin</Text>
            <Text style={type.small}>{time}</Text>
          </View>
          <Text style={{ fontFamily: fonts.body500, fontSize: 13.5, color: colors.plum, marginTop: 2 }}>
            14° and sunny ☀️ your fit is ready — keep the 🔥 going.
          </Text>
        </View>
      </View>
    </StepScaffold>
  );
}
