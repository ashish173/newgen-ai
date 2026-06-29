// Client-side helper for EXIF-first geotagging with fallback to Geolocation API
// Note: This file is intended for client use only
import exifr from 'exifr';

export type Geo = { lat?: number; lng?: number };

export async function extractGeoFromFile(file: File): Promise<Geo> {
  try {
    const data = await exifr.gps(file).catch(() => null);
    if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
      return { lat: data.latitude, lng: data.longitude };
    }
  } catch {}
  return {};
}

export async function geoFallback(): Promise<Geo> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return {};
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve({})
    );
  });
}
