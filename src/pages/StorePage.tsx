import React, { useState, useMemo, useEffect } from 'react';
import { SearchPanel } from '../components/SearchPanel';
import { ProductCard } from '../components/ProductCard';
import { products as staticProducts } from '../data/products';
import { supabase } from '../lib/supabase';
import { Category } from '../types';
import { useProductStore } from '../store/useProductStore';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, PackageSearch, TrendingUp, ArrowRight } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [showAll, setShowAll] = useState(false);
  
  const { products: allProducts, fetchProducts, loading } = useProductStore();

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
      <div className="pt-32 md:pt-48 pb-16 md:pb-24 bg-gray-50 text-gray-900 relative z-10 border-b border-gray-200 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08)_0%,rgba(249,250,251,1)_70%)]">
        {/* Search Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 relative z-20">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-50px" }}
             className="text-center mb-12 md:mb-16"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-[10px] font-black uppercase tracking-[0.3em] text-blue-700 mb-6 backdrop-blur-md">
              The Digital Exchange
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6 leading-tight">
              Software <span className="text-blue-600">Store</span>
            </h1>
            <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto font-medium px-4">
              Find the perfect AI tools and software to help you work faster and smarter. Simple, fast, and constantly updated.
            </p>
          </motion.div>

        {/* Redesigned Stats Bar */}
        <div className="hidden md:flex justify-center mb-16 md:mb-24 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap md:flex-nowrap items-center justify-center gap-8 md:gap-0 p-8 md:p-12 rounded-[48px] bg-white border border-gray-200 backdrop-blur-md relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)]"
            onMouseMove={(e) => {
              const card = e.currentTarget;
              const { left, top, width, height } = card.getBoundingClientRect();
              const x = (e.clientX - left) / width - 0.5;
              const y = (e.clientY - top) / height - 0.5;
              gsap.to(card, {
                rotateY: x * 10,
                rotateX: -y * 10,
                duration: 0.5,
                ease: "power2.out"
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power3.out" });
            }}
          >
            {[
              { label: 'VERIFIED TOOLS', value: '100', suffix: '%', delay: 0.2 },
              { label: 'AVERAGE RATING', value: '5.0', suffix: '★', delay: 0.4 },
              { label: 'SUPPORT', value: '24/7', suffix: '', delay: 0.6 },
              { label: 'ACTIVE SOFTWARES', value: `${allProducts.length}`, suffix: '+', delay: 0.8 }
            ].map((stat, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center px-12 md:px-16 min-w-[200px] text-center group">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: stat.delay, type: "spring", stiffness: 200 }}
                    className="text-5xl md:text-6xl font-black text-gray-900 mb-2 tracking-tighter group-hover:text-blue-600 transition-colors flex items-baseline gap-1"
                  >
                    {stat.value}
                    {stat.suffix && <span className="text-xl md:text-2xl text-blue-600">{stat.suffix}</span>}
                  </motion.div>
                  <TypewriterLabel text={stat.label} delay={stat.delay + 0.5} />
                </div>
                {i < 3 && <div className="hidden md:block w-px h-16 bg-gray-200" />}
              </React.Fragment>
            ))}
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
          <div className="flex items-center gap-6">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] bg-white/5 px-4 py-1.5 rounded-lg border border-white/10">
              Verified Deployments
            </p>
          </div>
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
                    maxHeight: showAll ? `${Math.ceil((filteredProducts.length - 6) / 3) * 600}px` : '0px',
                    opacity: showAll ? 1 : 0,
                    marginTop: showAll ? '12px' : '0px',
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
