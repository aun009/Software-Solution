import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [showAll, setShowAll] = useState(false);
  
  const { products: allProducts, fetchProducts, loading } = useProductStore();

  // Populate search query on URL match
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  // RAF guard: prevents getBoundingClientRect + GSAP tween being created > 60x/sec
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
      <div className="pt-32 md:pt-48 pb-16 md:pb-24 bg-gray-50 text-gray-900 relative z-20 border-b border-gray-200 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08)_0%,rgba(249,250,251,1)_70%)]">
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
            className="grid grid-cols-4 w-full max-w-4xl p-3 md:p-8 rounded-[24px] md:rounded-[32px] bg-white border border-gray-100/80 shadow-[0_15px_45px_rgba(15,23,42,0.03)]"
          >
            {[
              { 
                Icon: ShieldCheck, 
                line1: '100%', 
                line2: 'Verified', 
                color: '#2563eb',
                borderClass: 'border-r border-slate-100/80'
              },
              { 
                Icon: Star, 
                line1: 'Top Rated', 
                line2: 'Software', 
                color: '#4f46e5',
                borderClass: 'border-r border-slate-100/80'
              },
              { 
                Icon: Headset, 
                line1: '24/7', 
                line2: 'Support', 
                color: '#6366f1',
                borderClass: 'border-r border-slate-100/80'
              },
              { 
                Icon: Zap, 
                line1: 'Instant', 
                line2: 'Delivery', 
                color: '#8b5cf6',
                borderClass: ''
              }
            ].map((stat, i) => {
              const Icon = stat.Icon;
              return (
                <div key={i} className={`flex flex-col items-center text-center py-1 px-1 md:py-2 md:px-3 ${stat.borderClass}`}>
                  <div className="grid place-items-center w-9 h-9 md:w-14 md:h-14 rounded-full mb-1.5 md:mb-3 bg-gradient-to-tr from-blue-50/20 to-indigo-50/20 border border-slate-100/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)]" style={{ color: stat.color }}>
                    <Icon className="w-4 h-4 md:w-6 md:h-6" strokeWidth={1.8} />
                  </div>
                  <div className="flex flex-col text-slate-800 font-bold text-[8.5px] sm:text-[10px] md:text-[15px] leading-tight tracking-tight">
                    <span>{stat.line1}</span>
                    <span>{stat.line2}</span>
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
        
        {/* Blur Transition to Dark Bottom Section */}
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[120%] max-w-[1500px] h-[200px] bg-[#1e40af] mix-blend-screen blur-[120px] opacity-60 pointer-events-none z-0" />
      </div>

      {/* Trending Section */}
      {!loading && searchTerm === '' && selectedCategory === 'All' && allProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-24 pt-16 relative z-10">
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
