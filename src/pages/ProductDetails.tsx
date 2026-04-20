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
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6 bg-[#F8FAFC]">
        <h1 className="text-4xl font-bold text-gray-900">Product not found</h1>
        <Link 
          to="/#store" 
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

  const VisualAssets = () => (
    <div className="group relative aspect-video md:aspect-[4/5] bg-gray-50 border border-gray-200 rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl flex items-center justify-center bg-black">
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
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform mb-4 md:mb-8 mx-auto">
            <Play size={24} fill="currentColor" className="ml-1.5" />
          </div>
          <div className="space-y-2 md:space-y-3">
            <span className="block text-gray-900 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
              Product Insight
            </span>
            <p className="text-gray-500 text-[9px] md:text-[10px] font-medium leading-relaxed max-w-[200px] mx-auto uppercase tracking-widest hidden md:block">
              Visual representation of architectural efficiency.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const getLogoUrl = (url: string, fallbackName: string) => {
    if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=random&bold=true&size=128&font-size=0.45&format=svg&uppercase=true`;
    if (url.includes('/') || url.startsWith('http')) return url;
    return `https://img.logo.dev/${url}?token=${import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY}&size=128&format=png`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 pt-32 md:pt-48">
      <Link 
        to="/#store" 
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
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-6 md:mb-10">
              <img 
                 src={getLogoUrl(product.url, product.title)}
                 alt={`${product.title} Icon`}
                 className="w-16 h-16 md:w-24 md:h-24 rounded-[20px] md:rounded-[32px] object-contain shadow-lg border border-gray-100 shrink-0 bg-white"
                 onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.title)}&background=random&bold=true&size=128&font-size=0.45&format=svg&uppercase=true` }}
              />
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-5xl font-['Plus_Jakarta_Sans'] font-extrabold text-gray-900 tracking-tight leading-tight">
                  {product.title}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-600 tracking-[0.2em] uppercase">Price</span>
                  <span className="text-lg font-black text-emerald-600">₹{Number(product.price || 999).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            
            <div className="block lg:hidden mb-10 w-full shadow-2xl rounded-[24px]">
               <VisualAssets />
            </div>

            <p className="text-lg md:text-2xl text-gray-500 leading-relaxed mb-10 md:mb-16 font-medium">
              {product.description}
            </p>

            {/* Features & Benefits */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-20 p-6 md:p-10 bg-white rounded-[32px] md:rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.04)_0%,transparent_70%)]" />

              <div className="p-6 md:p-8 bg-gray-50/50 border border-gray-100 rounded-3xl shadow-sm relative z-10">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em] mb-6 md:mb-8 flex items-center gap-3">
                  <Zap size={16} className="text-blue-600" />
                  Features
                </h3>
                <ul className="space-y-4 md:space-y-6">
                  {product.features?.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4">
                      <CheckCircle2 size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 font-medium leading-relaxed text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 md:p-8 bg-gray-50/50 border border-gray-100 rounded-3xl shadow-sm relative z-10">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em] mb-6 md:mb-8 flex items-center gap-3">
                  <ShieldCheck size={16} className="text-purple-600" />
                  Benefits
                </h3>
                <ul className="space-y-4 md:space-y-6">
                  {product.benefits?.map((benefit: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2.5 flex-shrink-0" />
                      <span className="text-gray-600 font-medium leading-relaxed text-sm md:text-base">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <button 
                onClick={() => window.open(`https://wa.me/919552530324?text=${encodeURIComponent(`Hello, I would like to inquire about the ${product.title} software solution. Could you please provide more details regarding its features?`)}`, '_blank')} 
                className="group overflow-hidden relative px-8 md:px-12 py-4 md:py-5 bg-[#25D366] text-white rounded-2xl font-black text-base md:text-lg shadow-xl shadow-[#25D366]/30 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#25D366]/50 active:scale-95 flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 transition-transform duration-500 group-hover:rotate-[20deg] group-hover:scale-125 relative z-10"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <span className="relative z-10 block transition-transform group-hover:translate-x-1">Contact via WhatsApp</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Visuals (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="sticky top-32 md:top-48"
          >
            <VisualAssets />
          </motion.div>
        </div>
      </div>
    </div>
  </div>
  );
};
