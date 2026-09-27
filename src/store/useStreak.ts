// Daily "wore a fit" streak, derived from saved outfits' wornOn dates.
// A streak stays alive until the end of the day after the last wear.
import { useOutfitStore } from './useOutfitStore';
import { Outfit } from '@/types';
import { todayKey } from '@/utils';

const DAY = 864e5;
const keyOf = (d: Date) => todayKey(d);

export interface StreakInfo {
  current: number;
  best: number;
  woreToday: boolean;
  week: { key: string; label: string; worn: boolean; isToday: boolean }[]; // Mon..Sun of this week
}

export function computeStreak(saved: Outfit[], now = new Date()): StreakInfo {
  const days = new Set(saved.map((o) => o.wornOn).filter(Boolean) as string[]);
  const today = keyOf(now);
  const woreToday = days.has(today);

  // current: count back from today (or yesterday if today isn't worn yet)
  let current = 0;
  let cursor = new Date(now.getTime() - (woreToday ? 0 : DAY));
  while (days.has(keyOf(cursor))) {
    current++;
    cursor = new Date(cursor.getTime() - DAY);
  }

  // best: longest run in history
  const sorted = [...days].sort();
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const k of sorted) {
    const [y, m, d] = k.split('-').map(Number);
    const t = new Date(y, m - 1, d).getTime();
    run = prev != null && Math.round((t - prev) / DAY) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = t;
  }

  const monday = new Date(now);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const labels = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];
  const week = labels.map((label, i) => {
    const d = new Date(monday.getTime() + i * DAY);
    const key = keyOf(d);
    return { key, label, worn: days.has(key), isToday: key === today };
  });

  return { current, best: Math.max(best, current), woreToday, week };
}

export function useStreak(): StreakInfo {
  const saved = useOutfitStore((s) => s.saved);
  return computeStreak(saved);
}
