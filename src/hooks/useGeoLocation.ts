import { useState, useEffect } from 'react';

interface GeoData {
  isIndia: boolean;
  countryCode: string;
  loading: boolean;
}

const GEO_CACHE_KEY = 'sp_geo';
const GEO_FALLBACK: GeoData = { isIndia: true, countryCode: 'IN', loading: false };
let geoRequest: Promise<GeoData> | null = null;

export const useGeoLocation = (): GeoData => {
  const [geo, setGeo] = useState<GeoData>({ isIndia: true, countryCode: '', loading: true });

  useEffect(() => {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setGeo({ ...parsed, loading: false });
        return;
      } catch { /* ignore */ }
    }

    if (!geoRequest) {
      geoRequest = fetch('/api/geo')
        .then(r => {
          if (!r.ok) throw new Error('Location lookup failed');
          if (!r.headers.get('content-type')?.includes('application/json')) {
            throw new Error('Location lookup returned a non-JSON response');
          }
          return r.json();
        })
        .then(data => {
          const countryCode = data.country_code || data.countryCode || 'IN';
          const result = {
            isIndia: countryCode === 'IN',
            countryCode,
            loading: false,
          };
          sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(result));
          return result;
        })
        .catch(() => {
          sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(GEO_FALLBACK));
          return GEO_FALLBACK;
        });
    }

    geoRequest.then(result => {
      setGeo({
        ...result,
        loading: false,
      });
    });
  }, []);

  return geo;
};
