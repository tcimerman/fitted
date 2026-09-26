import * as Crypto from 'expo-crypto';

export const uid = () => Crypto.randomUUID();

export const todayKey = (d = new Date()) => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export const weekdayName = (d = new Date()) => WEEKDAYS[d.getDay()];

export const dateLine = (d = new Date()) => `${DAYS[d.getDay()]} · ${d.getDate()} ${MONTHS[d.getMonth()]}`;

// lowercase hype-friend greetings, rotated by hour bucket
export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 5) return 'late night lewks 🌙';
  if (h < 11) return 'rise & slay ✨';
  if (h < 14) return 'midday glow-up ☀️';
  if (h < 18) return "afternoon's calling 💅";
  return 'evening energy 🌆';
}

export const cToF = (c: number) => Math.round((c * 9) / 5 + 32);
export const formatTemp = (c: number, unit: 'C' | 'F') => (unit === 'F' ? `${cToF(c)}°` : `${Math.round(c)}°`);

// WMO weather code → lowercase summary + icon name
export function weatherSummary(code: number): { summary: string; icon: 'sun' | 'cloud' } {
  if (code === 0) return { summary: 'clear skies', icon: 'sun' };
  if (code <= 2) return { summary: 'partly sunny', icon: 'sun' };
  if (code === 3) return { summary: 'cloudy', icon: 'cloud' };
  if (code <= 48) return { summary: 'foggy', icon: 'cloud' };
  if (code <= 57) return { summary: 'drizzle', icon: 'cloud' };
  if (code <= 67) return { summary: 'rainy', icon: 'cloud' };
  if (code <= 77) return { summary: 'snowy', icon: 'cloud' };
  if (code <= 82) return { summary: 'rain showers', icon: 'cloud' };
  if (code <= 86) return { summary: 'snow showers', icon: 'cloud' };
  return { summary: 'stormy', icon: 'cloud' };
}
