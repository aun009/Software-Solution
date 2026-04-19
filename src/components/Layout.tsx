import React, { useEffect, useRef, useState } from 'react';
import { Store, LucideIcon, LogIn, LogOut, Settings, Info, MessageCircle, Sun, Moon, Home, User as UserIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
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
  const navRef = useRef<HTMLDivElement>(null);
  const brandTextRef = useRef<HTMLSpanElement>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { scrollYProgress } = useScroll();
  
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
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 pl-2 group shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-blue-600/20">
              <span className="font-black text-sm text-white">S</span>
            </div>
            <span 
              ref={brandTextRef}
              className="text-base md:text-lg font-black tracking-tight text-gray-900 hidden sm:block"
            >
              Software Store
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-0.5 md:gap-2">
            <div className="flex items-center p-1 bg-gray-100 rounded-full gap-0.5">
              <NavLink to="/" icon={Home} label="Home" active={location.pathname === '/' && !location.hash} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
              <NavLink to="/about" icon={Info} label="About" active={location.pathname === '/about'} />
              <Link 
                to="/store" 
                className={cn(
                  "flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-300",
                  location.pathname === '/store'
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

            <div className="w-px h-8 bg-gray-200 mx-2 hidden md:block" />
            
            <div className="flex items-center pr-1">
              {user ? (
                <Link 
                  to="/profile"
                  className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-[11px] font-black text-white shadow-inner">
                    {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-[12px] font-bold text-gray-800 hidden sm:inline">
                    {user.displayName?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="px-5 py-2.5 bg-gray-900 text-white text-[12px] font-bold tracking-wide hover:bg-blue-600 transition-colors flex items-center gap-2 shrink-0 rounded-full shadow-md"
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
        {children}
      </main>

      {/* Footer (Simplified Pro) */}
      <footer className="py-24 border-t border-white/10 bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24 mb-24 uppercase font-bold tracking-widest text-[11px] max-w-4xl">
             <div>
               <p className="text-white mb-8">Our Products</p>
               <ul className="space-y-4 text-gray-400">
                 <li><Link to="/store" className="hover:text-blue-400 transition-colors">Softwares</Link></li>
                 <li><Link to="/#store" className="hover:text-blue-400 transition-colors">Trending</Link></li>
                 <li><Link to="/store" className="hover:text-blue-400 transition-colors">New Arrivals</Link></li>
               </ul>
             </div>
             <div>
               <p className="text-white mb-8">Solutions</p>
               <ul className="space-y-4 text-gray-400">
                 <li><Link to="/" className="hover:text-blue-400 transition-colors">Engineering</Link></li>
                 <li><Link to="/" className="hover:text-blue-400 transition-colors">Analytics</Link></li>
               </ul>
             </div>
             <div>
               <p className="text-white mb-8">Company</p>
               <ul className="space-y-4 text-gray-400">
                 <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                 <li><a href="https://wa.me/919552530324" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Contact</a></li>
               </ul>
             </div>
          </div>
          
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 group">
            <div className="flex flex-col gap-4">
               <div className="text-[20px] font-black tracking-tighter flex items-center gap-2 text-white">
                 <div className="w-6 h-6 border-2 border-white flex items-center justify-center">
                   <span className="text-xs">S</span>
                 </div>
                 SOFTWARE STORE
               </div>
               <p className="text-[11px] text-gray-500 font-mono">© 2026 SOFTWARE STORE PBC. ALL RIGHTS RESERVED.</p>
            </div>
            
            <div className="flex gap-12 text-[11px] text-gray-500 font-mono uppercase tracking-[0.3em]">
               <span className="flex items-center gap-2 animate-pulse"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> SYSTEM ACTIVE</span>
               <span>VER 8.4.2</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
