import React, { useState, useMemo, useEffect } from 'react';
import { SearchPanel } from '../components/SearchPanel';
import { ProductCard } from '../components/ProductCard';
import { products as staticProducts } from '../data/products';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, PackageSearch, TrendingUp } from 'lucide-react';
import gsap from 'gsap';

const TypewriterLabel = ({ text, delay }: { text: string, delay: number }) => {
  return (
    <div className="flex">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDbProducts(items);
      } catch (err) {
        console.error("Error fetching Firestore products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDbProducts();
  }, []);

  const allProducts = useMemo(() => {
    // Merge static and DB products
    const combined = [...staticProducts, ...dbProducts];
    // Remove duplicates by ID (if any)
    const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());
    return unique;
  }, [dbProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, allProducts]);

  return (
    <div className="pb-24 pt-32 md:pt-48 selection:bg-blue-500/30">
      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16 md:mb-24">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-12 md:mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 backdrop-blur-md">
            The Digital Exchange
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6 leading-tight">
            Software <span className="text-gray-500">Store</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-lg max-w-2xl mx-auto font-medium px-4">
            A curated ecosystem of industry-leading AI research tools and high-performance software architectures.
          </p>
        </motion.div>

        {/* Redesigned Stats Bar */}
        <div className="flex justify-center mb-16 md:mb-24 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap md:flex-nowrap items-center justify-center gap-8 md:gap-0 p-8 md:p-12 rounded-[48px] bg-white border border-gray-200 relative overflow-hidden shadow-xl dot-grid"
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
              { label: 'AI TOOLS', value: `${allProducts.length}`, suffix: '+', delay: 0.2 },
              { label: 'CATEGORIES', value: new Set(allProducts.map(p => p.category)).size, suffix: '', delay: 0.4 },
              { label: 'FREE', value: '100', suffix: '%', delay: 0.6 },
              { label: 'NEW TOOLS', value: 'Weekly', suffix: '', delay: 0.8 }
            ].map((stat, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center px-12 md:px-16 min-w-[200px] text-center group">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: stat.delay, type: "spring", stiffness: 200 }}
                    className="text-5xl md:text-6xl font-serif text-gray-900 italic mb-2 tracking-tighter group-hover:text-blue-600 transition-colors flex items-baseline gap-1"
                  >
                    {stat.value}
                    {stat.suffix && <span className="text-xl md:text-2xl text-blue-600 not-italic font-sans">{stat.suffix}</span>}
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

      {/* Trending Section */}
      {!loading && searchTerm === '' && selectedCategory === 'All' && allProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Trending Softwares</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.slice(0, 3).map((product, idx) => (
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
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 border-t border-gray-100 relative">
        <div className="absolute top-0 right-4 md:right-6 -translate-y-1/2 flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-100 rounded-full">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
           <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Live Sync Enabled</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-baseline justify-between mb-12 md:mb-16 gap-4"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            Software Hub
            {filteredProducts.length > 0 && (
              <span className="text-sm font-mono text-gray-700 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-100">
                {filteredProducts.length}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-6">
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] bg-gray-50 px-4 py-1.5 rounded-lg border border-gray-100">
              Verified Deployments
            </p>
          </div>
        </motion.div>

        {loading ? (
           <div className="py-48 flex flex-col items-center justify-center gap-4">
             <Loader2 className="animate-spin text-gray-900" size={40} />
             <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Querying Global Matrix...</p>
           </div>
        ) : filteredProducts.length > 0 ? (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <ProductCard 
                  key={product.id} 
                  product={product as any} 
                  index={idx}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-32 text-center border border-dashed border-white/10 rounded-[40px] flex flex-col items-center">
            <PackageSearch size={48} className="text-gray-800 mb-6" />
            <p className="text-gray-500 text-lg uppercase tracking-[0.3em] font-black italic">
              NO MATCHES FOUND
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
