import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ShoppingBag, ArrowLeft, Search, HelpCircle } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to store section on the home page with search query
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}#store`);
      // Scroll to store
      setTimeout(() => {
        const el = document.getElementById('store');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 md:py-24 overflow-hidden bg-[#FAFAFC] dark:bg-[#0B0F19] transition-colors duration-300">
      
      {/* Decorative Interactive Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[35%] h-[35%] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[35%] h-[35%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        
        {/* Animated 3D-like Glowing '404' Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative select-none"
        >
          <h1 className="text-[120px] sm:text-[160px] md:text-[180px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 tracking-tighter drop-shadow-2xl">
            404
          </h1>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-3 -right-6 text-[32px] sm:text-[44px]"
          >
            🔍
          </motion.div>
        </motion.div>

        {/* Dynamic Status / Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Looks like you've drifted off track
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </motion.div>

        {/* Helpful Interactive Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 max-w-md w-full"
        >
          <form onSubmit={handleSearchSubmit} className="relative group">
            <input
              type="text"
              placeholder="Search for software tools, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow group-hover:border-slate-300 dark:group-hover:border-slate-700"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors group-hover:text-slate-600" />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              Search
            </button>
          </form>
        </motion.div>

        {/* Premium Action Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
        >
          {/* Action 1: Home */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-500/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <Home className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Back to Home</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Return to the landing page</p>
            </div>
          </div>

          {/* Action 2: Explore Store */}
          <div
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('store');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl cursor-pointer hover:border-purple-500 dark:hover:border-purple-500/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center transition-colors group-hover:bg-purple-600 group-hover:text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Explore Software</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Browse premium utility tools</p>
            </div>
          </div>
        </motion.div>

        {/* Go Back Link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => navigate(-1)}
          className="mt-10 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go back to previous page</span>
        </motion.button>

      </div>
    </div>
  );
};
