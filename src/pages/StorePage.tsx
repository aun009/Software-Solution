import React, { useState, useMemo, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchPanel } from '../components/SearchPanel';
import { ProductCard } from '../components/ProductCard';
import { products as staticProducts } from '../data/products';
import { supabase } from '../lib/supabase';
import { Category } from '../types';
import { useProductStore } from '../store/useProductStore';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, PackageSearch, TrendingUp, ArrowRight, ShieldCheck, Star, Headset, Zap } from 'lucide-react';
import gsap from 'gsap';

// ─── Scroll Restoration ──────────────────────────────────────────────────────
// We manage this ourselves because BrowserRouter has no built-in scroll
// restoration, and the browser's native attempt races with React + Framer Motion
// (cards animate in from opacity:0, page height is unstable) → lands at footer.
const SCROLL_KEY = 'store_scroll_y';

const saveScroll = () => {
  try { sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY))); } catch { /* quota */ }
};

const clearScroll = () => {
  try { sessionStorage.removeItem(SCROLL_KEY); } catch { /* quota */ }
};
// ─────────────────────────────────────────────────────────────────────────────

const TypewriterLabel = ({ text, delay }: { text: string, delay: number }) => {
  return (
    <div className="flex">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: delay + (i * 0.05),
            duration: 0.1
          }}
          className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-[0.3em]"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};

export const StorePage = () => {
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState(() => {
    try {
      return sessionStorage.getItem('store_search_term') || '';
    } catch {
      return '';
    }
  });
  
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>(() => {
    try {
      return (sessionStorage.getItem('store_selected_category') as Category) || 'All';
    } catch {
      return 'All';
    }
  });

  const [showAll, setShowAll] = useState(() => {
    try {
      return sessionStorage.getItem('store_show_all') === 'true';
    } catch {
      return false;
    }
  });
  
  const { products: allProducts, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    try {
      sessionStorage.setItem('store_search_term', searchTerm);
    } catch {}
  }, [searchTerm]);

  useEffect(() => {
    try {
      sessionStorage.setItem('store_selected_category', selectedCategory);
    } catch {}
  }, [selectedCategory]);

  useEffect(() => {
    try {
      sessionStorage.setItem('store_show_all', String(showAll));
    } catch {}
  }, [showAll]);

  // ── Scroll restoration: save position on every scroll (throttled with rAF) ──
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        saveScroll();
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Scroll restoration: restore saved position on mount ─────────────────────
  // useLayoutEffect fires synchronously after DOM paint, before browser can
  // attempt its own (broken) restoration. Double rAF ensures the page has had
  // at least one layout+paint cycle before we jump, avoiding the footer trap.
  const restoredRef = useRef(false);
  useLayoutEffect(() => {
    if (loading) return;
    if (restoredRef.current) return;

    const savedY = sessionStorage.getItem(SCROLL_KEY);
    if (!savedY) return;

    const target = parseInt(savedY, 10);
    if (!target || target <= 0) return;

    restoredRef.current = true;

    // Double rAF: first fires post-layout, second fires post-paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior });
      });
    });
  }, [loading]);

  // ── Populate search query from URL ──────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) setSearchTerm(searchParam);
  }, [location.search]);

  // ── RAF guard for GSAP tilt: prevents > 60 tweens/sec ──────────────────────
  const statsRafRef = useRef<number | null>(null);

  const handleStatsTilt = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (statsRafRef.current !== null) return;
    const card = e.currentTarget as HTMLDivElement;
    const clientX = e.clientX;
    const clientY = e.clientY;
    statsRafRef.current = requestAnimationFrame(() => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, duration: 0.5, ease: 'power2.out' });
      statsRafRef.current = null;
    });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, allProducts]);

  return (
    <div className="pb-24 font-sans bg-[#0b162c] bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.25)_0%,rgba(11,22,44,1)_80%)] text-white selection:bg-blue-500/30">
      {/* Light Theme Top Section */}
      <div className="pt-32 md:pt-48 pb-10 bg-gray-50 text-gray-900 relative z-20">
        {/* Search Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 relative z-20">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-50px" }}
             className="text-center mb-12 md:mb-16"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-[10px] font-black uppercase tracking-[0.3em] text-blue-700 mb-6 backdrop-blur-md">
              Explore
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 tracking-wide mb-6 leading-tight">
              Software <span className="text-blue-600">Store</span>
            </h1>
            <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto font-medium px-4">
              Find the perfect AI tools and software to help you work faster and smarter. Simple, fast, and constantly updated.
            </p>
          </motion.div>

        {/* Trust Badges Stats Bar */}
        <div className="flex justify-center mt-6 mb-12 md:mb-20 px-1 md:px-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-4 w-full max-w-5xl p-4 md:p-10 rounded-[28px] md:rounded-[40px] bg-white border border-slate-100/90 shadow-[0_20px_50px_rgba(15,23,42,0.04)] hover:shadow-[0_30px_70px_rgba(15,23,42,0.08)] hover:border-slate-200/80 transition-all duration-500 ease-in-out"
          >
            {[
              { 
                Icon: ShieldCheck, 
                line1: '100%', 
                line2: 'Verified', 
                color: '#2563eb',
                bgGradient: 'from-blue-500 to-blue-600',
                shadowColor: 'shadow-blue-500/15 group-hover:shadow-blue-500/30',
                textColor: 'text-blue-600',
                borderClass: 'border-r border-slate-100/80'
              },
              { 
                Icon: Star, 
                line1: 'Top Rated', 
                line2: 'Software', 
                color: '#4f46e5',
                bgGradient: 'from-indigo-500 to-indigo-600',
                shadowColor: 'shadow-indigo-500/15 group-hover:shadow-indigo-500/30',
                textColor: 'text-indigo-600',
                borderClass: 'border-r border-slate-100/80'
              },
              { 
                Icon: Headset, 
                line1: '24/7', 
                line2: 'Support', 
                color: '#6366f1',
                bgGradient: 'from-violet-500 to-violet-600',
                shadowColor: 'shadow-violet-500/15 group-hover:shadow-violet-500/30',
                textColor: 'text-violet-600',
                borderClass: 'border-r border-slate-100/80'
              },
              { 
                Icon: Zap, 
                line1: 'Instant', 
                line2: 'Delivery', 
                color: '#8b5cf6',
                bgGradient: 'from-purple-500 to-purple-600',
                shadowColor: 'shadow-purple-500/15 group-hover:shadow-purple-500/30',
                textColor: 'text-purple-600',
                borderClass: ''
              }
            ].map((stat, i) => {
              const Icon = stat.Icon;
              return (
                <div 
                  key={i} 
                  className={`flex flex-col items-center text-center py-2 px-1 md:py-4 md:px-4 group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${stat.borderClass}`}
                >
                  <div 
                    className={`grid place-items-center w-11 h-11 md:w-20 md:h-20 rounded-[14px] md:rounded-[24px] mb-2 md:mb-4 bg-gradient-to-tr ${stat.bgGradient} text-white shadow-md ${stat.shadowColor} transition-all duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-5 h-5 md:w-9 md:h-9" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col text-slate-800 font-black text-[9.5px] sm:text-[11.5px] md:text-[22px] leading-tight tracking-tight mt-0.5 md:mt-1">
                    <span className={`${stat.textColor} transition-colors duration-300`}>{stat.line1}</span>
                    <span className="text-slate-500 font-semibold text-[8px] sm:text-[9.5px] md:text-[13px] tracking-wider mt-0.5 uppercase">{stat.line2}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        <SearchPanel 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        </section>
        
      </div>

      {/* Seamless fade: sits on top of the white section's bottom edge */}
      <div className="h-20 bg-gradient-to-b from-gray-50/0 via-[#0b162c]/60 to-[#0b162c] -mt-20 relative z-10 pointer-events-none" />

      {/* Trending Section */}
      {!loading && searchTerm === '' && selectedCategory === 'All' && allProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24 pt-10 md:pt-16 relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Trending Softwares</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {(allProducts.some(p => p.is_trending) ? allProducts.filter(p => p.is_trending) : allProducts).slice(0, 3).map((product, idx) => (
              <ProductCard 
                key={`trending-${product.id}`} 
                product={product as any} 
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* Grid Section */}
      <section id="software-hub" className="max-w-7xl mx-auto px-4 md:px-6 pt-12 border-t border-white/5 relative scroll-mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-baseline justify-between mb-12 md:mb-16 gap-4"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-4">
            Software Hub
            {filteredProducts.length > 0 && (
              <span className="text-sm font-mono text-blue-400 bg-blue-400/10 px-4 py-1.5 rounded-full border border-blue-400/20">
                {filteredProducts.length}
              </span>
            )}
          </h2>
        </motion.div>

        {loading ? (
           <div className="py-48 flex flex-col items-center justify-center gap-4">
             <Loader2 className="animate-spin text-blue-500" size={40} />
             <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">Querying Global Matrix...</p>
           </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {/* Always-visible first 6 products */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-10">
              {filteredProducts.slice(0, 6).map((product, idx) => (
                <ProductCard 
                  key={product.id} 
                  product={product as any} 
                  index={idx}
                />
              ))}
            </div>

            {/* Extra products — smooth expand/collapse */}
            {filteredProducts.length > 6 && (
              <>
                <div
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-10 overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: showAll ? `${Math.ceil((filteredProducts.length - 6) / 3) * 700}px` : '0px',
                    opacity: showAll ? 1 : 0,
                    marginTop: showAll ? '32px' : '0px',
                  }}
                >
                  {filteredProducts.slice(6).map((product, idx) => (
                    <ProductCard 
                      key={product.id} 
                      product={product as any} 
                      index={idx + 6}
                    />
                  ))}
                </div>

                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => {
                      if (showAll) {
                        const el = document.getElementById('software-hub');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setTimeout(() => setShowAll(false), 350);
                      } else {
                        setShowAll(true);
                      }
                    }}
                    className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all shadow-sm flex items-center gap-2 group backdrop-blur-sm"
                  >
                    {showAll ? 'View Less' : 'View More'}
                    <ArrowRight size={14} className={`transition-transform duration-300 ${showAll ? 'rotate-[-90deg] group-hover:-translate-y-1' : 'group-hover:translate-x-1'}`} />
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="py-32 text-center border border-dashed border-white/10 rounded-[40px] flex flex-col items-center bg-white/5 backdrop-blur-sm">
            <PackageSearch size={48} className="text-gray-500 mb-6" />
            <p className="text-gray-400 text-lg uppercase tracking-[0.3em] font-black italic">
              NO MATCHES FOUND
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
