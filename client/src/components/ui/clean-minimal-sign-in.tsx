"use client" 

import * as React from "react"
import { useState } from "react";
import { LogIn, Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const SignIn2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signInWithOAuth } = useAuth();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || "Failed to sign in. Please check your credentials.");
        return;
      }
      
      // Success - user will be redirected by auth context
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setError("");
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        setError(error.message || `Failed to sign in with ${provider}`);
      }
    } catch (error) {
      setError(`An error occurred signing in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white rounded-xl z-1">
      <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl shadow-opacity-10 p-8 flex flex-col items-center border border-blue-100 text-black">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg shadow-opacity-5">
          <LogIn className="w-7 h-7 text-black" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          Sign in with email
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Access your StudyConnect account to connect with academic resources and community.
        </p>
        <div className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-signin-email"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSignIn()}
              data-testid="input-signin-password"
            />
          </div>
          <div className="w-full flex justify-between items-center">
            {error && (
              <div className="text-sm text-red-500 text-left flex-1" data-testid="error-message">{error}</div>
            )}
            <button className="text-xs hover:underline font-medium ml-auto" data-testid="button-forgot-password">
              Forgot password?
            </button>
          </div>
        </div>
        <button
          onClick={handleSignIn}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-signin"
        >
          {isSubmitting ? "Signing in..." : "Get Started"}
        </button>
        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
          <span className="mx-2 text-xs text-gray-400">Or sign in with</span>
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
        </div>
        <div className="flex gap-3 w-full justify-center mt-2">
          <button 
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow"
            data-testid="button-google-signin"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
          <button 
            onClick={() => handleSocialLogin('facebook')}
            className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow"
            data-testid="button-facebook-signin"
          >
            <img
              src="https://www.svgrepo.com/show/448224/facebook.svg"
              alt="Facebook"
              className="w-6 h-6"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow">
            <img
              src="https://www.svgrepo.com/show/511330/apple-173.svg"
              alt="Apple"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export { SignIn2 };