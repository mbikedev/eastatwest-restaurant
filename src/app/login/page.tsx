"use client";

import { useState } from "react";
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import Head from 'next/head';

export default function LoginPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Whitelist of allowed admin emails
      const ALLOWED_ADMIN_EMAILS = [
        'mbagnickg@gmail.com',
        'infos.east.west@gmail.com',
        'hannamoubayed@hotmail.com'
      ];

      // Check if user's email is in the whitelist
      const isAllowedEmail = ALLOWED_ADMIN_EMAILS.includes(data.user?.email?.toLowerCase() || '');

      if (!isAllowedEmail) {
        setError('Access denied. Your email is not authorized for admin access.');
        await supabase.auth.signOut();
        return;
      }

      // Redirect to admin page or the requested page
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect') || '/admin'
      router.push(redirect);
      
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use custom API route instead of Supabase SMTP
      const response = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          redirectTo: `${window.location.origin}/admin/reservations`,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to send magic link');
        return;
      }

      alert('Magic link sent to your email! Check your inbox.');
    } catch (error: any) {
      setError(error.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use custom API route instead of Supabase SMTP
      const response = await fetch('/api/auth/send-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          redirectTo: `${window.location.origin}/reset-password`,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to send reset email');
        return;
      }

      setResetEmailSent(true);
      setTimeout(() => {
        setShowResetPassword(false);
        setResetEmailSent(false);
      }, 5000);
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full p-8 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#A8D5BA]'}`}>
            East @ West
          </h1>
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            🔑 Admin Login
          </h2>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8D5BA] ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8D5BA] ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className={`p-3 border rounded text-sm ${
              theme === 'dark'
                ? 'bg-red-900/40 border-red-700 text-red-200'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setShowResetPassword(!showResetPassword)}
              className={`text-sm hover:underline ${theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#8BC5A8]'}`}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#A8D5BA',
              color: '#FFFFFF',
              opacity: loading ? 0.5 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            className="w-full px-4 py-3 rounded-lg hover:bg-[#8BC5A8] font-medium transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {showResetPassword && (
          <div className={`mt-4 p-4 rounded-lg border ${
            theme === 'dark'
              ? 'bg-blue-900/20 border-blue-700'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
              Reset Password
            </h3>
            <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
            {resetEmailSent ? (
              <div className={`p-3 rounded ${
                theme === 'dark'
                  ? 'bg-green-900/40 text-green-200'
                  : 'bg-green-50 text-green-700'
              }`}>
                ✅ Password reset email sent! Check your inbox.
              </div>
            ) : (
              <button
                onClick={handleResetPassword}
                disabled={loading || !email}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#FFFFFF',
                  opacity: (loading || !email) ? 0.5 : 1,
                  cursor: (loading || !email) ? 'not-allowed' : 'pointer'
                }}
                className="w-full px-4 py-2 rounded-lg font-medium transition-colors hover:bg-blue-700"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            )}
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={handleMagicLink}
            disabled={loading || !email}
            style={{
              backgroundColor: '#8BC5A8',
              color: '#FFFFFF',
              opacity: (loading || !email) ? 0.5 : 1,
              cursor: (loading || !email) ? 'not-allowed' : 'pointer'
            }}
            className="w-full px-4 py-3 rounded-lg hover:bg-[#7AB497] font-medium transition-colors"
          >
            {loading ? 'Sending...' : '📧 Send Magic Link'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            After signing in, you&apos;ll be redirected to the admin dashboard
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
