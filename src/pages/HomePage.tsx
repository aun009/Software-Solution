import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StorePage } from './StorePage';
import { Reviews } from '../components/Reviews';

const LOGO_DEV_PUBLIC_KEY = import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY;

gsap.registerPlugin(ScrollTrigger);

export const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [showChatBubble, setShowChatBubble] = useState(true);

  useEffect(() => {
    // Auto-hide chat bubble after 8 seconds so it doesn't annoy users
    const timer = setTimeout(() => setShowChatBubble(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from('.hero-text', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // Simple, smooth reveal for sections
      const sections = document.querySelectorAll('.fade-up-section');
      sections.forEach(section => {
        gsap.from(section, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative z-10 overflow-hidden selection:bg-blue-500/30">


      {/* Hero Section */}
      <section
        id="home"
        ref={heroRef}
        className="relative min-h-[calc(100svh-4rem)] md:min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden bg-[#FAFAFC]"
      >
        {/* Hero gradient mesh — pure CSS transforms, same look as before, zero JS, 100% GPU composited */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-blob-blue" />
          <div className="hero-blob-purple" />
          <div className="hero-blob-pink" />
          <div className="hero-aura" />
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col items-center text-center pt-8">

          <h1 className="hero-text flex flex-col items-center tracking-[-0.02em] text-[#0f172a] mb-8 md:mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-[40px] sm:text-5xl md:text-[75px] lg:text-[85px] font-bold leading-[1.2] md:leading-[1.2] text-[#0f172a]">
              Smart AI and
            </span>
            <span className="text-[40px] sm:text-5xl md:text-[75px] lg:text-[85px] font-semibold leading-[1.2] md:leading-[1.2] bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent pb-2">
              Software Solutions
            </span>
            
            <div className="flex flex-col items-center mt-0 md:mt-1 gap-4 w-full">
              <div className="flex items-center justify-center gap-6 md:gap-10 w-full px-4">
                <div className="h-[2px] md:h-[3px] w-16 sm:w-24 md:w-40 bg-[#0f172a]/40 rounded-full"></div>
                <span className="text-[35px] sm:text-5xl md:text-[65px] lg:text-[75px] text-[#0f172a] font-bold tracking-wide whitespace-nowrap leading-[1.1] pb-1">
                  for Your Business
                </span>
                <div className="h-[2px] md:h-[3px] w-16 sm:w-24 md:w-40 bg-[#0f172a]/40 rounded-full"></div>
              </div>
              
              <div className="flex items-center justify-center gap-4 w-full max-w-[200px] sm:max-w-[300px] md:max-w-[450px] mt-2">
                <div className="h-[2px] md:h-[3px] flex-1 bg-[#0f172a]/30 rounded-full"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 md:border-b-[3px] md:border-r-[3px] border-[#0f172a]/30 rotate-45 -translate-y-1"></div>
                <div className="h-[2px] md:h-[3px] flex-1 bg-[#0f172a]/30 rounded-full"></div>
              </div>
            </div>
          </h1>

          <p className="hero-text text-lg md:text-2xl text-gray-600 max-w-3xl mb-12 md:mb-16 leading-relaxed font-['Poppins'] font-normal tracking-wide">
            Delivering trusted AI tools and smart software solutions to help you build, innovate, and grow faster.
          </p>

          <div className="hero-text flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <button
              onClick={() => {
                const el = document.getElementById('store');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="group overflow-hidden relative px-8 py-4 md:px-10 md:py-5 bg-blue-600 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] cursor-pointer"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10 block transition-transform duration-300 group-hover:-translate-x-1">Explore Softwares</span>
              <ArrowRight size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
            </button>
          </div>
        </div>
      </section>

      {/* Partner Marquee Rows */}
      <section className="py-5 md:py-16 overflow-hidden border-y border-white/10 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_60%)]" />
        <div className="flex flex-col gap-2 md:gap-6 relative z-10 max-w-[100vw]">
          {/* Row 1: Moving Right */}
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee-right gap-2 md:gap-6 items-center pr-2 md:pr-6 hover:[animation-play-state:paused] w-max py-1.5 md:py-4 pointer-events-none" style={{ animationDuration: '60s', willChange: 'transform' }}>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-2 md:gap-6 items-center">
                  {[
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
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 flex flex-col items-center gap-1 md:gap-[8px] bg-white/5 border border-white/10 rounded-xl md:rounded-[16px] px-3 md:px-5 py-2 md:py-4 min-w-[76px] md:min-w-[130px] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.10] hover:shadow-2xl hover:z-50 relative group hover:bg-white/10 pointer-events-auto"
                    >
                      <img
                        src={`https://img.logo.dev/${item.url}?token=${LOGO_DEV_PUBLIC_KEY}&size=128&format=png`}
                        alt={item.name}
                        loading="lazy"
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
                  {[
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
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 flex flex-col items-center gap-1 md:gap-[8px] bg-white/5 border border-white/10 rounded-xl md:rounded-[16px] px-3 md:px-5 py-2 md:py-4 min-w-[76px] md:min-w-[130px] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.10] hover:shadow-2xl hover:z-50 relative group hover:bg-white/10 pointer-events-auto"
                    >
                      <img
                        src={`https://img.logo.dev/${item.url}?token=${LOGO_DEV_PUBLIC_KEY}&size=128&format=png`}
                        alt={item.name}
                        loading="lazy"
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
                  {[
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
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 flex flex-col items-center gap-1 md:gap-[8px] bg-white/5 border border-white/10 rounded-xl md:rounded-[16px] px-3 md:px-5 py-2 md:py-4 min-w-[76px] md:min-w-[130px] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.10] hover:shadow-2xl hover:z-50 relative group hover:bg-white/10 pointer-events-auto"
                    >
                      <img
                        src={`https://img.logo.dev/${item.url}?token=${LOGO_DEV_PUBLIC_KEY}&size=128&format=png`}
                        alt={item.name}
                        loading="lazy"
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
      <Reviews />

      {/* Persistent WhatsApp Floating Widget */}
      <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-[150] flex flex-col items-end gap-4 pointer-events-none">

        {/* Animated Help Bubble */}
        <AnimatePresence>
          {showChatBubble && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="relative bg-white pl-5 pr-10 py-3 rounded-2xl shadow-xl shadow-black/10 border border-black/5 animate-bounce pointer-events-auto hidden sm:block"
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
          0% { transform: translateX(-50%) translateZ(0); }
          100% { transform: translateX(0%) translateZ(0); }
        }
        @keyframes marquee-left {
          0% { transform: translateX(0%) translateZ(0); }
          100% { transform: translateX(-50%) translateZ(0); }
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

        /* Hero gradient mesh — solid colour + filter:blur matches original bg-blue-300/40 blur-[120px] look */
        /* blur value never changes = GPU caches texture once; only transform animates via compositor */
        .hero-blob-blue {
          position: absolute;
          top: -20%; left: -10%;
          width: 70%; height: 70%;
          background: rgba(147, 197, 253, 0.42);
          border-radius: 9999px;
          filter: blur(120px);
          will-change: transform;
          animation: hero-drift-blue 12s ease-in-out infinite;
        }
        .hero-blob-purple {
          position: absolute;
          bottom: 10%; right: -10%;
          width: 60%; height: 60%;
          background: rgba(216, 180, 254, 0.36);
          border-radius: 9999px;
          filter: blur(120px);
          will-change: transform;
          animation: hero-drift-purple 18s ease-in-out infinite;
          animation-delay: 2s;
        }
        .hero-blob-pink {
          position: absolute;
          top: 40%; left: 40%;
          width: 40%; height: 40%;
          background: rgba(249, 168, 212, 0.28);
          border-radius: 9999px;
          filter: blur(120px);
          will-change: transform;
          animation: hero-drift-pink 15s ease-in-out infinite;
          animation-delay: 4s;
        }
        /* Rotating violet aura — matches original #8b5cf6 circle */
        .hero-aura {
          position: absolute;
          top: 50%; left: 50%;
          width: 100%; max-width: 896px;
          height: 600px;
          background: radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%);
          filter: blur(100px);
          opacity: 0.25;
          will-change: transform;
          animation: hero-spin-aura 20s linear infinite;
        }
        @keyframes hero-drift-blue {
          0%, 100% { transform: translate3d(0, 0, 0); }
          33%       { transform: translate3d(80px, 40px, 0); }
          66%       { transform: translate3d(-20px, 80px, 0); }
        }
        @keyframes hero-drift-purple {
          0%, 100% { transform: translate3d(0, 0, 0); }
          33%       { transform: translate3d(-60px, -70px, 0); }
          66%       { transform: translate3d(30px, -40px, 0); }
        }
        @keyframes hero-drift-pink {
          0%, 100% { transform: translate3d(0, 0, 0); }
          33%       { transform: translate3d(90px, -60px, 0); }
          66%       { transform: translate3d(-30px, 50px, 0); }
        }
        @keyframes hero-spin-aura {
          0%   { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-blob-blue, .hero-blob-purple, .hero-blob-pink, .hero-aura {
            animation: none;
          }
          .hero-aura { transform: translate(-50%, -50%); }
        }
      `}</style>
    </div>
  );
};
