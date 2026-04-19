import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Zap, Target, TrendingUp, Sparkles, Globe, MessageSquare, 
  Users, Award, Rocket, Cpu, Layers, Fingerprint, Shield, Infinity as InfinityIcon,
  Image as ImageIcon, Book, Leaf, Smile, Search, Play, Video, LayoutDashboard, 
  CheckCircle, Network, MessageCircle, HelpCircle, Edit3, Feather, User, Hash, Film, 
  PenTool, Hexagon, X 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StorePage } from './StorePage';

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
      {/* Background Decorative Mesh */}
      <div className="absolute top-0 left-0 w-full h-[100vh] pointer-events-none opacity-30 overflow-hidden -z-10 mix-blend-multiply">
        <motion.div 
          animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-300/40 blur-[180px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -60, 0], y: [0, -70, 0], scale: [1, 1.3, 1] }} 
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }} 
          className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-300/40 blur-[180px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, 90, 0], y: [0, -60, 0], scale: [1, 0.8, 1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }} 
          className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-pink-300/30 blur-[180px] rounded-full" 
        />
      </div>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Animated Hero Gradient Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[600px] pointer-events-none -z-10 blur-[120px] opacity-30">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 180, 270, 360],
              background: [
                'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
                'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
                'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                'radial-gradient(circle, #3b82f6 0%, transparent 70%)'
              ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-full h-full"
          />
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hero-text inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-[0.4em] mb-6 md:mb-10 max-w-[90vw]"
          >
            <Sparkles size={12} />
            <span className="truncate">Accelerate Your Vision</span>
          </motion.div>
          
          <h1 className="hero-text text-[44px] sm:text-6xl md:text-[85px] lg:text-[100px] font-['Plus_Jakarta_Sans'] font-extrabold tracking-[-0.05em] text-[#0f172a] mb-8 md:mb-10 leading-[1] md:leading-[1.1]">
            Smart AI and <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent font-[600]">Software Solutions</span>
            <br className="hidden md:block" /> for Your Business
          </h1>
          
          <p className="hero-text text-lg md:text-2xl text-gray-600 max-w-3xl mb-12 md:mb-16 leading-relaxed font-['Inter'] font-normal">
            Delivering trusted AI tools and smart software solutions to help you build, innovate, and grow faster.
          </p>
          
          <div className="hero-text flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
             <Link 
              to="/store" 
              className="px-8 py-4 md:px-10 md:py-5 bg-blue-600 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20"
             >
               Explore Our Softwares
               <ArrowRight size={18} />
             </Link>
             <Link 
              to="/store"
              className="px-8 py-4 md:px-10 md:py-5 border-2 border-gray-200 text-gray-900 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:border-gray-900 hover:bg-gray-50 transition-all"
             >
               View Catalog
             </Link>
          </div>
        </div>
      </section>

      {/* Partner Marquee Rows */}
      <section className="fade-up-section py-10 md:py-12 overflow-hidden border-y border-white/5 bg-[#020617] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_60%)]" />
        <div className="flex flex-col gap-3 md:gap-4 relative z-10 max-w-[100vw]">
          {/* Row 1: Moving Right */}
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee-right gap-[8px] md:gap-4 items-center pr-[8px] md:pr-4 hover:[animation-play-state:paused] w-max py-4 pointer-events-none" style={{ animationDuration: '60s' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-[8px] md:gap-4 items-center">
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
                      className="shrink-0 flex flex-col items-center gap-[6px] bg-white/5 border border-white/10 rounded-[14px] px-3.5 py-2 md:py-2.5 min-w-[90px] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.10] hover:shadow-2xl hover:z-50 relative group hover:bg-white/10 pointer-events-auto"
                    >
                      <img 
                        src={`https://img.logo.dev/${item.url}?token=${LOGO_DEV_PUBLIC_KEY}&size=128&format=png`} 
                        alt={item.name} 
                        className="w-10 h-10 object-contain rounded-[10px] bg-white p-1" 
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=64&background=2ec4b6&color=fff&bold=true` }}
                      />
                      <span className="font-bold tracking-tight text-[11px] text-gray-300 truncate w-full text-center group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Row 2: Moving Left */}
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee-left gap-[8px] md:gap-4 items-center pr-[8px] md:pr-4 hover:[animation-play-state:paused] w-max py-4 pointer-events-none" style={{ animationDuration: '60s' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-[8px] md:gap-4 items-center">
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
                      className="shrink-0 flex flex-col items-center gap-[6px] bg-white/5 border border-white/10 rounded-[14px] px-3.5 py-2 md:py-2.5 min-w-[90px] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.10] hover:shadow-2xl hover:z-50 relative group hover:bg-white/10 pointer-events-auto"
                    >
                      <img 
                        src={`https://img.logo.dev/${item.url}?token=${LOGO_DEV_PUBLIC_KEY}&size=128&format=png`} 
                        alt={item.name} 
                        className="w-10 h-10 object-contain rounded-[10px] bg-white p-1" 
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=64&background=2ec4b6&color=fff&bold=true` }}
                      />
                      <span className="font-bold tracking-tight text-[11px] text-gray-300 truncate w-full text-center group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Moving Right */}
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee-right gap-[8px] md:gap-4 items-center pr-[8px] md:pr-4 hover:[animation-play-state:paused] w-max py-4 pointer-events-none" style={{ animationDuration: '60s' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-[8px] md:gap-4 items-center">
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
                      className="shrink-0 flex flex-col items-center gap-[6px] bg-white/5 border border-white/10 rounded-[14px] px-3.5 py-2 md:py-2.5 min-w-[90px] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.10] hover:shadow-2xl hover:z-50 relative group hover:bg-white/10 pointer-events-auto"
                    >
                      <img 
                        src={`https://img.logo.dev/${item.url}?token=${LOGO_DEV_PUBLIC_KEY}&size=128&format=png`} 
                        alt={item.name} 
                        className="w-10 h-10 object-contain rounded-[10px] bg-white p-1" 
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=64&background=2ec4b6&color=fff&bold=true` }}
                      />
                      <span className="font-bold tracking-tight text-[11px] text-gray-300 truncate w-full text-center group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Store Panel */}
      <div id="store" className="-mt-16 sm:-mt-24 md:-mt-32 scroll-mt-24">
        <StorePage />
      </div>

      {/* Persistent WhatsApp Floating Widget */}
      <div className="fixed bottom-8 right-8 z-[150] flex flex-col items-end gap-4 pointer-events-none">
        
        {/* Animated Help Bubble */}
        <AnimatePresence>
          {showChatBubble && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="relative bg-white pl-5 pr-10 py-3 rounded-2xl shadow-xl shadow-black/10 border border-black/5 animate-bounce pointer-events-auto"
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
          href="https://wa.me/919552530324" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300 active:scale-95 group pointer-events-auto"
          title="Chat with Us on WhatsApp"
        >
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
          <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 -ml-0.5 mt-0.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </a>
      </div>

      <style>{`
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-right {
          animation: marquee-right 30s linear infinite;
        }
        .animate-marquee-left {
          animation: marquee-left 30s linear infinite;
        }
      `}</style>
    </div>
  );
};
