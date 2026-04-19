import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Shield, Users, Award, Rocket, Globe, Target, Cpu, MessageSquare } from 'lucide-react';
import gsap from 'gsap';

export const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-in', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-32 md:pt-48 pb-24 px-6 selection:bg-blue-500/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-32 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-8 backdrop-blur-md"
          >
            The Vanguard of Innovation
          </motion.div>
          <h1 className="fade-in text-5xl md:text-[100px] font-black tracking-tighter text-gray-900 mb-10 leading-[0.9] text-center">
            Pioneering the <br /> <span className="text-blue-600">AI Frontier</span>
          </h1>
          <p className="fade-in text-xl md:text-3xl text-gray-500 max-w-4xl mx-auto font-medium leading-relaxed">
            We are more than a software store. We are an elite collective of researchers, engineers, and visionaries dedicated to accelerating the human potential through intelligent automation.
          </p>
        </section>

        {/* Story Grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-48">
          <div className="space-y-10">
            <h2 className="fade-in text-4xl md:text-6xl font-black tracking-tight text-gray-900 uppercase">Our Legacy</h2>
            <p className="fade-in text-lg text-gray-500 leading-relaxed font-medium">
              Founded in 2024, Software Store began with a singular vision: to make the world's most advanced AI architectures accessible to every business, regardless of size. 
            </p>
            <div className="fade-in grid grid-cols-2 gap-8">
              <div className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm">
                <div className="text-4xl font-black text-blue-600 mb-2">500+</div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-500">Global Partners</div>
              </div>
              <div className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm">
                <div className="text-4xl font-black text-blue-600 mb-2">99.9%</div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-500">Reliability Rate</div>
              </div>
            </div>
          </div>
          <div className="relative fade-in">
            <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full" />
            <div className="relative aspect-square rounded-[64px] bg-white border border-gray-100 overflow-hidden flex items-center justify-center shadow-2xl">
              <Globe size={200} className="text-blue-600/5 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Target size={60} className="text-blue-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <section className="mb-48">
          <div className="text-center mb-20">
            <h2 className="fade-in text-4xl md:text-6xl font-black tracking-tighter text-gray-900 uppercase">Core Principles</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Shield, title: "Absolute Security", desc: "Every line of code is vetted by our internal security audit team." },
              { icon: Cpu, title: "Compute Optimized", desc: "Our tools are engineered to provide maximum results with minimal resource overhead." },
              { icon: MessageSquare, title: "Human Centric", desc: "AI should amplify human creativity, not replace it. We build with this empathy." }
            ].map((item, i) => (
              <div key={i} className="fade-in p-10 bg-white border border-gray-100 rounded-[40px] hover:border-blue-500/30 transition-all group shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="fade-in bg-blue-600 rounded-[64px] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-10 leading-none">JOIN OUR MISSION</h2>
            <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto mb-12">
              Become part of the most exclusive software network on the planet. Start your innovation journey today.
            </p>
            <button className="px-12 py-6 bg-white text-blue-600 rounded-[24px] font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-2xl">
              Get Started
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
