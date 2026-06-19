import 'dotenv/config'; // Must be first — loads .env into process.env
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Supabase Admin Client (Server-Side ONLY) ────────────────────────────────
// SUPABASE_SERVICE_KEY has NO "VITE_" prefix — Vite never touches it.
// It lives only in process.env, never in the browser bundle.
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseServiceKey) {
  console.warn('⚠️  SUPABASE_SERVICE_KEY is not set. Admin API routes will be unavailable.');
}

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;
// ─────────────────────────────────────────────────────────────────────────────

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ── Health check ──────────────────────────────────────────────────────────
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/geo', async (req, res) => {
    try {
      // Resolve the real client IP — Vercel / nginx set X-Forwarded-For
      const forwarded = req.headers['x-forwarded-for'];
      const clientIp =
        (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]?.trim()) ||
        req.socket.remoteAddress ||
        '';

      const geoUrl = clientIp
        ? `https://ipapi.co/${encodeURIComponent(clientIp)}/json/`
        : 'https://ipapi.co/json/';

      const response = await fetch(geoUrl, {
        headers: { accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Geo lookup failed with ${response.status}`);
      const data = await response.json() as any;
      const countryCode: string = (data.country_code || 'IN').toUpperCase();
      res.json({
        isIndia: countryCode === 'IN',
        countryCode,
        loading: false,
      });
    } catch {
      // Fallback: assume India — safe default (never incorrectly shows USD to an Indian user)
      res.json({ isIndia: true, countryCode: 'IN', loading: false });
    }
  });

  // ── Secure Admin API routes ───────────────────────────────────────────────
  // All routes under /api/admin/* use supabaseAdmin (service role).
  // Add authentication middleware here before adding real routes.
  //
  // Example: app.delete('/api/admin/users/:id', verifyAdminToken, async (req, res) => { ... });
  //
  // The frontend should call these endpoints via fetch('/api/admin/...'),
  // NOT by calling Supabase directly with the service key.
  // ─────────────────────────────────────────────────────────────────────────

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`>>> NexusAI Showcase Server running on http://localhost:${PORT}`);
    console.log(`>>> Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`>>> Admin client: ${supabaseAdmin ? '✅ Initialized' : '❌ Not configured'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
