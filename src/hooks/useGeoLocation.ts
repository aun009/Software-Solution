import { useState, useEffect } from 'react';

interface GeoData {
  isIndia: boolean;
  countryCode: string;
  loading: boolean;
}

// Bump this version whenever the detection logic changes.
// Old cached entries with a different version are automatically discarded.
const CACHE_VERSION = 'v3';
const GEO_CACHE_KEY = `sp_geo_${CACHE_VERSION}`;

// Module-level singleton — all hook instances share one in-flight request
let geoRequest: Promise<GeoData> | null = null;

// Wraps fetch with a manual timeout (AbortSignal.timeout not in all browsers)
const fetchWithTimeout = (url: string, ms: number, opts?: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...opts, signal: controller.signal }).finally(() => clearTimeout(timer));
};

// Calls geo services directly from the browser so the user's real IP is used.
// No server proxy — proxying through the server would use the server's IP instead.
const detectCountry = async (): Promise<string> => {
  // --- 1. ipapi.co (most reliable, JSON, CORS-enabled) ---
  try {
    const r = await fetchWithTimeout('https://ipapi.co/json/', 4000, {
      headers: { accept: 'application/json' },
    });
    if (r.ok) {
      const d = await r.json();
      const cc = (d.country_code || d.country || '').toUpperCase();
      if (cc.length === 2) return cc;
    }
  } catch { /* fall through */ }

  // --- 2. Cloudflare trace (plain-text, always free, no rate limits) ---
  try {
    const r = await fetchWithTimeout('https://cloudflare.com/cdn-cgi/trace', 4000);
    if (r.ok) {
      const text = await r.text();
      const match = text.match(/^loc=([A-Z]{2})/m);
      if (match) return match[1];
    }
  } catch { /* fall through */ }

  // --- 3. ip-api.com (JSON, CORS-enabled, free) ---
  try {
    const r = await fetchWithTimeout('http://ip-api.com/json/?fields=countryCode', 4000);
    if (r.ok) {
      const d = await r.json();
      const cc = (d.countryCode || '').toUpperCase();
      if (cc.length === 2) return cc;
    }
  } catch { /* fall through */ }

  // All lookups failed — return empty so caller defaults to India (safe fallback)
  return '';
};

export const useGeoLocation = (): GeoData => {
  // Start with loading:true — price display waits until geo resolves
  const [geo, setGeo] = useState<GeoData>({ isIndia: true, countryCode: '', loading: true });

  useEffect(() => {
    // Clear any old-version cache entries so stale India results don't persist
    for (let i = 0; i < 5; i++) {
      sessionStorage.removeItem(`sp_geo_v${i}`);
    }
    sessionStorage.removeItem('sp_geo'); // original key before versioning

    // Check the current-version cache
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed.countryCode === 'string' && parsed.countryCode.length === 2) {
          setGeo({ ...parsed, loading: false });
          return;
        }
      } catch { /* corrupted — fall through to fetch */ }
    }

    // Module-level singleton so concurrent renders share one fetch
    if (!geoRequest) {
      geoRequest = detectCountry().then(countryCode => {
        const isIndia = !countryCode || countryCode === 'IN';
        const result: GeoData = { isIndia, countryCode: countryCode || 'IN', loading: false };
        // Only cache a definitive result (not a failure fallback)
        if (countryCode) {
          sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(result));
        }
        return result;
      }).catch(() => {
        geoRequest = null; // allow retry on next mount
        return { isIndia: true, countryCode: 'IN', loading: false } as GeoData;
      });
    }

    geoRequest.then(result => {
      setGeo({ ...result, loading: false });
    });
  }, []);

  return geo;
};
