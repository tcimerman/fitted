// Open-Meteo: free, keyless forecast + geocoding for the manual-city fallback.
import { WeatherCache } from '@/types';
import { weatherSummary } from '@/utils';

const TTL_MS = 30 * 60 * 1000;

export interface CityResult {
  name: string;
  country?: string;
  lat: number;
  lon: number;
}

export async function searchCity(query: string): Promise<CityResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`geocoding ${res.status}`);
  const json = await res.json();
  return (json.results ?? []).map((r: any) => ({
    name: r.name,
    country: r.country,
    lat: r.latitude,
    lon: r.longitude,
  }));
}

export async function fetchWeather(lat: number, lon: number, city: string): Promise<WeatherCache> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    '&current=temperature_2m,apparent_temperature,weather_code' +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=1&timezone=auto';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const json = await res.json();
  const code = json.current?.weather_code ?? 0;
  return {
    tempC: json.current?.temperature_2m ?? 18,
    feelsLikeC: json.current?.apparent_temperature ?? json.current?.temperature_2m ?? 18,
    tempMinC: json.daily?.temperature_2m_min?.[0] ?? 12,
    tempMaxC: json.daily?.temperature_2m_max?.[0] ?? 22,
    precipProbability: json.daily?.precipitation_probability_max?.[0] ?? 0,
    weatherCode: code,
    summary: weatherSummary(code).summary,
    city,
    lat,
    lon,
    fetchedAt: Date.now(),
  };
}

export function isFresh(w: WeatherCache | undefined, lat?: number, lon?: number): boolean {
  if (!w) return false;
  if (Date.now() - w.fetchedAt > TTL_MS) return false;
  if (lat != null && lon != null && (Math.abs(w.lat - lat) > 0.05 || Math.abs(w.lon - lon) > 0.05)) return false;
  return true;
}
