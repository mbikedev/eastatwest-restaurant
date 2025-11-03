"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import Head from 'next/head';

export default function ResetPasswordPage() {
  const { theme } = useTheme();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we have a valid session from the password reset link
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Invalid or expired password reset link. Please request a new one.');
          return;
        }

        if (!session) {
          // Try to exchange the hash fragment for a session
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const type = hashParams.get('type');

          if (type === 'recovery' && accessToken) {
            // Let Supabase handle the token exchange automatically
            console.log('Password recovery link detected');
            // Wait a moment for Supabase to process the tokens
            setTimeout(async () => {
              const { data: { session: newSession } } = await supabase.auth.getSession();
              if (newSession) {
                setSessionReady(true);
              } else {
                setError('Could not establish session. Please try the reset link again.');
              }
            }, 500);
          } else {
            setError('Invalid password reset link. Please request a new password reset email.');
          }
        } else {
          setSessionReady(true);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setError('An error occurred. Please try again.');
      }
    };

    checkSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setError(error.message);
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
            🔐 Reset Your Password
          </h2>
        </div>

        {!sessionReady && !error && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-transparent border-[#A8D5BA] rounded-full animate-spin"></div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Verifying your reset link...
            </p>
          </div>
        )}

        {error && !success && (
          <div className={`p-4 rounded-lg mb-4 ${
            theme === 'dark'
              ? 'bg-red-900/40 border-red-700 text-red-200'
              : 'bg-red-50 border-red-200 text-red-700'
          } border`}>
            <p className="font-semibold">❌ {error}</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-3 text-sm underline hover:no-underline"
            >
              Return to Login
            </button>
          </div>
        )}

        {sessionReady && success ? (
          <div className={`p-4 rounded-lg ${
            theme === 'dark'
              ? 'bg-green-900/40 text-green-200'
              : 'bg-green-50 text-green-700'
          }`}>
            <p className="font-semibold">✅ Password updated successfully!</p>
            <p className="text-sm mt-2">Redirecting to login page...</p>
          </div>
        ) : sessionReady ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8D5BA] ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter new password (min 6 characters)"
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8D5BA] ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Confirm your new password"
                required
                minLength={6}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-[#A8D5BA] text-white rounded-lg hover:bg-[#8BC5A8] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        ) : null}

        {sessionReady && (
          <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/login')}
            className={`text-sm hover:underline ${theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#8BC5A8]'}`}
          >
            ← Back to Login
          </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
