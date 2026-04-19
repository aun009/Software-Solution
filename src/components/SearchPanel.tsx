import React from 'react';
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

export const SearchPanel = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory 
}: SearchPanelProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      <div className="relative w-full group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
        <div className="relative flex items-center">
          <div className="absolute left-6 text-gray-500">
            <Search size={24} />
          </div>
          <input
            type="text"
            placeholder="Search AI research and tools catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-18 bg-[#111]/80 dark:bg-[#111]/80 light:bg-gray-50 backdrop-blur-xl border border-white/10 dark:border-white/10 light:border-gray-200 rounded-2xl pl-16 pr-6 dark:text-white text-gray-900 text-lg font-medium placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 dark:focus:border-white/20 light:focus:ring-2 light:focus:ring-blue-500/10 transition-all shadow-xl dark:shadow-2xl"
          />
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
                ? "bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white shadow-xl"
                : "bg-white/5 dark:bg-white/5 light:bg-gray-50 text-gray-500 border-white/5 dark:border-white/5 light:border-gray-200 hover:border-blue-500/20 dark:hover:text-white light:hover:text-gray-900"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
