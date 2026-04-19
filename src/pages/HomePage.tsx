import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Target, TrendingUp, Sparkles, Globe, MessageSquare, Users, Award, Rocket, Cpu, Layers, Fingerprint, Shield, Infinity as InfinityIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

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
      // Join Our Mission Width Scroll Animation - REMOVED PER REQUEST
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative z-10 overflow-hidden selection:bg-blue-500/30">
      {/* Background Decorative Mesh */}
      <div className="absolute top-0 left-0 w-full h-[100vh] pointer-events-none opacity-20 dark:opacity-20 light:opacity-5 overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 blur-[180px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[180px] rounded-full" />
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

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hero-text inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10 md:mb-12 backdrop-blur-xl"
          >
            <Sparkles size={14} />
            <span>Accelerate Your Vision</span>
          </motion.div>
          
          <h1 className="hero-text text-5xl md:text-[90px] font-black tracking-tighter dark:text-white text-gray-900 mb-8 leading-[0.95] max-w-5xl mx-auto">
             Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">AI</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Software</span> Solutions for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 dark:from-white dark:via-white dark:to-gray-600">Business Growth</span>
          </h1>
          
          <p className="hero-text text-lg md:text-2xl dark:text-gray-500 text-gray-600 max-w-3xl mx-auto mb-14 md:mb-16 leading-relaxed font-medium">
            Delivering Trusted AI Tools and Smart Software Solutions to Help You Build, Innovate, and Grow Faster.
          </p>
          
          <div className="hero-text flex flex-col sm:flex-row gap-5 justify-center items-center">
             <Link 
              to="/store" 
              className="px-10 py-5 bg-white text-black dark:bg-white dark:text-black light:bg-blue-600 light:text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-gray-200 light:hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(59,130,246,0.3)] dark:shadow-blue-500/10"
             >
               Explore Our Software
               <ArrowRight size={18} />
             </Link>
             <Link 
              to="/store"
              className="px-10 py-5 border border-white/10 text-white dark:text-white dark:border-white/10 light:text-gray-900 light:border-gray-900/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/5 light:hover:bg-gray-100 transition-all backdrop-blur-sm"
             >
               View Catalog
             </Link>
          </div>
        </div>
      </section>

      {/* Partner Marquee Rows */}
      <section className="fade-up-section py-20 overflow-hidden border-y border-gray-900/5 dark:border-white/5 bg-white/[0.01]">
        <div className="space-y-12">
          {/* Row 1: Moving Right */}
          <div className="flex whitespace-nowrap overflow-hidden group">
            <div className="flex animate-marquee-right gap-12 md:gap-24 items-center pr-12 md:pr-24">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-12 md:gap-24 items-center">
                  {[
                    { Icon: Globe, name: "Stellar Tech", color: "blue", bg: "rgba(59, 130, 246, 0.05)" },
                    { Icon: Cpu, name: "Neural Grid", color: "purple", bg: "rgba(139, 92, 246, 0.05)" },
                    { Icon: Zap, name: "Velocity AI", color: "cyan", bg: "rgba(6, 182, 212, 0.05)" },
                    { Icon: Target, name: "Quantum Logic", color: "indigo", bg: "rgba(79, 70, 229, 0.05)" },
                    { Icon: Shield, name: "Cyber Flow", color: "blue", bg: "rgba(37, 99, 235, 0.05)" },
                    { Icon: Rocket, name: "Orbital Systems", color: "violet", bg: "rgba(124, 58, 237, 0.05)" },
                    { Icon: Layers, name: "Data Labs", color: "pink", bg: "rgba(236, 72, 153, 0.05)" },
                    { Icon: Fingerprint, name: "Future Mind", color: "rose", bg: "rgba(225, 29, 72, 0.05)" },
                    { Icon: InfinityIcon, name: "Infinite Dev", color: "blue", bg: "rgba(59, 130, 246, 0.05)" },
                    { Icon: Award, name: "Elite AI", color: "emerald", bg: "rgba(16, 185, 129, 0.05)" }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{ backgroundColor: item.bg }}
                      className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/5 dark:border-white/5 light:border-gray-200 text-gray-300 dark:text-gray-700 hover:text-blue-500 dark:hover:text-white transition-all duration-300 cursor-default grayscale hover:grayscale-0 shadow-lg"
                    >
                      <item.Icon size={24} strokeWidth={1.5} className={`text-${item.color}-500`} />
                      <span className="font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">{item.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Moving Left */}
          <div className="flex whitespace-nowrap overflow-hidden group">
            <div className="flex animate-marquee-left gap-12 md:gap-24 items-center pr-12 md:pr-24">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-12 md:gap-24 items-center">
                  {[
                    { Icon: Sparkles, name: "Zenith Software", color: "amber", bg: "rgba(245, 158, 11, 0.05)" },
                    { Icon: MessageSquare, name: "Chat Flow", color: "teal", bg: "rgba(20, 184, 166, 0.05)" },
                    { Icon: Users, name: "Global Sync", color: "blue", bg: "rgba(59, 130, 246, 0.05)" },
                    { Icon: Target, name: "Precision AI", color: "red", bg: "rgba(239, 68, 68, 0.05)" },
                    { Icon: Shield, name: "Safe Guard", color: "green", bg: "rgba(34, 197, 94, 0.05)" },
                    { Icon: Rocket, name: "Launch Pad", color: "orange", bg: "rgba(249, 115, 22, 0.05)" },
                    { Icon: Cpu, name: "Core Logic", color: "indigo", bg: "rgba(99, 102, 241, 0.05)" },
                    { Icon: Globe, name: "World Wide", color: "blue", bg: "rgba(59, 130, 246, 0.05)" },
                    { Icon: Layers, name: "Stack Labs", color: "purple", bg: "rgba(168, 85, 247, 0.05)" },
                    { Icon: Zap, name: "Spark AI", color: "yellow", bg: "rgba(234, 179, 8, 0.05)" }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{ backgroundColor: item.bg }}
                      className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/5 dark:border-white/5 light:border-gray-200 text-gray-300 dark:text-gray-700 hover:text-purple-500 dark:hover:text-white transition-all duration-300 cursor-default grayscale hover:grayscale-0 shadow-lg"
                    >
                      <item.Icon size={24} strokeWidth={1.5} className={`text-${item.color}-500`} />
                      <span className="font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">{item.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars - Simplified */}
      <section className="fade-up-section py-32 px-6 bg-[#09090b] dark:bg-[#09090b] light:bg-white border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
             {[
               { icon: Target, title: "Precision Driven", desc: "Our elite software architectures are built for accuracy and high-performance scaling.", color: "blue" },
               { icon: Zap, title: "Rapid Innovation", desc: "Deploy AI solutions in hours, not months. Our toolkit is optimized for speed.", color: "purple" },
               { icon: TrendingUp, title: "Growth Mindset", desc: "Every tool in our catalog is selected specifically to drive business revenue and reach.", color: "pink" }
             ].map((item, i) => (
               <motion.div 
                 key={i} 
                 whileHover={{ y: -15 }}
                 className="p-10 bg-white/[0.02] dark:bg-white/[0.02] light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200 rounded-[40px] hover:border-blue-500/20 transition-all group relative overflow-hidden"
               >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-500/5 blur-[50px] rounded-full group-hover:bg-${item.color}-500/15 transition-all duration-700`} />
                  <div className="w-16 h-16 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-gray-200/50 flex items-center justify-center dark:text-white text-gray-900 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:scale-110 shadow-2xl">
                     <item.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-black dark:text-white text-gray-900 mb-4 uppercase tracking-tighter">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-medium text-base">{item.desc}</p>
                  <div className="mt-8 overflow-hidden h-1 w-0 group-hover:w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent transition-all duration-700" />
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Modern Split Feature - Simplified */}
      <section className="fade-up-section py-32 md:py-48 px-6 bg-[#0c0c0e] dark:bg-[#0c0c0e] light:bg-white border-y border-white/5 dark:border-white/5 light:border-gray-100">
        <div className="max-w-7xl mx-auto">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="inline-block px-3 py-1 rounded-md bg-blue-500/10 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                   The Digital Edge
                </div>
                <h2 className="text-4xl md:text-7xl font-black dark:text-white text-gray-900 tracking-tighter leading-none">
                  Build the <br /> Future Today.
                </h2>
                <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
                  We don't just provide software; we provide the competitive advantage. Our tools are designed to integrate seamlessly into your workflow and amplify your results.
                </p>
                <div className="pt-6">
                   <Link to="/store" className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] dark:text-white text-gray-900 duration-300 hover:text-blue-500 transition-colors">
                      Enter the Catalog <div className="w-8 h-8 rounded-full border border-gray-900/20 dark:border-white/10 flex items-center justify-center group-hover:border-blue-500"><ArrowRight size={14} /></div>
                   </Link>
                </div>
              </div>
              <div className="relative">
                 <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
                 <div className="relative aspect-video rounded-[40px] bg-gray-900 dark:bg-[#111] light:bg-[#f5f5f5] border border-white/5 dark:border-white/5 light:border-gray-200 overflow-hidden flex items-center justify-center p-12 shadow-2xl">
                   <Globe size={180} className="dark:text-white/5 text-gray-900/5 animate-pulse" />
                   <div className="absolute bottom-8 left-8 right-8">
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-500" 
                          animate={{ width: ["0%", "100%", "0%"] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                   </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="fade-up-section py-48 px-6 bg-[#050508] dark:bg-[#050510] light:bg-[#f9fafb] border-t border-white/5 dark:border-white/5 light:border-gray-100 relative overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
          <div className="text-center mb-32 max-w-4xl">
            <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="inline-block mb-8 text-6xl"
            >
              🔮
            </motion.div>
            <h2 className="text-5xl md:text-8xl font-black dark:text-white text-gray-900 tracking-tighter mb-8 uppercase">Our <span className="text-gray-800 dark:text-gray-800 light:text-gray-300">Mission</span></h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
            <p className="text-gray-400 text-xl md:text-3xl mt-12 font-medium leading-[1.4]">
              We empower visionaries with the tools of tomorrow. Our mission is to democratize high-entropy AI systems, making industrial-grade software accessible to every innovator.
            </p>
            <div className="mt-12">
              <Link to="/about" className="text-blue-500 font-black uppercase tracking-widest text-xs hover:text-blue-400 transition-colors flex items-center justify-center gap-2">
                Learn our full story <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {[
              { 
                icon: Users, 
                title: "Expert Team", 
                desc: "Founded by industry veterans with deep roots in Silicon Valley's most innovative organizations.",
                detail: "50+ years of collective experience."
              },
              { 
                icon: Award, 
                title: "Proven Results", 
                desc: "Optimizing software deployments for over 500+ global enterprises with measurable growth.",
                detail: "Average 40% efficiency gain."
              },
              { 
                icon: Rocket, 
                title: "Future Ready", 
                desc: "Constantly evolving our catalog with next-generation tools as soon as they emerge.",
                detail: "Weekly platform updates."
              },
              { 
                icon: InfinityIcon, 
                title: "Infinite Scale", 
                desc: "Systems designed to grow from MVP to Enterprise without architectural friction.",
                detail: "Zero downtime migrations."
              }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[48px] bg-white/[0.01] dark:bg-white/[0.01] light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200 hover:bg-white/[0.03] light:hover:bg-gray-100 transition-all group text-center">
                <div className="w-16 h-16 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-500 mx-auto mb-10 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-black dark:text-white text-gray-900 mb-4 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{feature.desc}</p>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/50">{feature.detail}</span>
              </div>
            ))}
          </div>

          {/* Join Our Mission Box - Static per request */}
          <div className="mt-48 w-full flex justify-center">
            <div className="join-mission-box w-full h-80 rounded-[48px] bg-gradient-to-br from-blue-600/10 via-white/5 to-purple-600/10 dark:from-blue-600/20 dark:via-white/5 dark:to-purple-600/20 light:from-blue-50 light:to-purple-50 border border-white/10 dark:border-white/10 light:border-gray-200 flex items-center justify-center relative overflow-hidden group shadow-[0_40px_100px_rgba(59,130,246,0.15)] backdrop-blur-3xl">
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-30 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="relative z-10 text-center px-12">
                  <h3 className="text-3xl md:text-5xl font-black dark:text-white text-gray-900 uppercase tracking-tighter mb-6">Join Our Mission</h3>
                  <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 font-medium max-w-xl mx-auto text-lg leading-relaxed">Help us shape the future of artificial intelligence and enterprise software solutions. We're building tools that change the world.</p>
                  <button className="mt-10 px-12 py-5 bg-white text-black dark:bg-white dark:text-black light:bg-blue-600 light:text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 transition-all shadow-2xl active:scale-95">
                    Get Involved
                  </button>
               </div>
            </div>
          </div>

          {/* New Narrative Block */}
          <div className="mt-48 grid lg:grid-cols-2 gap-24 items-center">
             <div className="space-y-12">
                <h3 className="text-4xl md:text-6xl font-black dark:text-white text-gray-900 tracking-tighter leading-none uppercase">
                  Innovation Through <br /> <span className="text-blue-600 underline underline-offset-8">Disruption</span>
                </h3>
                <div className="space-y-8">
                   <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-full border border-gray-900/10 dark:border-white/10 flex items-center justify-center dark:text-white text-gray-900 shrink-0 font-black">01</div>
                      <p className="text-gray-400 font-medium text-lg leading-snug">Rigorously vetting every solution for security and ethical alignment before it hits the exchange.</p>
                   </div>
                   <div className="flex gap-6">
                      <div className="w-12 h-12 rounded-full border border-gray-900/10 dark:border-white/10 flex items-center justify-center dark:text-white text-gray-900 shrink-0 font-black">02</div>
                      <p className="text-gray-400 font-medium text-lg leading-snug">Bridging the gap between raw research and production-ready enterprise environments.</p>
                   </div>
                </div>
             </div>
             <div className="aspect-square rounded-[64px] bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 dark:border-white/10 light:border-gray-200 p-1 bg-white/[0.02] flex items-center justify-center group overflow-hidden shadow-2xl">
                <div className="relative w-full h-full rounded-[60px] bg-[#050505] dark:bg-[#050505] light:bg-[#f8fafc] overflow-hidden flex items-center justify-center">
                   <Target size={120} className="dark:text-white/5 text-gray-900/5 group-hover:text-blue-500/20 transition-colors duration-1000 group-hover:scale-150 transition-transform" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={40} className="dark:text-white text-gray-900 animate-pulse" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="fade-up-section py-48 px-6 text-center">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-[100px] font-black dark:text-white text-gray-900 tracking-tighter mb-12 uppercase leading-none">
              Ready to <span className="text-gray-700 dark:text-gray-700 light:text-gray-300">Innovate?</span>
            </h2>
            <Link 
              to="/store"
              className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black dark:bg-white dark:text-black light:bg-blue-600 light:text-white rounded-[24px] font-black text-lg hover:bg-gray-200 light:hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Get Started Now
            </Link>
         </div>
      </section>
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[150] w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform active:scale-95 group"
        title="Chat with Us on WhatsApp"
      >
        <MessageSquare size={32} className="group-hover:animate-bounce" />
        <div className="absolute right-full mr-4 px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-black/5">
          Connect with Founder
        </div>
      </a>

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
          animation: marquee-right 60s linear infinite;
        }
        .animate-marquee-left {
          animation: marquee-left 60s linear infinite;
        }
      `}</style>
    </div>
  );
};
