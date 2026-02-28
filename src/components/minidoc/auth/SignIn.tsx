'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { createSession } from '@/lib/minidoc/storage';
import { MiniDocLogo3D } from '../icons/CustomIcons';

interface SignInProps {
  onNavigate: (page: string) => void;
}

const SignIn: React.FC<SignInProps> = ({ onNavigate }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const performLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      createSession(email || 'user@minidoc.app');
      setIsLoading(false);
      onNavigate('dashboard');
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin();
  };

  const handleGoogleSignIn = () => {
    setEmail('google_user@gmail.com');
    performLogin();
  };

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden touch-none">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-neutral-100 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-neutral-100 rounded-full blur-[80px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[380px] px-4 relative z-10 flex flex-col max-h-[100dvh]"
      >
        <div className="w-full flex justify-start mb-3">
          <motion.button 
            onClick={() => onNavigate('home')}
            whileHover={{ x: -2 }}
            className="group flex items-center text-xs font-medium text-neutral-500 hover:text-black transition-colors py-2"
          >
            <ArrowLeft size={14} className="mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </motion.button>
        </div>

        <motion.div 
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="bg-white border border-neutral-200 shadow-xl rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>

          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3">
              <MiniDocLogo3D size={48} />
            </div>
            <h1 className="text-2xl font-medium text-black tracking-tight mb-1">
              {isSignUp ? 'Create account' : 'Welcome back'}
            </h1>
            <p className="text-xs text-neutral-500">
              {isSignUp ? 'Start your journey with Mini Doc today.' : 'Please enter your details to sign in.'}
            </p>
          </div>

          <motion.button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-white border border-neutral-200 text-neutral-700 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-neutral-300 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </motion.button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="px-2 bg-white text-neutral-400 font-medium uppercase tracking-wider">or email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-neutral-500 ml-1 uppercase tracking-wide">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-neutral-400 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-neutral-200 rounded-xl text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm bg-white"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-black text-white font-medium py-3 px-4 rounded-xl hover:bg-neutral-800 transition-all transform flex items-center justify-center gap-2 mt-2 cursor-pointer text-sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-5 text-center space-y-3">
            <div className="text-xs text-neutral-500">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setIsSignUp(false)} className="text-black font-medium hover:underline">
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <button onClick={() => setIsSignUp(true)} className="text-black font-medium hover:underline">
                    Sign up
                  </button>
                </>
              )}
            </div>
            
            <div className="flex justify-center items-center gap-3 text-[10px] text-neutral-400 pt-3 border-t border-neutral-200">
              <button onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="hover:text-neutral-600 transition-colors">Privacy Policy</button>
              <span>•</span>
              <button onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="hover:text-neutral-600 transition-colors">Terms of Service</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SignIn;
