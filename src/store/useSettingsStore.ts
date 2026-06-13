import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ManualCity {
  name: string;
  lat: number;
  lon: number;
}

interface SettingsState {
  unit: 'C' | 'F';
  weatherPicks: boolean;
  dailyReminder: boolean;
  manualCity?: ManualCity;
  setUnit: (u: 'C' | 'F') => void;
  setWeatherPicks: (v: boolean) => void;
  setDailyReminder: (v: boolean) => void;
  setManualCity: (c?: ManualCity) => void;
  resetAll: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      unit: 'C',
      weatherPicks: true,
      dailyReminder: false,
      manualCity: undefined,
      setUnit: (unit) => set({ unit }),
      setWeatherPicks: (weatherPicks) => set({ weatherPicks }),
      setDailyReminder: (dailyReminder) => set({ dailyReminder }),
      setManualCity: (manualCity) => set({ manualCity }),
      resetAll: () => set({ unit: 'C', weatherPicks: true, dailyReminder: false, manualCity: undefined }),
    }),
    { name: 'fitted-settings', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
