import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { products as fallbackStatic } from '../data/products';

const PRODUCT_COLUMNS_WITH_ORDER = 'id, title, description, price, price_usd, image, category, subcategory, url, cta_link, features, benefits, videoUrl, is_trending, created_at, price_1m, price_3m, price_6m, price_1y, price_lifetime, price_1m_usd, price_3m_usd, price_6m_usd, price_1y_usd, price_lifetime_usd, sort_order';
const PRODUCT_COLUMNS = 'id, title, description, price, price_usd, image, category, subcategory, url, cta_link, features, benefits, videoUrl, is_trending, created_at, price_1m, price_3m, price_6m, price_1y, price_lifetime, price_1m_usd, price_3m_usd, price_6m_usd, price_1y_usd, price_lifetime_usd';
const PRODUCT_COLUMNS_LEGACY = 'id, title, description, price, price_usd, image, category, url, cta_link, features, benefits, videoUrl, is_trending, created_at, price_1m, price_3m, price_6m, price_1y, price_lifetime, price_1m_usd, price_3m_usd, price_6m_usd, price_1y_usd, price_lifetime_usd';

// How long (ms) before cached product data is considered stale and needs re-fetching.
// 5 minutes: fresh enough for browsing, stale enough to pick up admin changes.
const STALE_MS = 5 * 60 * 1000;

interface ProductState {
  products: any[];
  lastFetchedAt: number | null;   // epoch ms of the last successful fetch
  setProducts: (items: any[]) => void;
  fetchProducts: () => Promise<void>;
  loading: boolean;
}


export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: fallbackStatic, // Initialize with static dataset first, overwritten if cache exists
      lastFetchedAt: null,
      loading: false,
      setProducts: (items) => set({ products: items }),
      fetchProducts: async () => {
        const { products, lastFetchedAt, loading } = get();

        // ── Cache-hit guard ────────────────────────────────────────────────────
        // If we already have real products (more than the static fallback count)
        // AND the last fetch was recent enough, skip the network round-trip.
        // This is the key fix for "page reloads on back-navigation".
        const hasFreshData =
          lastFetchedAt !== null &&
          Date.now() - lastFetchedAt < STALE_MS &&
          products.length > 0;

        if (hasFreshData || loading) return;
        // ──────────────────────────────────────────────────────────────────────

        set({ loading: true });
        try {
          // Try fetching with sort_order first (works once column is added in Supabase)
          const { data, error } = await supabase
            .from('products')
            .select(PRODUCT_COLUMNS_WITH_ORDER)
            .order('sort_order', { ascending: true, nullsFirst: false })
            .order('created_at', { ascending: false });

          if (data && !error) {
            set({ products: data, lastFetchedAt: Date.now() });
          } else if (error) {
            // Fallback: sort_order column may not exist yet - fetch without it.
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('products')
              .select(PRODUCT_COLUMNS)
              .order('created_at', { ascending: false });
            if (fallbackData && !fallbackError) {
              set({ products: fallbackData, lastFetchedAt: Date.now() });
            } else {
              // Legacy fallback: subcategory column may not be deployed yet.
              const { data: legacyData, error: legacyError } = await supabase
                .from('products')
                .select(PRODUCT_COLUMNS_LEGACY)
                .order('created_at', { ascending: false });
              if (legacyError) throw legacyError;
              if (legacyData) set({ products: legacyData, lastFetchedAt: Date.now() });
            }
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
           set({ loading: false });
        }
      }
    }),
    {
      name: 'software-matrix-store', // key in localStorage — persists across hard reloads too
      // Only persist the product data and fetch timestamp, not the loading flag
      partialize: (state) => ({
        products: state.products,
        lastFetchedAt: state.lastFetchedAt,
      }),
    }
  )
);
