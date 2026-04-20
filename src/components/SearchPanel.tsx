import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid, PenTool, Palette, Film, Target, BookOpen, Camera, Gamepad2 } from 'lucide-react';
import { Category } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SearchPanelProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (val: Category) => void;
}

const CATEGORIES: Category[] = ['All', 'AI & Writing', 'Graphic Design', 'Video Editing', 'SEO & Marketing', 'Learning', 'Stock & Media', 'Entertainment'];

const CATEGORY_ICONS: Record<Category, React.ElementType> = {
  'All': LayoutGrid,
  'AI & Writing': PenTool,
  'Graphic Design': Palette,
  'Video Editing': Film,
  'SEO & Marketing': Target,
  'Learning': BookOpen,
  'Stock & Media': Camera,
  'Entertainment': Gamepad2
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
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
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
            className="flex-1 w-full bg-transparent text-gray-900 pl-4 pr-6 py-3.5 text-lg font-sans font-medium placeholder:text-gray-400 focus:outline-none"
          />
          <button className="px-8 py-3.5 bg-blue-600 text-white font-black rounded-full text-sm uppercase tracking-wider hover:bg-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.2)] transition-all shrink-0 active:scale-95">
            Search
          </button>
        </div>
      </div>

      {/* Category Grid (Compact on mobile, flexible on desktop) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-2 md:gap-3 w-full px-2 md:px-0"
      >
        {CATEGORIES.map((category, idx) => (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 + 0.1, type: "spring", stiffness: 200, damping: 20 }}
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-2 md:px-6 py-2.5 rounded-2xl md:rounded-full text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.05em] md:tracking-widest transition-all duration-300 border flex items-center justify-center min-w-0 md:min-w-[120px] shadow-sm transform hover:scale-[1.02] active:scale-95",
              selectedCategory === category
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white/80 backdrop-blur-sm text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"
            )}
          >
            {(() => {
              const Icon = CATEGORY_ICONS[category];
              return <Icon size={12} className="mr-1.5 md:mr-2 inline-block shrink-0" />;
            })()}
            <span className="truncate leading-none pt-[1px]">{category === 'SEO & Marketing' ? 'Marketing' : category === 'Stock & Media' ? 'Media' : category}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};
