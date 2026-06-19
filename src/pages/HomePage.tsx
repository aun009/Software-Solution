import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StorePage } from './StorePage';
import { Reviews } from '../components/Reviews';
import { FloatingIconsHero } from '../components/FloatingIconsHero';

const LOGO_DEV_PUBLIC_KEY = import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY;

// Keep static data outside the component render cycle to prevent memory thrashing
const ROW1_PARTNERS = [
  { name: "ChatGPT", url: "openai.com" },
  { name: "Claude", url: "anthropic.com" },
  { name: "Midjourney", url: "midjourney.com" },
  { name: "Gemini", url: "google.com" },
  { name: "Notion AI", url: "notion.so" },
  { name: "Cohere", url: "cohere.com" },
  { name: "Hugging Face", url: "huggingface.co" },
  { name: "Meta AI", url: "meta.com" },
  { name: "Grok", url: "x.com" },
  { name: "Perplexity", url: "perplexity.ai" },
  { name: "Runway", url: "runwayml.com" },
  { name: "Pika", url: "pika.art" }
];

const ROW2_PARTNERS = [
  { name: "Monday", url: "monday.com" },
  { name: "ClickUp", url: "clickup.com" },
  { name: "Asana", url: "asana.com" },
  { name: "HubSpot", url: "hubspot.com" },
  { name: "Intercom", url: "intercom.com" },
  { name: "Zendesk", url: "zendesk.com" },
  { name: "Grammarly", url: "grammarly.com" },
  { name: "QuillBot", url: "quillbot.com" },
  { name: "GitHub", url: "github.com" },
  { name: "Vercel", url: "vercel.com" },
  { name: "Stripe", url: "stripe.com" },
  { name: "Canva", url: "canva.com" }
];

const ROW3_PARTNERS = [
  { name: "Figma", url: "figma.com" },
  { name: "Linear", url: "linear.app" },
  { name: "Slack", url: "slack.com" },
  { name: "Zoom", url: "zoom.us" },
  { name: "Supabase", url: "supabase.com" },
  { name: "Shopify", url: "shopify.com" },
  { name: "Salesforce", url: "salesforce.com" },
  { name: "Adobe", url: "adobe.com" },
  { name: "Discord", url: "discord.com" },
  { name: "Vimeo", url: "vimeo.com" },
  { name: "Typeform", url: "typeform.com" },
  { name: "Loom", url: "loom.com" }
];

gsap.registerPlugin(ScrollTrigger);

export const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLElement>(null);
  const [showChatBubble, setShowChatBubble] = useState(true);
  const [isMarqueeVisible, setIsMarqueeVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Auto-hide chat bubble after 8 seconds so it doesn't annoy users
    const timer = setTimeout(() => setShowChatBubble(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Performance Optimization: Check viewport size reactively for item reduction
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Performance Optimization: Pause marquee off-screen using lightweight Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMarqueeVisible(entry.isIntersecting);
      },
      { threshold: 0.02 } // Trigger as soon as 2% of the marquee is visible in the viewport
    );
    if (marqueeRef.current) {
      observer.observe(marqueeRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simple, smooth reveal for sections - optimized using will-change and transform
      const sections = document.querySelectorAll('.fade-up-section');
      sections.forEach(section => {
        gsap.from(section, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Keep full logo arrays on all viewports so there are no empty gaps in the infinite marquee loop
  const row1Items = ROW1_PARTNERS;
  const row2Items = ROW2_PARTNERS;
  const row3Items = ROW3_PARTNERS;

  return (
    <div ref={containerRef} className="w-full relative z-10 overflow-hidden selection:bg-blue-500/30">

      {/* Hero Section */}
      <FloatingIconsHero
        onExplore={() => {
          const el = document.getElementById('store');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {/* Partner Marquee Rows */}
      <section 
        ref={marqueeRef}
        className={`py-5 md:py-16 overflow-hidden border-y border-white/10 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 relative z-10 ${isMarqueeVisible ? '' : 'paused-marquee'}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_60%)]" />
        <div className="flex flex-col gap-2 md:gap-6 relative z-10 max-w-[100vw]">
          
          {/* Row 1: Moving Right */}
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee-right gap-2 md:gap-6 items-center pr-2 md:pr-6 hover:[animation-play-state:paused] w-max py-1.5 md:py-4 pointer-events-none" style={{ animationDuration: '60s', willChange: 'transform' }}>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-2 md:gap-6 items-center">
                  {row1Items.map((item, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 flex flex-col items-center gap-1 md:gap-[8px] bg-white/5 border border-white/10 rounded-xl md:rounded-[16px] px-3 md:px-5 py-2 md:py-4 min-w-[76px] md:min-w-[130px] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.10] hover:shadow-2xl hover:z-50 relative group hover:bg-white/10 pointer-events-auto"
                    >
                      <img
                        src={`https://img.logo.dev/${item.url}?token=${LOGO_DEV_PUBLIC_KEY}&size=128&format=png`}
                        alt={item.name}
                        loading="eager"
                        decoding="async"
                        className="w-9 h-9 md:w-14 md:h-14 object-contain rounded-lg md:rounded-[12px] bg-white p-1 md:p-1.5"
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=64&background=2ec4b6&color=fff&bold=true` }}
                      />
                      <span className="font-bold tracking-tight text-[9px] md:text-xs text-gray-300 truncate w-full text-center group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 2: Moving Left */}
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee-left gap-2 md:gap-6 items-center pr-2 md:pr-6 hover:[animation-play-state:paused] w-max py-1.5 md:py-4 pointer-events-none" style={{ animationDuration: '60s', willChange: 'transform' }}>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-2 md:gap-6 items-center">
                  {row2Items.map((item, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 flex flex-col items-center gap-1 md:gap-[8px] bg-white/5 border border-white/10 rounded-xl md:rounded-[16px] px-3 md:px-5 py-2 md:py-4 min-w-[76px] md:min-w-[130px] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.10] hover:shadow-2xl hover:z-50 relative group hover:bg-white/10 pointer-events-auto"
                    >
                      <img
                        src={`https://img.logo.dev/${item.url}?token=${LOGO_DEV_PUBLIC_KEY}&size=128&format=png`}
                        alt={item.name}
                        loading="eager"
                        decoding="async"
                        className="w-9 h-9 md:w-14 md:h-14 object-contain rounded-lg md:rounded-[12px] bg-white p-1 md:p-1.5"
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=64&background=2ec4b6&color=fff&bold=true` }}
                      />
                      <span className="font-bold tracking-tight text-[9px] md:text-xs text-gray-300 truncate w-full text-center group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Moving Right */}
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee-right gap-2 md:gap-6 items-center pr-2 md:pr-6 hover:[animation-play-state:paused] w-max py-1.5 md:py-4 pointer-events-none" style={{ animationDuration: '60s', willChange: 'transform' }}>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-2 md:gap-6 items-center">
                  {row3Items.map((item, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 flex flex-col items-center gap-1 md:gap-[8px] bg-white/5 border border-white/10 rounded-xl md:rounded-[16px] px-3 md:px-5 py-2 md:py-4 min-w-[76px] md:min-w-[130px] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.10] hover:shadow-2xl hover:z-50 relative group hover:bg-white/10 pointer-events-auto"
                    >
                      <img
                        src={`https://img.logo.dev/${item.url}?token=${LOGO_DEV_PUBLIC_KEY}&size=128&format=png`}
                        alt={item.name}
                        loading="eager"
                        decoding="async"
                        className="w-9 h-9 md:w-14 md:h-14 object-contain rounded-lg md:rounded-[12px] bg-white p-1 md:p-1.5"
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=64&background=2ec4b6&color=fff&bold=true` }}
                      />
                      <span className="font-bold tracking-tight text-[9px] md:text-xs text-gray-300 truncate w-full text-center group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Store Panel */}
      <div id="store" className="scroll-mt-24 relative z-20 w-full">
        <StorePage />
      </div>

      {/* Reviews Section */}
      <div className="fade-up-section" style={{ contentVisibility: 'auto', containIntrinsicSize: '500px' }}>
        <Reviews />
      </div>

      {/* Persistent WhatsApp Floating Widget */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[150] flex flex-col items-end gap-4 pointer-events-none">

        {/* Animated Help Bubble */}
        <AnimatePresence>
          {showChatBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="relative bg-white pl-5 pr-10 py-3 rounded-2xl shadow-xl shadow-black/10 border border-black/5 animate-bounce pointer-events-auto hidden xl:block"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
                </span>
                <span className="text-[10px] font-black text-gray-800 uppercase tracking-[0.15em]">Need Help? Let's Chat</span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowChatBubble(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X size={14} />
              </button>

              {/* Subtle triangle tail pointing to button */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-black/5 rotate-45 transform origin-center border-t-transparent border-l-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        <a
          href={`https://wa.me/919552530324?text=${encodeURIComponent("👋 Hi SP Tech Solutions! I'm interested in your products. Can you help me choose the right one?")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300 active:scale-95 group pointer-events-auto"
          title="Chat with Us on WhatsApp"
        >
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
          <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 -ml-0.5 mt-0.5 md:w-[30px] md:h-[30px]"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </a>
      </div>

      <style>{`
        @keyframes marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0%, 0, 0); }
        }
        @keyframes marquee-left {
          0% { transform: translate3d(0%, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-right {
          animation: marquee-right 30s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .animate-marquee-left {
          animation: marquee-left 30s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .paused-marquee .animate-marquee-right,
        .paused-marquee .animate-marquee-left {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
};
