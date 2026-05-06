import { useState, useEffect } from 'react';

interface GeoData {
  isIndia: boolean;
  countryCode: string;
  loading: boolean;
}

export const useGeoLocation = (): GeoData => {
  const [geo, setGeo] = useState<GeoData>({ isIndia: true, countryCode: '', loading: true });

  useEffect(() => {
    const cached = sessionStorage.getItem('sp_geo');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setGeo({ ...parsed, loading: false });
        return;
      } catch { /* ignore */ }
    }

    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const result = {
          isIndia: data.country_code === 'IN',
          countryCode: data.country_code || 'IN',
          loading: false,
        };
        sessionStorage.setItem('sp_geo', JSON.stringify(result));
        setGeo(result);
      })
      .catch(() => {
        setGeo({ isIndia: true, countryCode: 'IN', loading: false });
      });
  }, []);

  return geo;
};
