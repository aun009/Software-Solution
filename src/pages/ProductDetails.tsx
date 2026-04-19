import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products as staticProducts } from '../data/products';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { CheckCircle2, Star, Play, ArrowLeft, Zap, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    // Find instantly out of memory
    const cachedItem = products.find(p => p.id === id);
    if (cachedItem) {
      setProduct(cachedItem);
      setLoading(false);
    }
    
    // Fallback manual refresh if it's deeply linked and completely cacheless
    if (!cachedItem && id) {
      const fetchDeep = async () => {
        try {
          const { data } = await supabase.from('products').select('*').eq('id', id).single();
          if (data) setProduct(data);
        } finally {
          setLoading(false);
        }
      };
      fetchDeep();
    }
  }, [id, products]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-gray-900" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6 bg-[#F8FAFC]">
        <h1 className="text-4xl font-bold text-gray-900">Product not found</h1>
        <Link 
          to="/store" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) videoId = url.split('v=')[1].split('&')[0];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
    else if (url.includes('youtube.com/shorts/')) videoId = url.split('shorts/')[1].split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&loop=1&controls=1` : url;
  };

  const getLogoUrl = (url: string, fallbackName: string) => {
    if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=random&bold=true&size=128&font-size=0.45&format=svg&uppercase=true`;
    if (url.includes('/') || url.startsWith('http')) return url;
    return `https://img.logo.dev/${url}?token=${import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY}&size=128&format=png`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 pt-32 md:pt-48">
      <Link 
        to="/store" 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-12 md:mb-16 group"
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
              <span className="px-5 py-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-2 px-5 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                <span className="text-[10px] font-black text-emerald-600 tracking-[0.2em] uppercase">Value Matrix</span>
                <span className="text-sm font-black text-emerald-600 italic">₹{product.price || '999'}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-6 md:mb-10">
              <img 
                 src={getLogoUrl(product.url, product.title)}
                 alt={`${product.title} Icon`}
                 className="w-16 h-16 md:w-24 md:h-24 rounded-[20px] md:rounded-[32px] object-contain shadow-lg border border-gray-100 shrink-0 bg-white"
                 onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.title)}&background=random&bold=true&size=128&font-size=0.45&format=svg&uppercase=true` }}
              />
              <h1 className="text-4xl md:text-8xl font-black text-gray-900 tracking-tighter leading-tight md:leading-[0.9]">
                {product.title}
              </h1>
            </div>
            
            <p className="text-lg md:text-2xl text-gray-500 leading-relaxed mb-10 md:mb-16 font-medium">
              {product.description}
            </p>

            {/* Features & Benefits */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-20">
              <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em] mb-6 md:mb-8 flex items-center gap-3">
                  <Zap size={16} className="text-blue-600" />
                  Technical Suite
                </h3>
                <ul className="space-y-4 md:space-y-6">
                  {product.features?.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4">
                      <CheckCircle2 size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 font-medium leading-relaxed text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em] mb-6 md:mb-8 flex items-center gap-3">
                  <ShieldCheck size={16} className="text-purple-600" />
                  Strategic Value
                </h3>
                <ul className="space-y-4 md:space-y-6">
                  {product.benefits?.map((benefit: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-purple-600/50 mt-2.5 flex-shrink-0" />
                      <span className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <button 
                onClick={() => window.open(`https://wa.me/919552530324?text=${encodeURIComponent(`Hello, I would like to inquire about the ${product.title} software solution. Could you please provide more details regarding its features?`)}`, '_blank')} 
                className="px-8 md:px-12 py-4 md:py-5 bg-[#25D366] text-white rounded-2xl font-black text-base md:text-lg shadow-xl shadow-[#25D366]/20 transition-all active:scale-95 flex items-center justify-center gap-3 hover:bg-[#20BE5C]"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Contact via WhatsApp
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
            <div className="group relative aspect-[4/5] bg-gray-50 border border-gray-200 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl flex items-center justify-center bg-black">
              {product.videoUrl && (product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be')) ? (
                <iframe 
                  className="absolute inset-0 w-full h-full flex-1 border-0"
                  src={getYouTubeEmbedUrl(product.videoUrl)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img 
                    src={product.image} 
                    alt="Product Preview" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors pointer-events-none" />
                </>
              )}
              
              {!product.videoUrl && (
                <div className="relative z-10 text-center px-6 md:px-10 pointer-events-none">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform mb-6 md:mb-8 mx-auto">
                    <Play size={28} fill="currentColor" className="ml-1.5" />
                  </div>
                  <div className="space-y-3">
                    <span className="block text-gray-900 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
                      Product Insight
                    </span>
                    <p className="text-gray-500 text-[10px] font-medium leading-relaxed max-w-[200px] mx-auto uppercase tracking-widest">
                      Visual representation of architectural efficiency.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
