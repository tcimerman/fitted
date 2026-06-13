// UIcon + Garment — ported from design/project/app-icons.jsx (rounded 2px-stroke
// brand icons, flat garment silhouettes), extended with icons the app needs.
import React from 'react';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';

export type IconName =
  | 'sun' | 'hanger' | 'plus' | 'heart' | 'user' | 'search' | 'sliders' | 'check'
  | 'shuffle' | 'bolt' | 'cloud' | 'star' | 'arrowR' | 'arrowL' | 'chevronL' | 'chevronR'
  | 'camera' | 'image' | 'trash' | 'gear' | 'pin' | 'mail' | 'x' | 'pencil' | 'send' | 'sparkle' | 'key';

interface UIconProps {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
  fill?: boolean;
}

export function UIcon({ name, size = 22, color = '#311938', stroke = 1.8, fill = false }: UIconProps) {
  const p = { stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' as const };
  const map: Record<IconName, React.ReactNode> = {
    sun: (
      <G>
        <Circle cx="12" cy="12" r="4" {...p} />
        <Path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" {...p} />
      </G>
    ),
    hanger: (
      <G>
        <Path d="M12 6a2 2 0 1 1 1.4 3.4c-.9.6-1.4 1-1.4 1.8" {...p} />
        <Path d="M12 11 4 17h16l-8-6" {...p} />
      </G>
    ),
    plus: <Path d="M12 5v14M5 12h14" {...p} />,
    heart: <Path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20z" {...p} fill={fill ? color : 'none'} />,
    user: (
      <G>
        <Circle cx="12" cy="8" r="3.5" {...p} />
        <Path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" {...p} />
      </G>
    ),
    search: (
      <G>
        <Circle cx="11" cy="11" r="6" {...p} />
        <Path d="M20 20l-3.5-3.5" {...p} />
      </G>
    ),
    sliders: (
      <G>
        <Path d="M4 7h10M18 7h2M4 17h2M10 17h10" {...p} />
        <Circle cx="16" cy="7" r="2" {...p} />
        <Circle cx="8" cy="17" r="2" {...p} />
      </G>
    ),
    check: <Path d="M5 12l4 4 10-10" {...p} />,
    shuffle: <Path d="M3 7h4l10 10h4M3 17h4l3-3M14 7h3M17 4l3 3-3 3M17 14l3 3-3 3" {...p} />,
    bolt: <Path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" {...p} fill={fill ? color : 'none'} />,
    cloud: <Path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.5 3.5 0 0 1 18 18H7z" {...p} />,
    star: <Path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.8 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3z" {...p} fill={fill ? color : 'none'} />,
    arrowR: <Path d="M5 12h14M13 6l6 6-6 6" {...p} />,
    arrowL: <Path d="M19 12H5M11 6l-6 6 6 6" {...p} />,
    chevronL: <Path d="M14.5 5.5 8 12l6.5 6.5" {...p} />,
    chevronR: <Path d="M9.5 5.5 16 12l-6.5 6.5" {...p} />,
    camera: (
      <G>
        <Path d="M4 8h3l2-2.5h6L17 8h3a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 20H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 8z" {...p} />
        <Circle cx="12" cy="13.5" r="3.5" {...p} />
      </G>
    ),
    image: (
      <G>
        <Path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" {...p} />
        <Circle cx="9" cy="10" r="1.6" {...p} />
        <Path d="M4.5 18l5-5 3.5 3.5 3-3 3.5 3.5" {...p} />
      </G>
    ),
    trash: (
      <G>
        <Path d="M4.5 7h15M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M6.5 7l1 12a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-12" {...p} />
        <Path d="M10 11v5.5M14 11v5.5" {...p} />
      </G>
    ),
    gear: (
      <G>
        <Circle cx="12" cy="12" r="3" {...p} />
        <Path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" {...p} />
      </G>
    ),
    pin: (
      <G>
        <Path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" {...p} />
        <Circle cx="12" cy="10" r="2.3" {...p} />
      </G>
    ),
    mail: (
      <G>
        <Path d="M3.5 6h17a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" {...p} />
        <Path d="M3.5 7.5 12 13.5l8.5-6" {...p} />
      </G>
    ),
    x: <Path d="M6 6l12 12M18 6 6 18" {...p} />,
    pencil: <Path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" {...p} />,
    send: <Path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7z" {...p} />,
    sparkle: <Path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8L12 4zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17z" {...p} />,
    key: (
      <G>
        <Circle cx="8" cy="14" r="4" {...p} />
        <Path d="M11 11l8.5-8.5M16 6l3 3M13.5 8.5l2 2" {...p} />
      </G>
    ),
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {map[name] ?? map.sun}
    </Svg>
  );
}

export type GarmentType = 'tee' | 'jacket' | 'coat' | 'pants' | 'dress' | 'skirt' | 'sweater' | 'shoe' | 'tote' | 'hat';

const GARMENT_PATHS: Record<GarmentType, string> = {
  tee: 'M21 9 L12 17 L7 24 L14 31 L21 26 L21 54 Q21 56 23 56 L41 56 Q43 56 43 54 L43 26 L50 31 L57 24 L52 17 L43 9 L39 9 Q32 17 25 9 Z',
  jacket: 'M21 9 L12 17 L7 24 L14 31 L20 27 L20 54 Q20 56 22 56 L42 56 Q44 56 44 54 L44 27 L50 31 L57 24 L52 17 L43 9 L39 9 Q32 17 25 9 Z',
  coat: 'M21 8 L12 16 L7 23 L13 30 L19 26 L19 57 Q19 59 21 59 L43 59 Q45 59 45 57 L45 26 L51 30 L57 23 L52 16 L43 8 L39 8 Q32 16 25 8 Z',
  pants: 'M22 8 H42 L44 57 H34 L32 27 L30 57 H20 Z',
  dress: 'M23 9 L15 21 L21 27 L23 23 L17 53 Q17 56 20 56 L44 56 Q47 56 47 53 L41 23 L43 27 L49 21 L41 9 L38 9 Q32 16 26 9 Z',
  skirt: 'M19 21 H45 L51 53 Q51 56 48 56 L16 56 Q13 56 13 53 Z M19 21 L18 14 H46 L45 21 Z',
  sweater: 'M21 10 L11 18 L6 26 L13 33 L21 28 L21 53 Q21 56 24 56 L40 56 Q43 56 43 53 L43 28 L51 33 L58 26 L53 18 L43 10 L39 10 Q32 17 25 10 Z',
  shoe: 'M7 41 Q7 34 16 34 L29 34 L41 42 L53 44 Q58 45 58 50 L58 53 Q58 55 56 55 L9 55 Q7 55 7 53 Z',
  tote: 'M23 25 Q23 16 32 16 Q41 16 41 25 M15 25 H49 L47 55 Q47 57 45 57 L19 57 Q17 57 17 55 Z',
  hat: 'M14 44 Q14 30 32 30 Q50 30 50 44 M8 44 H56 Q56 49 32 49 Q8 49 8 44 Z',
};

export function Garment({ type, color = '#C9C0AE', size = 64 }: { type: GarmentType; color?: string; size?: number }) {
  const stroke = 'rgba(0,0,0,0.22)';
  const showLine = type === 'jacket' || type === 'coat';
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path d={GARMENT_PATHS[type] ?? GARMENT_PATHS.tee} fill={color} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
      {showLine ? <Line x1={32} y1={14} x2={32} y2={55} stroke={stroke} strokeWidth={1.5} /> : null}
    </Svg>
  );
}

// Garment silhouette for an app category (placeholders/empty states)
export const CATEGORY_GARMENT: Record<string, GarmentType> = {
  top: 'tee', bottom: 'pants', shoes: 'shoe', socks: 'shoe', accessory: 'tote', dress: 'dress', outerwear: 'jacket',
};
