import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products as staticProducts } from '../data/products';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { CheckCircle2, Star, Play, ArrowLeft, Zap, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      // Check static first
      const staticMatch = staticProducts.find(p => p.id === id);
      if (staticMatch) {
        setProduct(staticMatch);
        setLoading(false);
      } else if (id) {
        // Check DB
        try {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProduct({ id: docSnap.id, ...docSnap.data() });
          }
        } catch (err) {
          console.error("Error fetching product:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-900 dark:text-white" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">Product not found</h1>
        <Link 
          to="/store" 
          className="px-6 py-3 bg-white text-black rounded-lg font-bold"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 pt-32 md:pt-48">
      <Link 
        to="/store" 
        className="inline-flex items-center gap-2 text-gray-500 dark:hover:text-white hover:text-gray-900 transition-colors mb-12 md:mb-16 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Back to Store</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Left Column: Product Info */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-6 mb-8 md:mb-12">
              <span className="px-5 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-full">
                <span className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">Value Matrix</span>
                <span className="text-sm font-black text-emerald-400 italic">${product.price || '999'}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-8xl font-black dark:text-white text-gray-900 mb-6 md:mb-10 tracking-tighter leading-tight md:leading-[0.9]">
              {product.title}
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-400 leading-relaxed mb-10 md:mb-16 font-medium">
              {product.description}
            </p>

            {/* Features & Benefits */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-20">
              <div className="p-6 md:p-8 bg-white/[0.02] dark:bg-white/5 light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200 rounded-3xl">
                <h3 className="text-xs font-black dark:text-white text-gray-900 uppercase tracking-[0.3em] mb-6 md:mb-8 flex items-center gap-3">
                  <Zap size={16} className="text-blue-500" />
                  Technical Suite
                </h3>
                <ul className="space-y-4 md:space-y-6">
                  {product.features?.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4">
                      <CheckCircle2 size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 md:p-8 bg-white/[0.02] dark:bg-white/5 light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200 rounded-3xl">
                <h3 className="text-xs font-black dark:text-white text-gray-900 uppercase tracking-[0.3em] mb-6 md:mb-8 flex items-center gap-3">
                  <ShieldCheck size={16} className="text-purple-500" />
                  Strategic Value
                </h3>
                <ul className="space-y-4 md:space-y-6">
                  {product.benefits?.map((benefit: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-purple-500/50 mt-2.5 flex-shrink-0" />
                      <span className="text-gray-400 font-medium leading-relaxed text-sm md:text-base">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <button className="px-10 md:px-12 py-4 md:py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-black text-base md:text-lg shadow-2xl shadow-blue-500/20 transition-all active:scale-95 group">
                {product.ctaText || 'Get Started'}
                <ArrowRight size={20} className="inline-block ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 md:px-12 py-4 md:py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-base md:text-lg transition-all active:scale-95 border border-transparent dark:border-transparent light:border-gray-200">
                Technical Docs
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Visuals */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="sticky top-32 md:top-48"
          >
            {/* Image/Demo Area */}
            <div className="group relative aspect-[4/5] bg-gradient-to-br from-[#111] to-[#050505] border border-white/10 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl flex items-center justify-center">
              {product.videoUrl && product.videoUrl.includes('youtube.com') ? (
                <iframe 
                  className="absolute inset-0 w-full h-full opacity-40 group-hover:opacity-100 transition-opacity"
                  src={`${product.videoUrl.replace('watch?v=', 'embed/')}?autoplay=0&mute=1&loop=1&controls=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img 
                  src={product.image} 
                  alt="Product Preview" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm group-hover:opacity-35 transition-opacity duration-1000"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors pointer-events-none" />
              
              <div className="relative z-10 text-center px-6 md:px-10 pointer-events-none">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform mb-6 md:mb-8 mx-auto">
                  <Play size={28} fill="currentColor" className="ml-1.5" />
                </div>
                <div className="space-y-3">
                  <span className="block text-white font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
                    Showcase Reel
                  </span>
                  <p className="text-gray-500 text-[10px] font-medium leading-relaxed max-w-[200px] mx-auto uppercase tracking-widest">
                    Operational verification and architectural analysis.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
