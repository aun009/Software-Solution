import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);



/* ─── Fade-up wrapper ─── */
const FadeUp = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const badges = ['Honest Reviews', 'Weekly Updates', 'No Spam', 'Affiliate Transparent'];



export const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white overflow-hidden font-sans selection:bg-blue-100">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative pt-40 pb-28 px-6 text-center overflow-hidden">
        {/* Animated gradient blobs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute top-0 left-[-10%] w-[55%] h-[80%] bg-blue-100/60 blur-[130px] rounded-full -z-10"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -25, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="pointer-events-none absolute bottom-0 right-[-10%] w-[50%] h-[70%] bg-violet-100/50 blur-[140px] rounded-full -z-10"
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          <motion.p
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 mb-5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100"
          >
            Our Story
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black tracking-tighter text-gray-900 mb-7 leading-[1.0]"
          >
            About{' '}
            <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
              SP Tech Solutions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            We're on a mission to help creators, students, and professionals discover the best AI tools and
            software — saving time, money, and frustration.
          </motion.p>
        </motion.div>
      </section>



      {/* ── MISSION ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-center">

          {/* Left: text */}
          <div>
            <FadeUp>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4">
                Our Mission
              </p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900 mb-6 leading-[1.1]">
                Making AI Accessible<br />to Everyone
              </h2>
              <p className="text-gray-500 text-[16px] leading-relaxed font-medium mb-4">
                The AI tools landscape is growing at an incredible pace. New tools launch every day,
                pricing changes constantly, and it's hard to know what's actually worth your time and money.
              </p>
              <p className="text-gray-500 text-[16px] leading-relaxed font-medium mb-8">
                SP Tech Solutions was built to solve this problem. We manually curate, test, and
                review every tool in our directory so you don't have to. Our goal is to be the most
                trusted AI tools directory on the internet.
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="flex flex-wrap gap-2">
                {badges.map((b, i) => (
                  <motion.span
                    key={b}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.07, type: 'spring', stiffness: 300 }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-[13px] font-semibold text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all cursor-default"
                  >
                    <CheckCircle size={13} className="text-blue-500 shrink-0" />
                    {b}
                  </motion.span>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Right: image + floating badge */}
          <FadeUp delay={0.1} className="relative">
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100"
            >
              <img
                src="/about-team.png"
                alt="SP Tech Solutions team"
                className="w-full h-[380px] md:h-[440px] object-cover"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-3xl pointer-events-none" />
            </motion.div>

            {/* Floating stat badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 16 }}
              className="absolute -bottom-5 -right-4 md:right-[-18px] bg-white rounded-2xl shadow-2xl border border-gray-100 px-5 py-4 text-center min-w-[120px]"
            >
              <p className="text-3xl font-black text-gray-900 leading-none">100+</p>
              <p className="text-[11px] font-semibold text-gray-500 mt-1 uppercase tracking-wide">
                AI Tools Curated
              </p>
            </motion.div>
          </FadeUp>
        </div>
      </section>



      {/* ── CTA ── */}
      <section className="py-20 md:py-28 px-6">
        <FadeUp>
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-[48px] bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 p-12 md:p-20 text-center shadow-2xl shadow-blue-200">
            {/* Decorative blobs inside CTA */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="relative z-10">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-200 mb-4"
              >
                Get Started Today
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-none"
              >
                JOIN OUR MISSION
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/75 text-lg font-medium max-w-xl mx-auto mb-10"
              >
                Become part of the most trusted software network. Start your journey with SP Tech Solutions today.
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-700 rounded-2xl font-black text-base shadow-xl hover:shadow-2xl transition-shadow"
              >
                Get Started <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </FadeUp>
      </section>

    </div>
  );
};
