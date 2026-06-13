// Shared layout for onboarding steps: kicker, big lowercase title, body, content,
// pinned CTA row. Keyboard-aware for the text-input steps.
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EnterIn, SButton } from '@/components/sorbet';
import { colors } from '@/theme/tokens';
import { type } from '@/theme/typography';

interface StepScaffoldProps {
  kicker: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
  ctaLabel: string;
  ctaDisabled?: boolean;
  ctaLoading?: boolean;
  onNext: () => void;
  skipLabel?: string;
  onSkip?: () => void;
}

export function StepScaffold({ kicker, title, body, children, ctaLabel, ctaDisabled, ctaLoading, onNext, skipLabel, onSkip }: StepScaffoldProps) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.petal }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 18, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <EnterIn>
          <Text style={[type.kicker, { marginBottom: 10 }]}>{kicker}</Text>
          <Text style={[type.hero, { fontSize: 36, lineHeight: 40, marginBottom: 12 }]}>{title}</Text>
          {body ? <Text style={[type.bodyMuted, { fontSize: 16, lineHeight: 24, marginBottom: 26 }]}>{body}</Text> : null}
        </EnterIn>
        <View style={{ flex: 1 }}>{children}</View>
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: Math.max(insets.bottom, 16), gap: 12 }}>
        <SButton variant="primary" size="lg" full disabled={ctaDisabled} loading={ctaLoading} onPress={onNext}>
          {ctaLabel}
        </SButton>
        {skipLabel && onSkip ? (
          <SButton variant="ghost" size="md" full onPress={onSkip}>
            {skipLabel}
          </SButton>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}
