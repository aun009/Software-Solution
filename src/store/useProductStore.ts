import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { products as fallbackStatic } from '../data/products';

interface ProductState {
  products: any[];
  setProducts: (items: any[]) => void;
  fetchProducts: () => Promise<void>;
  loading: boolean;
}


export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: fallbackStatic, // Initialize with static dataset first, overwritten if cache exists
      loading: false,
      setProducts: (items) => set({ products: items }),
      fetchProducts: async () => {
        set({ loading: true });
        try {
          const { data, error } = await supabase
            .from('products')
            .select('id, title, description, price, price_usd, image, category, url, features, benefits, videoUrl, is_trending, created_at, price_1m, price_3m, price_6m, price_1y, price_lifetime, price_1m_usd, price_3m_usd, price_6m_usd, price_1y_usd, price_lifetime_usd')
            .order('created_at', { ascending: false });
            
          if (data && !error) {
            set({ products: data });
          }
        } catch (error) {
          console.error("Error fetching heavily cached matrix:", error);
        } finally {
           set({ loading: false });
        }
      }
    }),
    {
      name: 'software-matrix-store', // key in local storage ensures instant retrievals across reloads
    }
  )
);
