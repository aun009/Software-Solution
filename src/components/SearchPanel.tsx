import React, { useState, useEffect } from 'react';
import {
  BookOpenCheck,
  Brush,
  Clapperboard,
  Gamepad2,
  Image,
  LayoutGrid,
  Megaphone,
  Search,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react';
import { Category } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SearchPanelProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (val: Category) => void;
}

const CATEGORIES: Category[] = ['All', 'AI & Writing', 'Graphic Design', 'Video Editing', 'SEO & Marketing', 'Learning', 'Stock & Media', 'Entertainment'];

const CATEGORY_META: Record<Category, { Icon: LucideIcon; color: string; background: string; hoverGlow: string }> = {
  'All': {
    Icon: LayoutGrid,
    color: '#0f172a',
    background: 'rgba(15,23,42,0.06)',
    hoverGlow: 'rgba(15,23,42,0.12)'
  },
  'AI & Writing': {
    Icon: WandSparkles,
    color: '#8b5cf6',
    background: 'rgba(139,92,246,0.08)',
    hoverGlow: 'rgba(139,92,246,0.16)'
  },
  'Graphic Design': {
    Icon: Brush,
    color: '#2563eb',
    background: 'rgba(37,99,235,0.08)',
    hoverGlow: 'rgba(37,99,235,0.16)'
  },
  'Video Editing': {
    Icon: Clapperboard,
    color: '#e11d48',
    background: 'rgba(225,29,72,0.08)',
    hoverGlow: 'rgba(225,29,72,0.16)'
  },
  'SEO & Marketing': {
    Icon: Megaphone,
    color: '#ea580c',
    background: 'rgba(234,88,12,0.08)',
    hoverGlow: 'rgba(234,88,12,0.16)'
  },
  'Learning': {
    Icon: BookOpenCheck,
    color: '#10b981',
    background: 'rgba(16,185,129,0.08)',
    hoverGlow: 'rgba(16,185,129,0.16)'
  },
  'Stock & Media': {
    Icon: Image,
    color: '#4f46e5',
    background: 'rgba(79,70,229,0.08)',
    hoverGlow: 'rgba(79,70,229,0.16)'
  },
  'Entertainment': {
    Icon: Gamepad2,
    color: '#db2777',
    background: 'rgba(219,39,119,0.08)',
    hoverGlow: 'rgba(219,39,119,0.16)'
  },
};

const PLACEHOLDERS = [
  "Search AI research...",
  "Search generative models...",
  "Find productivity software...",
  "Explore data science solutions...",
  "Discover enterprise tech..."
];

export const SearchPanel = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory 
}: SearchPanelProps) => {
  const [placeholderText, setPlaceholderText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    let typingSpeed = isDeleting ? 30 : 80;
    
    if (!isDeleting && placeholderText === PLACEHOLDERS[wordIndex]) {
       const timeout = setTimeout(() => setIsDeleting(true), 2500);
       return () => clearTimeout(timeout);
    } else if (isDeleting && placeholderText === "") {
       setIsDeleting(false);
       setWordIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
       return;
    }

    const timeout = setTimeout(() => {
       const currentFullText = PLACEHOLDERS[wordIndex];
       if (isDeleting) {
         setPlaceholderText(currentFullText.substring(0, placeholderText.length - 1));
       } else {
         setPlaceholderText(currentFullText.substring(0, placeholderText.length + 1));
       }
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, wordIndex]);

  const activeMeta = CATEGORY_META[selectedCategory];
  const ActiveIcon = activeMeta.Icon;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 md:gap-10">
      <div className="relative w-full group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 via-indigo-50 to-blue-100 rounded-full blur-md opacity-60 group-focus-within:opacity-100 transition duration-500"></div>
        <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[35px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2 pl-4 transition-all group-focus-within:border-blue-500/30 group-focus-within:shadow-[0_8px_30px_rgb(59,130,246,0.1)] group-focus-within:bg-white">
          <div className="text-gray-400 pl-2">
            <Search size={22} />
          </div>
          <input
            type="text"
            placeholder={placeholderText || "Search..."}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); if (e.target.value) setSelectedCategory('All' as Category); }}
            className="flex-1 w-full bg-transparent text-gray-900 pl-3 md:pl-4 pr-2 md:pr-6 py-3 text-base md:text-lg font-sans font-medium placeholder:text-gray-400 focus:outline-none"
          />
          <button className="hidden sm:block px-8 py-3.5 bg-blue-600 text-white font-black rounded-full text-sm uppercase tracking-wider hover:bg-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.2)] transition-all shrink-0 active:scale-95">
            Search
          </button>
        </div>
      </div>

      {/* Mobile Category Dropdown Selector (Compact & space-saving) */}
      <div className="relative w-full md:hidden px-2 z-30">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between p-4 bg-white border-2 rounded-2xl transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.02)] select-none cursor-pointer"
          style={{ borderColor: activeMeta.color }}
        >
          <div className="flex items-center gap-3">
            {/* Selection Icon Container */}
            <div
              className="relative grid place-items-center w-10 h-10 rounded-xl transition-all duration-300"
              style={{
                background: `${activeMeta.color}15`,
                color: activeMeta.color,
                boxShadow: `0 0 15px -3px ${activeMeta.color}25`
              }}
            >
              <ActiveIcon size={20} strokeWidth={2.5} className="relative z-10" />
            </div>
            <span className="text-[13px] font-black uppercase tracking-[0.1em] text-slate-900 pt-[2px]">
              {selectedCategory === 'SEO & Marketing' ? 'Marketing' : selectedCategory === 'Stock & Media' ? 'Media' : selectedCategory}
            </span>
          </div>
          <div className="flex items-center text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("transition-transform duration-300", isDropdownOpen && "rotate-180")}
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <>
              {/* Transparent backdrop for outside clicks */}
              <div 
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setIsDropdownOpen(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute left-2 right-2 mt-2 p-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-[0_20px_40px_rgba(15,23,42,0.15)] z-50 overflow-hidden max-h-[280px] overflow-y-auto scrollbar-none"
              >
                {CATEGORIES.map((category) => {
                  const meta = CATEGORY_META[category];
                  const Icon = meta.Icon;
                  const isSelected = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl transition-all text-left mb-1 last:mb-0 cursor-pointer select-none",
                        isSelected 
                          ? "bg-slate-50 font-black text-slate-900" 
                          : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="grid place-items-center w-8 h-8 rounded-lg"
                          style={{
                            background: meta.background,
                            color: meta.color
                          }}
                        >
                          <Icon size={16} strokeWidth={2.2} />
                        </div>
                        <span className="text-[12px] font-bold uppercase tracking-[0.08em]">
                          {category === 'SEO & Marketing' ? 'Marketing' : category === 'Stock & Media' ? 'Media' : category}
                        </span>
                      </div>
                      {isSelected && (
                        <div 
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop/Tablet Category Grid Cards (Hidden on mobile) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.04 }}
        className="hidden md:grid md:grid-cols-4 gap-4 w-full px-2 sm:px-0"
      >
        {CATEGORIES.map((category, idx) => {
          const meta = CATEGORY_META[category];
          const Icon = meta.Icon;
          const isActive = selectedCategory === category;

          return (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.03 + 0.1, type: "spring", stiffness: 180, damping: 18 }}
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "relative group overflow-hidden flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-300 w-full aspect-square sm:aspect-auto sm:h-32 shadow-[0_4px_15px_rgba(0,0,0,0.02)] cursor-pointer select-none border-slate-200/90",
                isActive
                  ? "bg-white shadow-[0_15px_30px_-5px_rgba(0,0,0,0.08)] scale-[1.03] z-10"
                  : "bg-white/95 backdrop-blur-sm hover:border-slate-300 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:scale-[1.01]"
              )}
              style={isActive ? { borderColor: meta.color, borderWidth: '2px' } : {}}
            >
              {/* Soft radial background glow on active/hover */}
              <div 
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                  isActive && "opacity-100"
                )}
                style={{
                  background: `radial-gradient(circle at center, ${meta.color}0d 0%, transparent 70%)`
                }}
              />

              {/* Icon Container with glowing background */}
              <div
                className="relative grid place-items-center w-12 h-12 rounded-2xl mb-3 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: isActive ? `${meta.color}15` : meta.background,
                  color: meta.color,
                  boxShadow: isActive ? `0 0 20px -2px ${meta.color}25` : 'none'
                }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.6 : 2.2} className="relative z-10" />
              </div>

              {/* Title Text */}
              <span 
                className={cn(
                  "text-[11px] sm:text-xs md:text-[13px] font-black uppercase tracking-[0.1em] transition-colors duration-300 leading-tight text-center mt-1 px-1",
                  isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                )}
              >
                {category === 'SEO & Marketing' ? 'Marketing' : category === 'Stock & Media' ? 'Media' : category}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};
