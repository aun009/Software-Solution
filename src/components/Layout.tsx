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
}

const NavLink = ({ to, icon: Icon, label, active }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-2 px-3 md:px-6 py-2 rounded-full transition-all duration-300",
      active 
        ? "bg-blue-600/10 dark:bg-white/10 text-blue-600 dark:text-white border border-blue-600/20 dark:border-white/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-900/5 dark:hover:bg-white/5"
    )}
  >
    <Icon size={14} className="md:size-4" />
    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{label}</span>
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const brandTextRef = useRef<HTMLSpanElement>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Smoother ScrollTrigger implementation for Navbar
    const isMobile = window.innerWidth < 768;
    const isDark = theme === 'dark';
    const bgColor = isDark ? '5, 5, 5' : '255, 255, 255';
    const borderColor = isDark ? '255, 255, 255' : '0, 0, 0';
    
    const trigger = ScrollTrigger.create({
      start: "top -20",
      end: 200,
      onUpdate: (self) => {
        const progress = self.progress;
        
        gsap.to(navRef.current, {
          backgroundColor: `rgba(${bgColor}, ${progress * 0.95})`,
          backdropFilter: `blur(${progress * 24}px)`,
          height: isMobile ? (80 - progress * 16) : (96 - progress * 24),
          borderBottom: `1px solid rgba(${borderColor}, ${progress * 0.05})`,
          duration: 0.1,
          overwrite: 'auto'
        });

        if (!isMobile) {
          gsap.to(brandTextRef.current, {
            opacity: 1 - progress,
            x: -progress * 20,
            width: `${(1 - progress) * 100}%`,
            duration: 0.1,
            overwrite: 'auto'
          });
        }
      }
    });

    return () => trigger.kill();
  }, [location.pathname]);

  return (
    <div className="min-h-screen transition-colors duration-500 flex flex-col font-sans selection:bg-blue-500/20 antialiased overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-blue-600 dark:bg-white z-[120] origin-left"
        style={{ scaleX }}
      />

      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header 
        ref={navRef}
        className="fixed top-0 z-[110] w-full h-20 md:h-24 flex items-center transition-all duration-300 bg-transparent"
      >
        <nav className="max-w-7xl mx-auto px-4 md:px-6 w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <div className="w-8 h-8 md:w-9 md:h-9 border-2 border-gray-900 dark:border-white flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
              <span className="font-black text-sm md:text-lg dark:text-white text-gray-900 group-hover:dark:text-black group-hover:text-white">S</span>
            </div>
            <span 
              ref={brandTextRef}
              className="text-base md:text-xl font-black tracking-tighter dark:text-white text-gray-900 whitespace-nowrap overflow-hidden"
            >
              Software Store
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center gap-1 md:gap-3">
              <NavLink to="/" icon={Home} label="Home" active={location.pathname === '/' && !location.hash} />
              <NavLink to="/about" icon={Info} label="About" active={location.pathname === '/about'} />
              <NavLink to="/store" icon={Store} label="Products" active={location.pathname === '/store'} />
              {isAdmin && (
                <NavLink to="/admin" icon={Settings} label="Admin" active={location.pathname === '/admin'} />
              )}
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-white/10" />
            
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm dark:shadow-none"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="flex items-center gap-2 md:gap-4 ml-1 md:ml-4">
              {user ? (
                <Link 
                  to="/profile"
                  className="flex items-center gap-2 md:gap-3 pl-2 pr-3 md:pl-3 md:pr-4 py-1.5 md:py-2 bg-blue-600/10 border border-blue-500/20 rounded-2xl hover:bg-blue-600/20 transition-all group"
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-[10px] md:text-xs font-black text-white shadow-lg">
                    {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-500 hidden sm:inline">
                    {user.displayName?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="px-3 md:px-6 py-2 md:py-2.5 bg-gray-900 text-white dark:bg-white dark:text-black text-[9px] md:text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2 shrink-0 rounded-xl"
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
      <footer className="py-24 border-t border-white/5 dark:border-white/5 light:border-gray-100 bg-white dark:bg-[#080808] transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-24 uppercase font-bold tracking-widest text-[11px]">
             <div>
               <p className="dark:text-white text-gray-900 mb-8">Products</p>
               <ul className="space-y-4 text-gray-500 dark:text-gray-600">
                 <li><Link to="/store" className="hover:text-blue-600 transition-colors">Claude</Link></li>
                 <li><Link to="/store" className="hover:text-blue-600 transition-colors">Enterprise</Link></li>
                 <li><Link to="/store" className="hover:text-blue-600 transition-colors">API</Link></li>
               </ul>
             </div>
             <div>
               <p className="dark:text-white text-gray-900 mb-8">Solutions</p>
               <ul className="space-y-4 text-gray-500 dark:text-gray-600">
                 <li><Link to="/" className="hover:text-blue-600 transition-colors">Engineering</Link></li>
                 <li><Link to="/" className="hover:text-blue-600 transition-colors">Research</Link></li>
                 <li><Link to="/" className="hover:text-blue-600 transition-colors">Policy</Link></li>
               </ul>
             </div>
             <div>
               <p className="dark:text-white text-gray-900 mb-8">Resources</p>
               <ul className="space-y-4 text-gray-500 dark:text-gray-600">
                 <li><Link to="/" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                 <li><Link to="/" className="hover:text-blue-600 transition-colors">Events</Link></li>
                 <li><Link to="/" className="hover:text-blue-600 transition-colors">Community</Link></li>
               </ul>
             </div>
             <div>
               <p className="dark:text-white text-gray-900 mb-8">Company</p>
               <ul className="space-y-4 text-gray-500 dark:text-gray-600">
                 <li><Link to="/" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                 <li><Link to="/" className="hover:text-blue-600 transition-colors">Safety</Link></li>
                 <li><Link to="/" className="hover:text-blue-600 transition-colors">Press</Link></li>
               </ul>
             </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 dark:border-white/5 light:border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 group">
            <div className="flex flex-col gap-4">
               <div className="text-[20px] font-black tracking-tighter flex items-center gap-2 dark:text-white text-gray-900">
                 <div className="w-6 h-6 border-2 border-gray-900 dark:border-white flex items-center justify-center">
                   <span className="text-xs">S</span>
                 </div>
                 SOFTWARE STORE
               </div>
               <p className="text-[11px] text-gray-600 dark:text-gray-700 font-mono">© 2026 SOFTWARE STORE PBC. ALL RIGHTS RESERVED.</p>
            </div>
            
            <div className="flex gap-12 text-[11px] text-gray-700 font-mono uppercase tracking-[0.3em]">
               <span className="flex items-center gap-2 animate-pulse"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> SYSTEM ACTIVE</span>
               <span>VER 8.4.2</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
