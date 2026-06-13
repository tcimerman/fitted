import { create } from 'zustand';
import { WeatherCache } from '@/types';

interface WeatherState {
  weather?: WeatherCache;
  loading: boolean;
  error?: string;
  set: (w: WeatherCache) => void;
  setLoading: (v: boolean) => void;
  setError: (e?: string) => void;
}

export const useWeatherStore = create<WeatherState>()((set) => ({
  weather: undefined,
  loading: false,
  error: undefined,
  set: (weather) => set({ weather, error: undefined }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
