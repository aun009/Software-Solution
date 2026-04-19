import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Category } from '../types';
import { cn } from '../lib/utils';

interface SearchPanelProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (val: Category) => void;
}

const CATEGORIES: Category[] = ['All', 'AI Writing', 'Generative Art', 'Development', 'Data Science', 'Productivity'];

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

      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border",
              selectedCategory === category
                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900 shadow-sm"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
