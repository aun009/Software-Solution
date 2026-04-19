import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Chrome, ArrowRight, Loader2, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const reset = () => {
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: displayName }
          }
        });
        if (error) throw error;
        setSuccess('Secure registration broadcasted. Check your email inbox to verify your secure token.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      // Notice: onClose is effectively handled by redirect flow
    } catch (err: any) {
      setError(err.message || 'Google OAuth negotiation failed.');
      setLoading(false);
    }
  };

  const magicLinkAuth = async () => {
    if (!email) {
      setError("Provide an email address to dispatch a magic link.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin }
      });
      if (error) throw error;
      setSuccess("Magic Link dispatched exactly to your inbox. Awaiting your touch.");
    } catch (err: any) {
      setError(err.message || "Failed to dispatch magic link.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white border border-gray-100 rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <div className="flex gap-6 mb-4 border-b border-gray-100">
             <button 
               onClick={() => { setMode('signin'); reset(); }}
               className={`pb-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${mode === 'signin' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-900'}`}
             >
               Sign In
             </button>
             <button 
               onClick={() => { setMode('signup'); reset(); }}
               className={`pb-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${mode === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-900'}`}
             >
               Sign Up
             </button>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">
             {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 font-medium text-xs">
             {mode === 'signin' ? 'Sign in to access your account.' : 'Create your account to get started.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {mode === 'signup' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    required={mode === 'signup'}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
               {mode === 'signin' && (
                 <button type="button" onClick={magicLinkAuth} disabled={loading} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">
                   Magic Link
                 </button>
               )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}
          {success && <p className="text-emerald-600 text-xs font-bold bg-emerald-50 p-4 rounded-xl border border-emerald-100">{success}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0B0F19] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all disabled:opacity-50 shadow-lg shadow-black/10 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : (
              mode === 'signin' ? <><LogIn size={16} /> Sign In</> : <><Sparkles size={16} /> Create Account</>
            )}
          </button>

          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] font-black"><span className="bg-white px-4 text-gray-400">Or</span></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-bold flex items-center justify-center gap-3 hover:border-blue-500/30 hover:bg-gray-50 transition-all disabled:opacity-50 active:scale-95 text-sm"
          >
            <Chrome size={18} className="text-blue-500" />
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-[9px] text-gray-400 font-mono uppercase tracking-[0.5em]">
          Secured by Supabase
        </p>
      </motion.div>
    </div>
  );
};
