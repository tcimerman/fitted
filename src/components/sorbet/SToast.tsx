// Global toast: plum pill with a tonal check circle. Mount <ToastHost/> once in
// the root layout; fire with toast('saved to faves ✨') from anywhere.
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UIcon, IconName } from './icons';
import { colors, shadow } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

type Tone = 'grape' | 'mint' | 'punch' | 'lemon';
interface ToastMsg { id: number; text: string; tone: Tone; icon: IconName }

let push: ((t: ToastMsg) => void) | null = null;
let seq = 0;

export function toast(text: string, tone: Tone = 'grape', icon: IconName = 'check') {
  push?.({ id: ++seq, text, tone, icon });
}

export function ToastHost() {
  const [msg, setMsg] = React.useState<ToastMsg | null>(null);
  const insets = useSafeAreaInsets();
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    push = (t) => {
      setMsg(t);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(null), 2800);
    };
    return () => {
      push = null;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  if (!msg) return null;
  return (
    <Animated.View
      key={msg.id}
      entering={FadeInDown.springify().damping(14)}
      exiting={FadeOutDown.duration(180)}
      pointerEvents="none"
      style={[
        {
          position: 'absolute', bottom: insets.bottom + 100, alignSelf: 'center',
          flexDirection: 'row', alignItems: 'center', gap: 12, maxWidth: '88%',
          backgroundColor: colors.plum, borderRadius: 999, paddingVertical: 13, paddingHorizontal: 20,
        },
        shadow('md'),
      ]}
    >
      <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: colors[msg.tone], alignItems: 'center', justifyContent: 'center' }}>
        <UIcon name={msg.icon} size={15} color="#fff" stroke={2.6} />
      </View>
      <Text style={{ fontFamily: fonts.body600, fontSize: 14.5, color: '#fff', flexShrink: 1 }}>{msg.text}</Text>
    </Animated.View>
  );
}
