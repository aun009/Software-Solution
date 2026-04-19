import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Shield, Calendar, Package, LogOut, ArrowRight, Settings, Users, X } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, profile, logout, loading: authLoading } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen pt-32 md:pt-48 pb-24 px-6 selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="relative mb-16 p-10 md:p-16 rounded-[48px] bg-white/[0.02] border border-white/5 overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl">
                {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#050505] border border-white/10 rounded-2xl flex items-center justify-center text-blue-500">
                <Shield size={20} />
              </div>
            </div>
            
            <div className="text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
                  {user.displayName || 'System User'}
                </h1>
                <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${profile?.role === 'admin' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-gray-500/10 text-gray-500 border border-white/10'}`}>
                  {profile?.role || 'User'}
                </span>
              </div>
              <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} />
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-[40px] bg-white/[0.01] border border-white/5 space-y-6">
            <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.4em] mb-8">Account Details</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-gray-400 font-medium">
                <Calendar size={18} className="text-blue-500" />
                <span>Joined</span>
              </div>
              <span className="text-white font-bold">{new Date(user.metadata.creationTime || '').toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-gray-400 font-medium">
                <Users size={18} className="text-purple-500" />
                <span>Identity Status</span>
              </div>
              <span className="text-white font-bold">Verified</span>
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-white/[0.01] border border-white/5 space-y-6">
            <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.4em] mb-8">System Access</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-gray-400 font-medium">
                <Settings size={18} className="text-cyan-500" />
                <span>Permissions</span>
              </div>
              <span className="text-white font-bold uppercase text-xs">{profile?.role === 'admin' ? 'Administrative root' : 'Standard User'}</span>
            </div>

            {profile?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-4 text-blue-500 font-bold italic">
                  <span>Go to Dashboard</span>
                </div>
                <ArrowRight size={18} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {/* My Software Section (Placeholder) */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-10 flex items-center gap-4">
            <Package className="text-blue-500" />
            Active Software Suite
          </h2>
          <div className="p-12 text-center border border-dashed border-white/10 rounded-[48px] bg-white/[0.01]">
            <p className="text-gray-600 font-black uppercase tracking-[0.3em] italic text-sm mb-8">
              No deployments detected in your registry
            </p>
            <Link 
              to="/store"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-gray-200 transition-all active:scale-95 shadow-2xl"
            >
              Examine Catalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-10 border-t border-white/5 flex flex-col items-center">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase tracking-widest text-xs border border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-95 group"
          >
            <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
            Logout
          </button>
        </div>

        {/* Immersive Logout Modal */}
        <AnimatePresence>
          {showLogoutConfirm && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLogoutConfirm(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[48px] p-12 shadow-2xl overflow-hidden text-center"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="w-24 h-24 bg-red-500/10 rounded-[32px] flex items-center justify-center text-red-500 mx-auto mb-10 shadow-inner">
                  <LogOut size={40} />
                </div>

                <h2 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">
                  Confirm Logout?
                </h2>
                <p className="text-gray-500 font-medium text-lg leading-relaxed mb-12">
                  You are about to terminate your active administrative session. You will need to re-authenticate to access your software suite.
                </p>

                <div className="space-y-4">
                  <button 
                    onClick={() => logout()}
                    className="w-full py-6 bg-red-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-red-700 transition-all active:scale-95 shadow-2xl shadow-red-600/20"
                  >
                    Yes, Logout Now
                  </button>
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="w-full py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all active:scale-95"
                  >
                    Stay Authenticated
                  </button>
                </div>

                <p className="mt-12 text-[9px] text-gray-800 font-mono uppercase tracking-[0.5em]">
                  Security Protocol 72-A • Session Management
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
