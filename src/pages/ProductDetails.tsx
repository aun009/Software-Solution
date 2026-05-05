import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { CheckCircle2, Play, ArrowLeft, Zap, ShieldCheck, Loader2, Clock, Infinity, Check } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

const VALIDITY_PLANS = [
  { key: 'price_1m',        label: '1 Month',   short: '1M',   icon: Clock,    color: 'blue'   },
  { key: 'price_3m',        label: '3 Months',  short: '3M',   icon: Clock,    color: 'indigo' },
  { key: 'price_6m',        label: '6 Months',  short: '6M',   icon: Clock,    color: 'violet' },
  { key: 'price_1y',        label: '1 Year',    short: '1Y',   icon: Clock,    color: 'purple' },
  { key: 'price_lifetime',  label: 'Lifetime',  short: '∞',    icon: Infinity, color: 'emerald'},
] as const;

type PlanKey = typeof VALIDITY_PLANS[number]['key'];

const colorMap: Record<string, { pill: string; active: string; badge: string }> = {
  blue:   { pill: 'border-blue-200 hover:border-blue-400',   active: 'bg-blue-600 border-blue-600 text-white shadow-blue-400/30',   badge: 'bg-blue-100 text-blue-700'   },
  indigo: { pill: 'border-indigo-200 hover:border-indigo-400', active: 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-400/30', badge: 'bg-indigo-100 text-indigo-700' },
  violet: { pill: 'border-violet-200 hover:border-violet-400', active: 'bg-violet-600 border-violet-600 text-white shadow-violet-400/30', badge: 'bg-violet-100 text-violet-700' },
  purple: { pill: 'border-purple-200 hover:border-purple-400', active: 'bg-purple-600 border-purple-600 text-white shadow-purple-400/30', badge: 'bg-purple-100 text-purple-700' },
  emerald:{ pill: 'border-emerald-200 hover:border-emerald-400', active: 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-400/30', badge: 'bg-emerald-100 text-emerald-700' },
};

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('price_1m');
  const { products } = useProductStore();

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  useEffect(() => {
    const cached = products.find(p => p.id === id);
    if (cached) { setProduct(cached); setLoading(false); return; }
    if (id) {
      (async () => {
        const { data } = await supabase.from('products').select('*').eq('id', id).single();
        if (data) setProduct(data);
        setLoading(false);
      })();
    }
  }, [id, products]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-blue-600" size={36} />
    </div>
  );

  if (!product) return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6 bg-[#F8FAFC]">
      <h1 className="text-4xl font-bold text-gray-900">Product not found</h1>
      <Link to="/#store" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Return to Store</Link>
    </div>
  );

  const getYouTubeEmbedUrl = (url: string) => {
    let id = '';
    if (url.includes('youtube.com/watch?v=')) id = url.split('v=')[1].split('&')[0];
    else if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1].split('?')[0];
    else if (url.includes('youtube.com/shorts/')) id = url.split('shorts/')[1].split('?')[0];
    return id ? `https://www.youtube.com/embed/${id}?autoplay=0&controls=1` : url;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const m = url.match(/vimeo\.com(?:\/video)?\/([0-9]+)/);
    return m?.[1] ? `https://player.vimeo.com/video/${m[1]}?autoplay=0&color=2563eb&title=0&byline=0` : url;
  };

  const isYouTube = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo   = (url: string) => url.includes('vimeo.com');

  const getLogoUrl = (url: string, name: string) => {
    if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&bold=true&size=128&format=svg&uppercase=true`;
    if (url.includes('/') || url.startsWith('http')) return url;
    return `https://img.logo.dev/${url}?token=${import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY}&size=128&format=png`;
  };

  // Get price for the selected plan, fallback to base price
  const getPlanPrice = (planKey: PlanKey): number | null => {
    const val = product[planKey];
    if (val !== undefined && val !== null && val !== '') return Number(val);
    return null;
  };

  // Check if any validity plan prices are configured
  const hasValidityPricing = VALIDITY_PLANS.some(p => getPlanPrice(p.key) !== null);

  const selectedPlanData = VALIDITY_PLANS.find(p => p.key === selectedPlan)!;
  const selectedPrice = getPlanPrice(selectedPlan) ?? Number(product.price || 999);

  /* ── Video / image player ── */
  const VideoPlayer = () => (
    <div className="relative w-full aspect-video rounded-2xl md:rounded-[20px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.14)] bg-black">
      {product.videoUrl && isYouTube(product.videoUrl) ? (
        <iframe
          className="absolute inset-0 w-full h-full border-0"
          src={getYouTubeEmbedUrl(product.videoUrl)}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : product.videoUrl && isVimeo(product.videoUrl) ? (
        <iframe
          className="absolute inset-0 w-full h-full border-0"
          src={getVimeoEmbedUrl(product.videoUrl)}
          title="Vimeo video player"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={product.image}
            alt="Product Preview"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Play size={20} fill="#2563eb" className="text-blue-600 ml-1" />
            </div>
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-[0.25em]">Product Preview</span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-28 md:pt-40 pb-20 md:pb-28">

        {/* Back link */}
        <Link
          to="/#store"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-colors mb-10 md:mb-14 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Back to Store</span>
        </Link>

        {/* ── HERO: 50/50 grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 lg:items-start mb-14 md:mb-20">

          {/* LEFT – product info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon + title */}
            <div className="flex items-start gap-4 md:gap-5 mb-5 md:mb-7">
              <img
                src={getLogoUrl(product.url, product.title)}
                alt={`${product.title} icon`}
                className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-2xl object-contain shadow-md border border-gray-100 bg-white shrink-0"
                onError={e => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.title)}&background=random&bold=true&size=128&format=svg`;
                }}
              />
              <div>
                <h1 className="text-3xl md:text-[40px] font-['Poppins'] font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
                  {product.title}
                </h1>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {product.category && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] text-blue-700">
                      <Zap size={11} className="text-blue-500" />
                      {product.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile video */}
            <div className="block lg:hidden mb-7">
              <VideoPlayer />
            </div>

            {/* Description */}
            <p className="text-[15px] md:text-base text-gray-600 leading-[1.75] mb-8 md:mb-10 max-w-prose">
              {product.description}
            </p>

            {/* ── VALIDITY PLAN SELECTOR ── */}
            {hasValidityPricing ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8 md:mb-10"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.18em]">Choose Your Plan</span>
                  <span className="text-[11px] font-semibold text-gray-400">Select validity period</span>
                </div>

                {/* Horizontal scroll on mobile, flex-wrap on desktop */}
                <div className="overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                  <div className="flex gap-2.5 w-max md:w-auto md:flex-wrap">
                    {VALIDITY_PLANS.map((plan) => {
                      const price = getPlanPrice(plan.key);
                      if (price === null) return null; // skip unconfigured plans
                      const isActive = selectedPlan === plan.key;
                      const colors = colorMap[plan.color];
                      const Icon = plan.icon;
                      return (
                        <button
                          key={plan.key}
                          onClick={() => setSelectedPlan(plan.key)}
                          className={`relative flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-2xl border-2 font-bold transition-all duration-200 min-w-[80px] shrink-0 select-none
                            ${isActive
                              ? `${colors.active} shadow-lg scale-[1.04]`
                              : `bg-white ${colors.pill} text-gray-700 hover:scale-[1.02]`
                            }`}
                        >
                          {isActive && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow border border-gray-100">
                              <Check size={11} className={`text-${plan.color}-600`} strokeWidth={3} />
                            </span>
                          )}
                          <Icon size={14} className={isActive ? 'opacity-90' : 'text-gray-400'} />
                          <span className="text-[13px] font-black leading-none">{plan.label}</span>
                          <span className={`text-[11px] font-extrabold leading-none ${isActive ? 'opacity-90' : 'text-emerald-600'}`}>
                            ₹{Number(price).toLocaleString('en-IN')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected plan summary */}
                <div className="mt-4 flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${colorMap[selectedPlanData.color].badge}`}>
                    <selectedPlanData.icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-gray-500">Selected: <span className="text-gray-800">{selectedPlanData.label} Access</span></p>
                    <p className="text-[11px] text-gray-400 mt-0.5">One-time payment · Instant delivery via WhatsApp</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[18px] font-black text-gray-900 leading-none">₹{selectedPrice.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">incl. all taxes</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Fallback: simple price display when no validity plans configured */
              <div className="mb-8 flex items-center gap-2.5">
                <span className="text-[11px] font-black text-emerald-600 tracking-[0.15em] uppercase">Price</span>
                <span className="text-base font-black text-emerald-600">
                  ₹{Number(product.price || 999).toLocaleString('en-IN')}
                </span>
              </div>
            )}

          </motion.div>

          {/* RIGHT – desktop video (sticky) */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="sticky top-32">
              <VideoPlayer />
            </div>
          </motion.div>
        </div>

        {/* ── FEATURES & BENEFITS – full-width below hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7"
        >
          {/* Features */}
          <div className="bg-white border border-gray-100 rounded-[24px] p-7 md:p-9 shadow-[0_8px_40px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Zap size={15} className="text-blue-600" />
              </div>
              <h3 className="text-[15px] font-black uppercase tracking-[0.18em] text-gray-800">Features</h3>
            </div>
            <ul className="space-y-3.5">
              {product.features?.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-[15.5px] text-gray-700 font-semibold leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-white border border-gray-100 rounded-[24px] p-7 md:p-9 shadow-[0_8px_40px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                <ShieldCheck size={15} className="text-purple-600" />
              </div>
              <h3 className="text-[15px] font-black uppercase tracking-[0.18em] text-gray-800">Benefits</h3>
            </div>
            <ul className="space-y-3.5">
              {product.benefits?.map((b: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  </div>
                  <span className="text-[15.5px] text-gray-700 font-semibold leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* ── CTA – below features & benefits ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 md:mt-10 flex justify-center md:justify-start"
        >
          <button
            onClick={() =>
              window.open(
                `https://wa.me/919552530324?text=${encodeURIComponent(
                  hasValidityPricing
                    ? `Hello, I would like to buy the "${product.title}" Software/Tool — ${selectedPlanData.label} plan (₹${selectedPrice.toLocaleString('en-IN')}). Could you please provide details?`
                    : `Hello, I would like to buy the "${product.title}" Software/Tool. Could you provide details?`
                )}`,
                '_blank'
              )
            }
            className="group relative overflow-hidden inline-flex items-center gap-3 px-10 py-4 bg-[#25D366] text-white rounded-2xl font-black text-base shadow-xl shadow-[#25D366]/25 hover:shadow-2xl hover:shadow-[#25D366]/40 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[150%] transition-transform duration-700" />
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 relative z-10 group-hover:rotate-12 transition-transform duration-300">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span className="relative z-10">
              {hasValidityPricing
                ? `Get ${selectedPlanData.label} Access — ₹${selectedPrice.toLocaleString('en-IN')}`
                : 'Get Access'}
            </span>
          </button>
        </motion.div>

      </div>
    </div>
  );
};
