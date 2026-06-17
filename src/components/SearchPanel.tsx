import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  CheckCircle2,
  LayoutGrid,
  WandSparkles,
  Brush,
  Clapperboard,
  Megaphone,
  BookOpenCheck,
  Gamepad2,
  MoreHorizontal,
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


const CATEGORIES: Category[] = ['All', 'AI & Writing', 'Graphic Design', 'Video Editing', 'Marketing', 'Learning', 'Entertainment', 'Productivity'];

const CATEGORY_META: Record<Category, { Icon: LucideIcon; color: string; background: string; hoverGlow: string }> = {
  'All': {
    Icon: LayoutGrid,
    color: '#0f172a',
    background: 'rgba(15, 23, 42, 0.08)',
    hoverGlow: 'rgba(15, 23, 42, 0.16)'
  },
  'AI & Writing': {
    Icon: WandSparkles,
    color: '#8b5cf6',
    background: 'rgba(139, 92, 246, 0.12)',
    hoverGlow: 'rgba(139, 92, 246, 0.2)'
  },
  'Graphic Design': {
    Icon: Brush,
    color: '#2563eb',
    background: 'rgba(37, 99, 235, 0.12)',
    hoverGlow: 'rgba(37, 99, 235, 0.2)'
  },
  'Video Editing': {
    Icon: Clapperboard,
    color: '#f43f5e',
    background: 'rgba(244, 63, 94, 0.12)',
    hoverGlow: 'rgba(244, 63, 94, 0.2)'
  },
  'Marketing': {
    Icon: Megaphone,
    color: '#ea580c',
    background: 'rgba(234, 88, 12, 0.12)',
    hoverGlow: 'rgba(234, 88, 12, 0.2)'
  },
  'Learning': {
    Icon: BookOpenCheck,
    color: '#6366f1',
    background: 'rgba(99, 102, 241, 0.12)',
    hoverGlow: 'rgba(99, 102, 241, 0.2)'
  },
  'Entertainment': {
    Icon: Gamepad2,
    color: '#d946ef',
    background: 'rgba(217, 70, 239, 0.12)',
    hoverGlow: 'rgba(217, 70, 239, 0.2)'
  },
  'Productivity': {
    Icon: CheckCircle2,
    color: '#10b981',
    background: 'rgba(16, 185, 129, 0.12)',
    hoverGlow: 'rgba(16, 185, 129, 0.2)'
  },
};

const GRID_ITEMS = [
  { label: 'All',           category: 'All' as Category,           Icon: LayoutGrid,     color: '#2563eb', background: 'rgba(37, 99, 235, 0.13)'   },
  { label: 'AI & Writing',  category: 'AI & Writing' as Category,  Icon: WandSparkles,   color: '#7c3aed', background: 'rgba(124, 58, 237, 0.13)'  },
  { label: 'Graphic Design',category: 'Graphic Design' as Category,Icon: Brush,          color: '#0284c7', background: 'rgba(2, 132, 199, 0.13)'   },
  { label: 'Video Editing', category: 'Video Editing' as Category, Icon: Clapperboard,   color: '#e11d48', background: 'rgba(225, 29, 72, 0.13)'  },
  { label: 'Marketing',     category: 'Marketing' as Category,     Icon: Megaphone,      color: '#ea580c', background: 'rgba(234, 88, 12, 0.13)'  },
  { label: 'Learning',      category: 'Learning' as Category,      Icon: BookOpenCheck,  color: '#4f46e5', background: 'rgba(79, 70, 229, 0.13)'  },
  { label: 'Entertainment', category: 'Entertainment' as Category, Icon: Gamepad2,       color: '#c026d3', background: 'rgba(192, 38, 211, 0.13)' },
  { label: 'More',          category: 'More' as Category,          Icon: MoreHorizontal, color: '#475569', background: 'rgba(71, 85, 105, 0.11)'  }
];

const DROPDOWN_ITEMS = [
  { label: 'Productivity', category: 'Productivity' as Category, Icon: CheckCircle2, color: '#10b981', background: 'rgba(16, 185, 129, 0.08)' }
];

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
  const [dropdownPlacement, setDropdownPlacement] = useState<'top' | 'bottom'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      // If remaining viewport space below the button is less than 300px, pop upwards
      if (spaceBelow < 300) {
        setDropdownPlacement('top');
      } else {
        setDropdownPlacement('bottom');
      }
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

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

      {/* Mobile Category Dropdown Selector (Compact & space-saving) -- COMMENTED OUT BY CLIENT REQUEST */}
      {/*
      <div ref={dropdownRef} className="relative w-full max-w-[280px] mx-auto md:hidden px-2 z-30">
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between p-3.5 bg-white border-2 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(15,23,42,0.03)] select-none cursor-pointer"
          style={{ borderColor: activeMeta.color }}
        >
          <div className="flex items-center gap-3">
            <div
              className="relative grid place-items-center w-9 h-9 rounded-xl transition-all duration-300"
              style={{
                background: `${activeMeta.color}15`,
                color: activeMeta.color,
                boxShadow: `0 0 15px -3px ${activeMeta.color}25`
              }}
            >
              <ActiveIcon size={18} strokeWidth={2.5} className="relative z-10" />
            </div>
            <span className="text-[13px] font-bold text-slate-800 pt-[1px]">
              {selectedCategory === 'Marketing' ? 'Marketing' : selectedCategory === 'All' ? 'More' : selectedCategory}
            </span>
          </div>
          <div className="flex items-center text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
            <motion.div
              initial={{ opacity: 0, y: dropdownPlacement === 'top' ? 10 : -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: dropdownPlacement === 'top' ? 10 : -10, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={cn(
                "absolute left-0 right-0 p-2 bg-white border border-slate-200 rounded-2xl z-50 overflow-hidden max-h-[280px] overflow-y-auto scrollbar-none",
                dropdownPlacement === 'top' 
                  ? "bottom-full mb-2 shadow-[0_-20px_40px_rgba(15,23,42,0.15)]" 
                  : "mt-2 shadow-[0_20px_40px_rgba(15,23,42,0.15)]"
              )}
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
                      "w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left mb-1 last:mb-0 cursor-pointer select-none",
                      isSelected 
                        ? "bg-slate-50 font-black text-slate-900" 
                        : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="grid place-items-center w-7 h-7 rounded-lg"
                        style={{
                          background: meta.background,
                          color: meta.color
                        }}
                      >
                        <Icon size={14} strokeWidth={2.2} />
                      </div>
                      <span className="text-[12px] font-bold">
                        {category === 'Marketing' ? 'Marketing' : category === 'All' ? 'More' : category}
                      </span>
                    </div>
                    {isSelected && (
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      */}

      {/* Mobile Category Grid Selector (Premium Grid style - 4 in a row) */}
      <div className="w-full md:hidden px-2 z-30">
        <div className="grid grid-cols-4 gap-2 w-full max-w-sm mx-auto">
          {GRID_ITEMS.map((item) => {
            const isActiveCategory = selectedCategory === item.category;
            const isMoreItem = item.label === 'More';
            const isMoreActive = isMoreItem && (selectedCategory === 'Productivity');
            const isSelected = isMoreItem ? isMoreActive : isActiveCategory;
            const Icon = item.Icon;

            return (
              <button
                key={item.label}
                onClick={() => {
                  if (isMoreItem) {
                    setIsDropdownOpen(!isDropdownOpen);
                  } else {
                    setSelectedCategory(item.category);
                    setIsDropdownOpen(false);
                  }
                }}
                className={cn(
                  "relative group overflow-hidden flex flex-col items-center justify-center p-2 rounded-[18px] border transition-all duration-300 w-full h-[110px] cursor-pointer select-none",
                  isSelected
                    ? "bg-white border-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.06)] scale-[1.03] z-10"
                    : "bg-white border-slate-100 hover:border-slate-200 active:scale-95 shadow-[0_2px_8px_rgba(15,23,42,0.02)]"
                )}
              >
                {/* Icon Container with soft background circle */}
                <div
                  className="grid place-items-center w-12 h-12 rounded-full mb-2 transition-all duration-300"
                  style={{
                    background: isSelected ? `${item.color}15` : item.background,
                    color: item.color,
                    boxShadow: isSelected ? `0 0 12px -2px ${item.color}25` : 'none'
                  }}
                >
                  <Icon className="w-6 h-6 relative z-10" />
                </div>

                {/* Title text */}
                <span 
                  className={cn(
                    "text-[10px] font-semibold tracking-tight leading-tight text-center transition-colors duration-300",
                    isSelected ? "text-slate-900 font-bold" : "text-slate-600"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile-only Dropdown popup for "More" categories */}
        <AnimatePresence>
          {isDropdownOpen && (
            <div ref={dropdownRef} className="relative w-full max-w-sm mx-auto mt-2">
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute left-0 right-0 p-2 bg-white border border-slate-200 rounded-2xl z-50 shadow-[0_20px_40px_rgba(15,23,42,0.15)] overflow-hidden"
              >
                {DROPDOWN_ITEMS.map((other) => {
                  const isSelected = selectedCategory === other.category;
                  const Icon = other.Icon;
                  return (
                    <button
                      key={other.category}
                      onClick={() => {
                        setSelectedCategory(other.category);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left mb-1 last:mb-0 cursor-pointer select-none",
                        isSelected 
                          ? "bg-slate-50 text-slate-900" 
                          : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="grid place-items-center w-7 h-7 rounded-lg"
                          style={{
                            background: other.background,
                            color: other.color
                          }}
                        >
                          <Icon size={14} strokeWidth={2.2} />
                        </div>
                        <span className="text-[12px] font-medium text-slate-800">
                          {other.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: other.color }}
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop/Tablet Category Grid Cards (Wrapped in a beautiful mockup-style enclosing card) */}
      <div className="hidden md:block relative w-full">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.04 }}
          className="grid grid-cols-4 gap-4 w-full max-w-3xl mx-auto p-6 bg-white border border-slate-100/90 rounded-[32px] shadow-[0_20px_50px_rgba(15,23,42,0.04)] px-6"
        >
          {GRID_ITEMS.map((item, idx) => {
            const isActiveCategory = selectedCategory === item.category;
            const isMoreItem = item.label === 'More';
            const isMoreActive = isMoreItem && (selectedCategory === 'Productivity');
            const isSelected = isMoreItem ? isMoreActive : isActiveCategory;
            const Icon = item.Icon;

            return (
              <motion.button
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.03 + 0.1, type: "spring", stiffness: 180, damping: 18 }}
                key={item.label}
                onClick={() => {
                  if (isMoreItem) {
                    setIsDropdownOpen(!isDropdownOpen);
                  } else {
                    setSelectedCategory(item.category);
                    setIsDropdownOpen(false);
                  }
                }}
                className={cn(
                  "relative group overflow-hidden flex flex-col items-center justify-center p-4 rounded-[24px] border-2 transition-all duration-300 w-full h-36 cursor-pointer select-none",
                  isSelected
                    ? "bg-white border-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.08)] scale-[1.03] z-10"
                    : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-[0_10px_25px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:scale-[1.01]"
                )}
              >
                {/* Soft radial background glow on active/hover */}
                <div 
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                    isSelected && "opacity-100"
                  )}
                  style={{
                    background: `radial-gradient(circle at center, ${item.color}0d 0%, transparent 70%)`
                  }}
                />

                {/* Icon Container — square rounded box */}
                <div
                  className="relative grid place-items-center w-[72px] h-[72px] rounded-[20px] mb-3 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: isSelected ? `${item.color}30` : item.background,
                    color: item.color,
                    boxShadow: isSelected
                      ? `0 6px 20px -4px ${item.color}50, 0 0 0 3px ${item.color}20`
                      : `0 4px 12px -4px ${item.color}30`
                  }}
                >
                  <Icon size={32} strokeWidth={isSelected ? 2.8 : 2.5} className="relative z-10" />
                </div>

                {/* Title Text */}
                <span 
                  className={cn(
                    "text-[11px] sm:text-xs font-semibold tracking-[0.07em] uppercase transition-colors duration-300 leading-tight text-center px-1",
                    isSelected ? "text-slate-900 font-bold" : "text-slate-500 group-hover:text-slate-800"
                  )}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Desktop Dropdown popup for "More" categories */}
        <AnimatePresence>
          {isDropdownOpen && (
            <div ref={dropdownRef} className="absolute left-1/2 -translate-x-1/2 w-full max-w-sm mt-3 z-50">
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="p-2 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_40px_rgba(15,23,42,0.15)] overflow-hidden"
              >
                {DROPDOWN_ITEMS.map((other) => {
                  const isSelected = selectedCategory === other.category;
                  const Icon = other.Icon;
                  return (
                    <button
                      key={other.category}
                      onClick={() => {
                        setSelectedCategory(other.category);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left mb-1 last:mb-0 cursor-pointer select-none",
                        isSelected 
                          ? "bg-slate-50 text-slate-900 font-semibold" 
                          : "hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="grid place-items-center w-7 h-7 rounded-lg"
                          style={{
                            background: other.background,
                            color: other.color
                          }}
                        >
                          <Icon size={14} strokeWidth={2.2} />
                        </div>
                        <span className="text-[12px] text-slate-800">
                          {other.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: other.color }}
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
