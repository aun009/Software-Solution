import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Store, LucideIcon, LogIn, LogOut, Settings, Info, MessageCircle, Sun, Moon, Home, User as UserIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LoginModal } from './LoginModal';

gsap.registerPlugin(ScrollTrigger);

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavLink = ({ to, icon: Icon, label, active, onClick }: NavLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-300",
      active 
        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
    )}
  >
    <Icon size={14} className="md:size-[15px]" />
    <span className="text-[11px] md:text-[13px] font-bold tracking-tight">{label}</span>
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const brandTextRef = useRef<HTMLSpanElement>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { scrollYProgress } = useScroll();

  const scrollToStore = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById('store');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/#store');
    }
  }, [location.pathname, navigate]);
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: "top -20",
      end: 200,
      onUpdate: (self) => {
        const progress = self.progress;
        
        gsap.to(navRef.current, {
          boxShadow: `0 ${4 + progress * 10}px ${6 + progress * 20}px -1px rgba(0, 0, 0, ${0.05 + progress * 0.05})`,
          y: progress * 5,
          duration: 0.1,
          overwrite: 'auto'
        });
      }
    });

    return () => trigger.kill();
  }, []);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen transition-colors duration-500 flex flex-col font-sans selection:bg-blue-500/20 antialiased overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-blue-600 z-[120] origin-left"
        style={{ scaleX }}
      />

      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header - Pill Design */}
      <header className="fixed top-0 z-[110] w-full md:w-auto md:top-6 md:left-1/2 md:-translate-x-1/2 px-3 md:px-0 pointer-events-none mt-3 md:mt-0">
        <nav 
          ref={navRef}
          className="pointer-events-auto w-full md:w-auto mx-auto bg-white border border-gray-200 shadow-sm rounded-2xl md:rounded-full px-2 md:px-3 py-2 md:py-2.5 flex items-center justify-between gap-1 md:gap-12 transition-all"
        >
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 pl-2 group shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden group-hover:scale-[1.15] transition-transform duration-300 shadow-lg shadow-blue-600/20 ring-2 ring-blue-500/20 group-hover:ring-blue-500/40">
              <img src="/logo.jpeg" alt="SP Tech Solutions" className="w-full h-full object-cover" />
            </div>
            <span 
              ref={brandTextRef}
              className="text-base md:text-lg font-black tracking-wide text-gray-900 hidden sm:block"
            >
              SP Tech Solutions
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-0.5 md:gap-2 min-w-0 flex-1 md:flex-none justify-end">
            {/* Scrollable nav pills on mobile */}
            <div className="overflow-x-auto scrollbar-none flex-1 md:flex-none">
              <div className="flex items-center p-1 bg-gray-100 rounded-full gap-0.5 w-max">
                <NavLink to="/" icon={Home} label="Home" active={location.pathname === '/' && !location.hash} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
                <NavLink to="/about" icon={Info} label="About" active={location.pathname === '/about'} />
                <Link 
                  to="/#store" 
                  onClick={scrollToStore}
                  className={cn(
                    "flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-300",
                    location.hash === '#store'
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  )}
                >
                  <Store size={14} className="md:size-[15px]" />
                  <span className="text-[11px] md:text-[13px] font-bold tracking-tight">Store</span>
                </Link>
                {isAdmin && (
                  <NavLink to="/admin" icon={Settings} label="Admin" active={location.pathname === '/admin'} />
                )}
              </div>
            </div>

            <div className="w-px h-8 bg-gray-200 mx-2 hidden md:block" />
            
            <div className="flex items-center pr-1 shrink-0">
              {user ? (
                <Link 
                  to="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 md:pr-4 py-1.5 bg-white border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-[11px] font-black text-white shadow-inner shrink-0">
                    {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-[12px] font-bold text-gray-800 hidden sm:inline">
                    {user.displayName?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="px-4 md:px-5 py-2.5 bg-gray-900 text-white text-[12px] font-bold tracking-wide hover:bg-blue-600 transition-colors flex items-center gap-2 shrink-0 rounded-full shadow-md"
                >
                  <LogIn size={14} />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Main Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-16 md:py-24 border-t border-white/5 bg-[#0e1628] font-sans">
        <div className="max-w-[75rem] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16 md:mb-24">
            {/* Logo and About */}
            <div className="md:col-span-5 flex flex-col gap-6 pr-0 md:pr-12">
               <div className="text-[18px] md:text-[26px] font-black tracking-[0.08em] flex items-center gap-3 md:gap-4 text-white">
                 <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-white/10 shrink-0">
                   <img src="/logo.jpeg" alt="SP Tech Solutions" className="w-full h-full object-cover" />
                 </div>
                 SP TECH SOLUTIONS
               </div>
               <p className="text-gray-300 text-[15px] leading-[1.8] font-medium max-w-[90%]">
                 Your trusted platform for AI tools and software solutions.
               </p>
               <p className="text-gray-400 text-[14px] leading-[1.7] font-medium max-w-[90%]">
                 Discover, compare, and find the perfect tools for your projects, business, and growth.
               </p>
               <div className="flex gap-3 mt-2">
                 <a href="#" className="w-[42px] h-[42px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors shadow-sm">
                   <span className="font-bold text-sm">X</span>
                 </a>
                 <a href="#" className="w-[42px] h-[42px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors shadow-sm">
                   <span className="font-bold text-sm tracking-widest pl-1">in</span>
                 </a>
                 <a href="#" className="w-[42px] h-[42px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors shadow-sm">
                   <span className="font-bold text-sm">▶</span>
                 </a>
               </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-8">
               <div>
                 <p className="text-white font-bold tracking-[0.1em] text-[13px] uppercase mb-6 md:mb-8 bg-transparent">Explore</p>
                 <ul className="space-y-4 text-[15px] text-gray-300 font-medium">
                   <li><a href="/#store" onClick={scrollToStore} className="hover:text-white hover:underline decoration-white/30 transition-all cursor-pointer">All AI Tools</a></li>
                   <li><a href="/#store" onClick={scrollToStore} className="hover:text-white hover:underline decoration-white/30 transition-all cursor-pointer">Store</a></li>
                 </ul>
               </div>
               <div>
                 <p className="text-white font-bold tracking-[0.1em] text-[13px] uppercase mb-6 md:mb-8">Company</p>
                 <ul className="space-y-4 text-[15px] text-gray-300 font-medium">
                   <li><Link to="/about" className="hover:text-white hover:underline decoration-white/30 transition-all">About Us</Link></li>
                   <li><a href="https://wa.me/919552530324" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline decoration-white/30 transition-all">Contact</a></li>
                 </ul>
               </div>
               <div>
                 <p className="text-white font-bold tracking-[0.1em] text-[13px] uppercase mb-6 md:mb-8">Legal</p>
                 <ul className="space-y-4 text-[15px] text-gray-300 font-medium">
                   <li><Link to="/privacy" className="hover:text-white hover:underline decoration-white/30 transition-all">Privacy Policy</Link></li>
                   <li><Link to="/terms" className="hover:text-white hover:underline decoration-white/30 transition-all">Terms of Service</Link></li>
                   <li><Link to="/disclaimer" className="hover:text-white hover:underline decoration-white/30 transition-all">Disclaimer</Link></li>
                 </ul>
               </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center md:items-start gap-6 relative">
            <p className="text-[14px] text-gray-400 font-medium text-center md:text-left pt-2">
              © 2026 SP Tech Solutions · Built with <span className="text-red-500 mx-0.5">❤️</span> for AI explorers everywhere
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-3">
               <span className="px-4 py-2 border border-white/10 bg-white/5 rounded-[10px] text-[13px] text-gray-300 font-medium shadow-sm hover:bg-white/10 cursor-pointer transition-colors">AI Tools</span>
               <span className="px-4 py-2 border border-white/10 bg-white/5 rounded-[10px] text-[13px] text-gray-300 font-medium shadow-sm hover:bg-white/10 cursor-pointer transition-colors">Directory</span>
               <span className="px-4 py-2 border border-white/10 bg-white/5 rounded-[10px] text-[13px] text-gray-300 font-medium shadow-sm hover:bg-white/10 cursor-pointer transition-colors">AI Tools 2026</span>
               <span className="px-4 py-2 border border-white/10 bg-white/5 rounded-[10px] text-[13px] text-gray-300 font-medium shadow-sm hover:bg-white/10 cursor-pointer transition-colors">Free & Paid</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
