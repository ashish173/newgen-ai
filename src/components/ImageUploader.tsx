"use client";
import { useState } from 'react';
import { extractGeoFromFile, geoFallback } from '@/lib/geo';

export default function ImageUploader({ onUpload }: { onUpload: (file: File, meta: { lat?: number; lng?: number; capturedAt?: string }) => void }) {
  const [busy, setBusy] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const exif = await extractGeoFromFile(file);
    const fallback = !exif.lat ? await geoFallback() : {};
    const lat = exif.lat ?? fallback.lat;
    const lng = exif.lng ?? fallback.lng;
    onUpload(file, { lat, lng, capturedAt: new Date().toISOString() });
    setBusy(false);
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} disabled={busy} />
    </div>
  );
}
