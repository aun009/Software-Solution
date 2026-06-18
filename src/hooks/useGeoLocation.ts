import { useState, useEffect } from 'react';

interface GeoData {
  isIndia: boolean;
  countryCode: string;
  loading: boolean;
}

const GEO_CACHE_KEY = 'sp_geo';
// Safe fallback: default to India so prices don't flash to USD on error
const GEO_FALLBACK: GeoData = { isIndia: true, countryCode: 'IN', loading: false };
// Module-level singleton — all hook instances share one in-flight request
let geoRequest: Promise<GeoData> | null = null;

export const useGeoLocation = (): GeoData => {
  // Start with loading:true — prevents any price flash before geo is resolved
  const [geo, setGeo] = useState<GeoData>({ isIndia: true, countryCode: '', loading: true });

  useEffect(() => {
    // 1. Hit sessionStorage cache first (avoids a network round-trip on re-renders / SPA nav)
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setGeo({ ...parsed, loading: false });
        return;
      } catch { /* corrupted cache — fall through to fetch */ }
    }

    // 2. Reuse an in-flight request if one is already running
    if (!geoRequest) {
      geoRequest = fetch('/api/geo', { headers: { accept: 'application/json' } })
        .then(r => {
          if (!r.ok) throw new Error(`Geo lookup failed: ${r.status}`);
          const ct = r.headers.get('content-type') ?? '';
          if (!ct.includes('application/json')) throw new Error('Geo endpoint returned non-JSON');
          return r.json();
        })
        .then((data: any) => {
          // Accept both { countryCode } and { country_code } shapes
          const countryCode: string = (data.countryCode || data.country_code || 'IN').toUpperCase();
          const result: GeoData = { isIndia: countryCode === 'IN', countryCode, loading: false };
          sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(result));
          return result;
        })
        .catch(() => {
          // On any error, default to India (safe for pricing — avoids showing USD to Indians)
          sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(GEO_FALLBACK));
          geoRequest = null; // Allow retry on next mount after failure
          return GEO_FALLBACK;
        });
    }

    // 3. Attach to the shared promise
    geoRequest.then(result => {
      setGeo({ ...result, loading: false });
    });
  }, []);

  return geo;
};
