// Hook: keeps the weather store fresh from GPS (or the manual city fallback).
import React from 'react';
import { getCurrentCoords } from '@/services/location';
import { fetchWeather, isFresh } from '@/services/weather';
import { useSettingsStore } from './useSettingsStore';
import { useWeatherStore } from './useWeatherStore';

export function useWeather() {
  const { weather, loading, error } = useWeatherStore();
  const manualCity = useSettingsStore((s) => s.manualCity);

  const refresh = React.useCallback(async (force = false) => {
    const store = useWeatherStore.getState();
    const manual = useSettingsStore.getState().manualCity;
    const coords = manual ? { lat: manual.lat, lon: manual.lon, city: manual.name } : await getCurrentCoords();
    if (!coords) {
      if (!store.weather) store.setError('no location — set your city in settings');
      return;
    }
    if (!force && isFresh(store.weather, coords.lat, coords.lon)) return;
    store.setLoading(true);
    try {
      store.set(await fetchWeather(coords.lat, coords.lon, coords.city));
    } catch {
      store.setError("couldn't fetch the weather");
    } finally {
      store.setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh, manualCity]);

  return { weather, loading, error, refresh };
}
