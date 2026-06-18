import { useState, useEffect } from 'react';

interface GeoData {
  isIndia: boolean;
  countryCode: string;
  loading: boolean;
}

const GEO_CACHE_KEY = 'sp_geo';
// NOTE: fallback is intentionally NOT stored in sessionStorage on failure
// so the next page load retries the lookup instead of being permanently wrong.
let geoRequest: Promise<GeoData> | null = null;

// Call the geo service directly from the browser — this is the correct approach.
// The browser sends its own real IP; no server proxy needed and no IP masking issues.
// ipapi.co supports CORS on /json/ for free (no API key needed, 1k req/day free tier).
// We try two services: ipapi.co first, cloudflare trace as a reliable fallback.
const detectCountry = async (): Promise<string> => {
  // --- Primary: ipapi.co ---
  try {
    const r = await fetch('https://ipapi.co/json/', {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (r.ok) {
      const d = await r.json();
      const cc = (d.country_code || d.country || '').toUpperCase();
      if (cc.length === 2) return cc;
    }
  } catch { /* fall through to backup */ }

  // --- Backup: Cloudflare trace (plain text, always free, no rate limits) ---
  try {
    const r = await fetch('https://cloudflare.com/cdn-cgi/trace', {
      signal: AbortSignal.timeout(4000),
    });
    if (r.ok) {
      const text = await r.text();
      const match = text.match(/^loc=([A-Z]{2})/m);
      if (match) return match[1];
    }
  } catch { /* fall through */ }

  // --- Last resort: our own server endpoint (may use server IP but better than nothing) ---
  try {
    const r = await fetch('/api/geo', {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (r.ok) {
      const ct = r.headers.get('content-type') ?? '';
      if (ct.includes('application/json')) {
        const d = await r.json();
        const cc = (d.countryCode || d.country_code || '').toUpperCase();
        if (cc.length === 2) return cc;
      }
    }
  } catch { /* give up */ }

  // All lookups failed — return empty string so the caller defaults to India
  return '';
};

export const useGeoLocation = (): GeoData => {
  // loading: true until geo resolves — prevents any price flash
  const [geo, setGeo] = useState<GeoData>({ isIndia: true, countryCode: '', loading: true });

  useEffect(() => {
    // 1. sessionStorage cache — avoids repeated lookups within the same browser session
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed.countryCode === 'string' && parsed.countryCode.length === 2) {
          setGeo({ ...parsed, loading: false });
          return;
        }
      } catch { /* corrupted — fall through */ }
    }

    // 2. Module-level singleton — all hook instances share one in-flight request
    if (!geoRequest) {
      geoRequest = detectCountry().then(countryCode => {
        const isIndia = countryCode === 'IN' || countryCode === '';
        const result: GeoData = { isIndia, countryCode: countryCode || 'IN', loading: false };
        // Only cache a successful (non-empty) result so failures are retried next session
        if (countryCode) {
          sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(result));
        }
        return result;
      }).catch(() => {
        geoRequest = null; // allow retry
        return { isIndia: true, countryCode: 'IN', loading: false } as GeoData;
      });
    }

    // 3. Attach to the shared promise
    geoRequest.then(result => {
      setGeo({ ...result, loading: false });
    });
  }, []);

  return geo;
};
