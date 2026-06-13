import * as Location from 'expo-location';

export interface Coords {
  lat: number;
  lon: number;
  city: string;
}

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentCoords(): Promise<Coords | null> {
  const { status } = await Location.getForegroundPermissionsAsync();
  if (status !== 'granted') return null;
  try {
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
    const { latitude: lat, longitude: lon } = pos.coords;
    let city = 'your spot';
    try {
      const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      city = geo[0]?.city ?? geo[0]?.region ?? city;
    } catch {}
    return { lat, lon, city };
  } catch {
    return null;
  }
}
