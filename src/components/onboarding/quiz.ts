// Onboarding quiz content + the tiny bit of math behind the "insight" step.
import { QuizAnswers } from '@/types';

export const ONBOARDING_GOALS = [
  { key: 'panic', emoji: '😩', title: 'end the “nothing to wear” panic', sub: 'a full closet and still stuck' },
  { key: 'time', emoji: '⏱️', title: 'get dressed faster', sub: 'mornings are chaos' },
  { key: 'wear-more', emoji: '♻️', title: 'wear more of what i own', sub: 'and buy less random stuff' },
  { key: 'work', emoji: '💼', title: 'look put-together for work', sub: 'meetings, interviews, client days' },
  { key: 'style', emoji: '🪩', title: 'find my style', sub: 'try new combos without the risk' },
  { key: 'travel', emoji: '🧳', title: 'pack smarter for trips', sub: 'no more 4 pairs of jeans for a weekend' },
] as const;

export const STRUGGLE_OPTIONS: { key: NonNullable<QuizAnswers['nothingToWear']>; emoji: string; title: string; sub: string }[] = [
  { key: 'daily', emoji: '🔥', title: 'literally every day', sub: 'the struggle is real' },
  { key: 'weekly', emoji: '😮‍💨', title: 'a few times a week', sub: 'usually when it matters most' },
  { key: 'sometimes', emoji: '🤷', title: 'now and then', sub: 'special days mostly' },
  { key: 'rarely', emoji: '😎', title: 'rarely — i just want more fun fits', sub: 'level up mode' },
];

export const MORNING_OPTIONS = [
  { minutes: 3, emoji: '⚡', title: 'under 5 minutes', sub: 'grab and go' },
  { minutes: 10, emoji: '🪞', title: '5–15 minutes', sub: 'a couple of mirror checks' },
  { minutes: 20, emoji: '👗', title: '15–30 minutes', sub: 'the bed is covered in clothes' },
  { minutes: 35, emoji: '🌪️', title: '30+ minutes', sub: 'full outfit crisis' },
] as const;

/** Hours a year we promise back: we assume a spin cuts picking time to ~2 min. */
export function hoursSavedPerYear(q?: QuizAnswers): number {
  const m = q?.morningMinutes ?? 10;
  return Math.max(6, Math.round(((Math.max(0, m - 2) * 300) / 60)));
}

export function goalTitle(key: string): string {
  return ONBOARDING_GOALS.find((g) => g.key === key)?.title ?? key;
}
