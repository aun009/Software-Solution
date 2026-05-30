import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FC,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  Box,
  Rocket,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

interface FloatingIconsHeroProps {
  onExplore: () => void;
}

interface HeroSize {
  width: number;
  height: number;
}

interface FloatingIconConfig {
  id: string;
  label: string;
  Icon: LucideIcon;
  x: number;
  y: number;
  tabletX: number;
  tabletY: number;
  size: number;
  color: string;
  background: string;
  glow: string;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
  strength: number;
}

const SPRING = { stiffness: 95, damping: 18, mass: 0.75 };
const heroContentVariants = {
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};
const heroItemVariants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] },
  },
};
const reducedHeroItemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.28 },
  },
};

// Tune the feel here: keep four items for the reference-style frame, then adjust color/strength per icon.
const floatingIcons: FloatingIconConfig[] = [
  {
    id: 'ai',
    label: 'AI tools',
    Icon: Sparkles,
    x: 27,
    y: 33,
    tabletX: 17,
    tabletY: 33,
    size: 24,
    color: '#8b5cf6',
    background: 'rgba(255,255,255,0.9)',
    glow: 'rgba(139,92,246,0.24)',
    delay: 0.2,
    duration: 8.6,
    drift: 12,
    rotate: -8,
    strength: 18,
  },
  {
    id: 'growth',
    label: 'Growth analytics',
    Icon: BarChart3,
    x: 73,
    y: 30,
    tabletX: 83,
    tabletY: 31,
    size: 25,
    color: '#4f46e5',
    background: 'rgba(255,255,255,0.9)',
    glow: 'rgba(79,70,229,0.22)',
    delay: 1.1,
    duration: 9.4,
    drift: 13,
    rotate: 7,
    strength: 16,
  },
  {
    id: 'software',
    label: 'Software collection',
    Icon: Box,
    x: 27,
    y: 74,
    tabletX: 18,
    tabletY: 76,
    size: 24,
    color: '#2563eb',
    background: 'rgba(255,255,255,0.9)',
    glow: 'rgba(37,99,235,0.22)',
    delay: 1.4,
    duration: 9.8,
    drift: 12,
    rotate: 5,
    strength: 18,
  },
  {
    id: 'launch',
    label: 'Scale faster',
    Icon: Rocket,
    x: 73,
    y: 74,
    tabletX: 82,
    tabletY: 76,
    size: 24,
    color: '#7c3aed',
    background: 'rgba(255,255,255,0.9)',
    glow: 'rgba(124,58,237,0.22)',
    delay: 2,
    duration: 10.6,
    drift: 12,
    rotate: -4,
    strength: 17,
  },
];

const resetParallax = (x: MotionValue<number>, y: MotionValue<number>) => {
  if (x.get() !== 0) x.set(0);
  if (y.get() !== 0) y.set(0);
};

interface FloatingHeroIconProps {
  config: FloatingIconConfig;
  heroSize: HeroSize;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  reduceMotion: boolean;
}

type IconPositionStyle = CSSProperties & {
  '--hero-icon-x': string;
  '--hero-icon-y': string;
  '--hero-icon-desktop-x': string;
  '--hero-icon-desktop-y': string;
};

const FloatingHeroIcon: FC<FloatingHeroIconProps> = ({
  config,
  heroSize,
  pointerX,
  pointerY,
  reduceMotion,
}) => {
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const springX = useSpring(parallaxX, SPRING);
  const springY = useSpring(parallaxY, SPRING);

  useAnimationFrame(() => {
    if (reduceMotion || heroSize.width === 0 || heroSize.height === 0) {
      resetParallax(parallaxX, parallaxY);
      return;
    }

    const mouseX = pointerX.get();
    const mouseY = pointerY.get();

    if (!Number.isFinite(mouseX) || !Number.isFinite(mouseY)) {
      resetParallax(parallaxX, parallaxY);
      return;
    }

    const directionX = mouseX / heroSize.width - 0.5;
    const directionY = mouseY / heroSize.height - 0.5;

    parallaxX.set(directionX * config.strength);
    parallaxY.set(directionY * config.strength);
  });

  const positionStyle: IconPositionStyle = {
    '--hero-icon-x': `${config.tabletX}%`,
    '--hero-icon-y': `${config.tabletY}%`,
    '--hero-icon-desktop-x': `${config.x}%`,
    '--hero-icon-desktop-y': `${config.y}%`,
  };

  return (
    <div
      aria-hidden="true"
      className="floating-hero-icon absolute pointer-events-none z-[2]"
      style={positionStyle}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={
            reduceMotion
              ? { opacity: [0.78, 1, 0.78] }
              : {
                  y: [0, -config.drift, 0, config.drift * 0.72, 0],
                  rotate: [config.rotate, config.rotate + 2, config.rotate, config.rotate - 2, config.rotate],
                }
          }
          transition={{
            duration: reduceMotion ? 6 : config.duration,
            delay: config.delay,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          style={{ willChange: 'transform, opacity' }}
        >
          <motion.div
            className="grid place-items-center rounded-lg border border-white/75 backdrop-blur-md"
            style={{
              x: springX,
              y: springY,
              width: config.size + 30,
              height: config.size + 30,
              color: config.color,
              background: config.background,
              boxShadow: `0 18px 42px rgba(15,23,42,0.10), 0 0 34px ${config.glow}`,
              willChange: 'transform',
            }}
          >
            <config.Icon size={config.size} strokeWidth={2.35} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export const FloatingIconsHero = ({ onExplore }: FloatingIconsHeroProps) => {
  const heroRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(Number.POSITIVE_INFINITY);
  const pointerY = useMotionValue(Number.POSITIVE_INFINITY);
  const reduceMotion = Boolean(useReducedMotion());
  const [heroSize, setHeroSize] = useState<HeroSize>({ width: 0, height: 0 });

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const updateSize = () => {
      const rect = hero.getBoundingClientRect();
      setHeroSize({ width: rect.width, height: rect.height });
    };

    updateSize();

    const observer = new ResizeObserver(([entry]) => {
      setHeroSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (reduceMotion || event.pointerType === 'touch') return;

      const rect = event.currentTarget.getBoundingClientRect();
      pointerX.set(event.clientX - rect.left);
      pointerY.set(event.clientY - rect.top);
    },
    [pointerX, pointerY, reduceMotion]
  );

  const clearPointer = useCallback(() => {
    pointerX.set(Number.POSITIVE_INFINITY);
    pointerY.set(Number.POSITIVE_INFINITY);
  }, [pointerX, pointerY]);

  return (
    <section
      id="home"
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={clearPointer}
      className="relative min-h-[520px] sm:min-h-[580px] md:min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-5 sm:px-6 pt-28 md:pt-24 pb-6 md:pb-16 overflow-hidden bg-[#FAFAFC]"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="hero-blob-blue"
          animate={reduceMotion ? undefined : { x: [0, 76, -18, 0], y: [0, 42, 72, 0] }}
          transition={{ duration: 13, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.div
          className="hero-blob-mint"
          animate={reduceMotion ? undefined : { x: [0, 48, 92, 0], y: [0, -34, 24, 0] }}
          transition={{ duration: 17, delay: 1.5, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.div
          className="hero-blob-pink"
          animate={reduceMotion ? undefined : { x: [0, -74, 28, 0], y: [0, 46, 88, 0] }}
          transition={{ duration: 16, delay: 3, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.div
          className="hero-aura"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
          style={{ x: '-50%', y: '-50%' }}
        />
      </div>

      <div aria-hidden="true" className="absolute inset-0 pointer-events-none hidden md:block">
        {floatingIcons.map((icon) => (
          <FloatingHeroIcon
            key={icon.id}
            config={icon}
            heroSize={heroSize}
            pointerX={pointerX}
            pointerY={pointerY}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      <motion.div
        className="max-w-3xl mx-auto w-full relative z-10 flex flex-col items-center text-center md:pt-2"
        initial="hidden"
        animate="visible"
        variants={heroContentVariants}
      >
        <motion.div
          className="hero-text mb-4 inline-flex items-center gap-2 rounded-lg border border-blue-200/80 bg-white/85 px-4 py-2 text-[10.5px] md:text-[12px] font-black uppercase tracking-[0.16em] md:tracking-[0.18em] text-blue-700 shadow-[0_6px_18px_rgba(37,99,235,0.12)] backdrop-blur-md"
          variants={reduceMotion ? reducedHeroItemVariants : heroItemVariants}
        >
          <Sparkles size={15} className="text-violet-600" />
          Smarter tools. Bigger impact
        </motion.div>

        <motion.h1
          className="hero-text mx-auto max-w-2xl text-center tracking-normal text-[#0f172a]"
          style={{ fontFamily: "'Playfair Display', serif" }}
          variants={reduceMotion ? reducedHeroItemVariants : heroItemVariants}
        >
          <span className="block text-[40px] sm:text-[48px] md:text-[62px] lg:text-[72px] font-bold leading-[0.98] md:leading-[1.0]">
            Everything You
          </span>
          <span className="block text-[40px] sm:text-[48px] md:text-[62px] lg:text-[72px] font-bold leading-[0.98] md:leading-[1.0]">
            Need to{' '}
            <span className="bg-gradient-to-r from-blue-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              Create,
            </span>
          </span>
          <span className="block text-[40px] sm:text-[48px] md:text-[62px] lg:text-[72px] font-bold leading-[0.98] md:leading-[1.0] bg-gradient-to-r from-blue-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
            Grow &amp; Scale
          </span>
        </motion.h1>

        <motion.p
          className="hero-text mt-5 text-[15px] sm:text-base md:text-lg text-slate-600 max-w-[21rem] sm:max-w-md md:max-w-xl leading-relaxed font-['Poppins'] font-normal"
          variants={reduceMotion ? reducedHeroItemVariants : heroItemVariants}
        >
          Discover powerful softwares and AI tools built for creators, marketers, students, and entrepreneurs.
        </motion.p>

        <motion.div
          className="hero-text mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
          variants={reduceMotion ? reducedHeroItemVariants : heroItemVariants}
        >
          <button
            onClick={onExplore}
            className="group overflow-hidden relative px-8 py-4 md:px-10 md:py-4 bg-blue-600 text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.28)] hover:shadow-[0_0_40px_rgba(37,99,235,0.42)] cursor-pointer"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
            <span className="relative z-10 block transition-transform duration-300 group-hover:-translate-x-1">Explore Softwares</span>
            <ArrowRight size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
          </button>
        </motion.div>
      </motion.div>

      <style>{`
        .floating-hero-icon {
          left: var(--hero-icon-x);
          top: var(--hero-icon-y);
        }
        @media (min-width: 1280px) {
          .floating-hero-icon {
            left: var(--hero-icon-desktop-x);
            top: var(--hero-icon-desktop-y);
          }
        }
        .hero-blob-blue {
          position: absolute;
          top: -24%; left: -10%;
          width: 64%; height: 68%;
          background: rgba(147, 197, 253, 0.44);
          border-radius: 9999px;
          filter: blur(120px);
          will-change: transform;
        }
        .hero-blob-mint {
          position: absolute;
          bottom: 8%; left: -8%;
          width: 44%; height: 44%;
          background: rgba(167, 243, 208, 0.28);
          border-radius: 9999px;
          filter: blur(110px);
          will-change: transform;
        }
        .hero-blob-pink {
          position: absolute;
          top: 8%; right: -8%;
          width: 58%; height: 62%;
          background: rgba(249, 168, 212, 0.32);
          border-radius: 9999px;
          filter: blur(120px);
          will-change: transform;
        }
        .hero-aura {
          position: absolute;
          top: 50%; left: 50%;
          width: min(920px, 100%);
          height: 560px;
          background: radial-gradient(circle, rgba(255,255,255,0.78) 0%, rgba(219,234,254,0.32) 42%, transparent 72%);
          filter: blur(70px);
          opacity: 0.82;
          will-change: transform;
        }
      `}</style>
    </section>
  );
};
