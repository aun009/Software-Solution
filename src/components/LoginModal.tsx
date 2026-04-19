import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Smartphone, Chrome, ArrowRight, Loader2, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../lib/firebase';
import { 
  fetchSignInMethodsForEmail, 
  signInWithEmailAndPassword, 
  sendSignInLinkToEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<'email' | 'choice' | 'password' | 'signup-details'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setStep('email');
    setError('');
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  const formatError = (err: any) => {
    if (err.code === 'auth/operation-not-allowed') {
      return 'Email/Password sign-in is not enabled in your Firebase Project. Please enable it in the Firebase Console (Authentication > Sign-in method).';
    }
    return err.message;
  };

  const handleEmailNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      if (mode === 'signin') {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          setStep('choice');
        } else {
          setError('No account found with this email. Would you like to create one? Please switch to the "Sign Up" tab above.');
        }
      } else {
        // Sign up flow
        setStep('signup-details');
      }
    } catch (err: any) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err: any) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Create profile
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: user.email === 'arunmahajan9240@gmail.com' ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      });
      onClose();
    } catch (err: any) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled. Please complete the sign-in process in the popup window.');
      } else if (err.code === 'auth/blocked-at-runtime') {
        setError('Popup blocked. Please allow popups for this site.');
      } else {
        setError(formatError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async () => {
    setLoading(true);
    setError('');
    const actionCodeSettings = {
      url: window.location.origin,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      alert('A magic link has been sent to your inbox! Check your email to sign in.');
      onClose();
    } catch (err: any) {
      setError(formatError(err));
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
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white border border-gray-100 rounded-[40px] p-10 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-12">
          <div className="flex gap-8 mb-4 border-b border-gray-100">
             <button 
               onClick={() => { setMode('signin'); reset(); }}
               className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${mode === 'signin' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
             >
               Sign In
             </button>
             <button 
               onClick={() => { setMode('signup'); reset(); }}
               className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${mode === 'signup' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
             >
               Sign Up
             </button>
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-3">
             {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 font-medium">
             {mode === 'signin' ? 'Unlock your administrative and user suite.' : 'Join the elite software exchange today.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.form 
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleEmailNext}
              className="space-y-8"
            >
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 pl-14 pr-4 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500/30 transition-all font-bold"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100">{error}</p>}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>Continue <ArrowRight size={18} /></>
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] font-black"><span className="bg-white px-5 text-gray-400">Enterprise Auth</span></div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-5 bg-white border border-gray-200 rounded-2xl text-gray-900 font-bold flex items-center justify-center gap-4 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                <Chrome size={20} className="text-blue-500" />
                Google Authentication
              </button>
            </motion.form>
          )}

          {step === 'choice' && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <p className="text-gray-500 text-sm mb-8 font-medium italic">Identification confirmed for <span className="text-gray-900 font-bold">{email}</span>. How shall we proceed?</p>
              
              <button 
                onClick={() => setStep('password')}
                className="w-full p-8 bg-gray-50 border border-gray-100 rounded-3xl flex items-center gap-6 hover:border-blue-500/30 hover:bg-white transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                  <Lock size={24} />
                </div>
                <div className="text-left">
                  <div className="text-gray-900 font-black uppercase tracking-tight text-lg">Use Password</div>
                  <div className="text-gray-400 text-xs font-medium">Standard cryptographic verification</div>
                </div>
              </button>

              <button 
                onClick={handleOTPLogin}
                className="w-full p-8 bg-gray-50 border border-gray-100 rounded-3xl flex items-center gap-6 hover:border-purple-500/30 hover:bg-white transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shadow-sm">
                  <Smartphone size={24} />
                </div>
                <div className="text-left">
                  <div className="text-gray-900 font-black uppercase tracking-tight text-lg">Magic Link</div>
                  <div className="text-gray-400 text-xs font-medium">Passwordless direct-to-inbox entry</div>
                </div>
              </button>

              <button 
                onClick={() => setStep('email')}
                className="w-full py-6 text-gray-400 hover:text-gray-900 text-[10px] font-black uppercase tracking-[0.4em] transition-colors"
              >
                Return to previous step
              </button>
            </motion.div>
          )}

          {step === 'password' && (
            <motion.form 
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handlePasswordLogin}
              className="space-y-8"
            >
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoFocus
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 pl-14 pr-4 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500/30 transition-all font-bold"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100">{error}</p>}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><LogIn size={18} /> Authorize Session</>}
              </button>

              <button 
                type="button"
                onClick={() => setStep('choice')}
                className="w-full py-6 text-gray-400 hover:text-gray-900 text-[10px] font-black uppercase tracking-[0.4em] transition-colors"
              >
                Difficulty logging in?
              </button>
            </motion.form>
          )}

          {step === 'signup-details' && (
            <motion.form 
              key="signup-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSignup}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500/30 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Choose Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500/30 transition-all font-bold"
                />
              </div>

              {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100">{error}</p>}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><UserPlus size={18} /> Establish Identity</>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-12 text-center text-[9px] text-gray-400 font-mono uppercase tracking-[0.5em]">
          End-to-End Cryptographic Security • Software Store PBC
        </p>
      </motion.div>
    </div>
  );
};
