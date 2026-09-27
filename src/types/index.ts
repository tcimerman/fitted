export type GarmentCategory = 'top' | 'bottom' | 'shoes' | 'socks' | 'accessory' | 'dress' | 'outerwear';
export type Slot = 'top' | 'bottom' | 'shoes' | 'socks' | 'accessory' | 'outerwear';

export const ALL_CATEGORIES: GarmentCategory[] = ['top', 'bottom', 'shoes', 'socks', 'accessory', 'dress', 'outerwear'];
export const ALL_SLOTS: Slot[] = ['top', 'bottom', 'shoes', 'socks', 'accessory', 'outerwear'];

export type GenderPresentation = 'feminine' | 'masculine' | 'androgynous' | 'unspecified';

// Answers from the onboarding quiz — personalises copy, the paywall pitch and
// the stylist prompt. All optional so pre-OutfitSpin profiles still load.
export interface QuizAnswers {
  goals: string[]; // keys from ONBOARDING_GOALS
  nothingToWear?: 'daily' | 'weekly' | 'sometimes' | 'rarely';
  morningMinutes?: number; // typical minutes spent picking an outfit
}

export interface UserProfile {
  name: string;
  email: string;
  genderPresentation: GenderPresentation;
  preferredStyles: string[];
  bodyPhotos: { front?: string; side?: string; back?: string };
  facePhotoUri?: string;
  quiz?: QuizAnswers;
  createdAt: number;
}

export interface Garment {
  id: string;
  category: GarmentCategory;
  name: string;
  colors: string[];
  styleTags: string[];
  warmth: number; // 1 summer-only → 5 deep winter
  formality: number; // 1 loungewear → 5 black tie
  description: string;
  originalUri: string;
  enhancedUri?: string;
  thumbUri: string;
  createdAt: number;
  isArchived: boolean;
}

export interface OutfitSlot {
  slot: Slot;
  itemId: string;
  alternatives: string[]; // ranked garment IDs for ◀ ▶, excludes itemId
}

export interface WeatherSnapshot {
  tempC: number;
  feelsLikeC: number;
  tempMinC: number;
  tempMaxC: number;
  precipProbability: number;
  weatherCode: number;
  summary: string;
  city: string;
}

export interface WeatherCache extends WeatherSnapshot {
  lat: number;
  lon: number;
  fetchedAt: number;
}

export interface Outfit {
  id: string;
  occasion: string;
  slots: OutfitSlot[];
  matchScore: number; // 0–100
  why: string;
  weather?: WeatherSnapshot;
  createdAt: number;
  isFavorite: boolean;
  wornOn?: string; // 'YYYY-MM-DD' once "wear it" is tapped
  tryOnUri?: string;
}
