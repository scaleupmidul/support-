/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Mail, Lock, Loader2, ArrowRight, CheckCircle } from "lucide-react";

interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("sabrina.yeasmin@gmail.com"); // Pre-filled default agent
  const [password, setPassword] = useState("••••••••");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 font-sans selection:bg-indigo-100">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-lg relative text-left space-y-6">
        
        {/* Brand Header */}
        <div className="space-y-2 text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-indigo-200">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 mt-3">SmartSupport AI</h1>
          <p className="text-xs text-gray-400">
            {isLogin ? "Sign in to manage your customer queues" : "Launch your automated AI customer support portal"}
          </p>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLogin && (
            <div>
              <label className="block font-semibold text-gray-600 mb-1.5">Business / Boutique Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Aura Fashion Bangladesh"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-gray-600 mb-1.5">Support Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-gray-600">Password</label>
              {isLogin && (
                <button type="button" className="text-[10px] text-indigo-600 font-bold hover:underline">
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-md font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-55"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {isLogin ? "Sign In to Dashboard" : "Register Store Portal"}
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex py-2 items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider justify-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-3">Or connect with</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* SSO Button */}
        <button
          onClick={onLogin}
          type="button"
          className="w-full py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-3xs flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 transition-colors"
        >
          {/* Unofficial Google SVG path */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google Single Sign-On
        </button>

        {/* Footer Toggle */}
        <div className="text-center text-[11px] text-gray-500 pt-2 border-t border-gray-50">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <button onClick={() => setIsLogin(false)} className="text-indigo-600 font-bold hover:underline">
                Create free trial portal
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button onClick={() => setIsLogin(true)} className="text-indigo-600 font-bold hover:underline">
                Sign in to store
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
