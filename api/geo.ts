// Vercel Serverless Function: /api/geo
// Detects the visitor's country from their real IP.
// Returns: { isIndia: boolean, countryCode: string, loading: false }
//
// Vercel injects x-vercel-forwarded-for with the real client IP.
// This file lives in /api/ — Vercel auto-discovers it as a serverless function.

import type { IncomingMessage, ServerResponse } from 'http';

const sendJson = (res: ServerResponse, status: number, body: object) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    // Cache at Vercel's edge for 1 hour — saves ipapi.co quota
    'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
  });
  res.end(payload);
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
    res.end();
    return;
  }

  try {
    const headers = req.headers as Record<string, string | string[] | undefined>;

    // Vercel sets x-vercel-forwarded-for with the real client IP (most reliable).
    // x-forwarded-for is the fallback for other reverse proxies / local Express usage.
    const pick = (h: string | string[] | undefined): string =>
      (Array.isArray(h) ? h[0] : h?.split(',')[0]?.trim()) ?? '';

    const clientIp =
      pick(headers['x-vercel-forwarded-for']) ||
      pick(headers['x-forwarded-for']) ||
      '';

    const geoUrl = clientIp
      ? `https://ipapi.co/${encodeURIComponent(clientIp)}/json/`
      : 'https://ipapi.co/json/';

    const geoRes = await fetch(geoUrl, { headers: { accept: 'application/json' } });
    if (!geoRes.ok) throw new Error(`ipapi.co ${geoRes.status}`);

    const data = (await geoRes.json()) as Record<string, string>;
    const countryCode = (data.country_code || 'IN').toUpperCase();

    sendJson(res, 200, {
      isIndia: countryCode === 'IN',
      countryCode,
      loading: false,
    });
  } catch {
    // Safe fallback: default to India so Indian users never see wrong (USD) prices.
    sendJson(res, 200, { isIndia: true, countryCode: 'IN', loading: false });
  }
}
