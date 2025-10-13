"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function DebugAuthPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('Current user:', user);
      console.log('User metadata:', user?.user_metadata);
      console.log('App metadata:', user?.app_metadata);
      setUser(user);
    } catch (error) {
      console.error('Error getting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const forceSignOut = async () => {
    try {
      // Clear all local storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      
      // Force reload the page
      window.location.href = '/';
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing token:', error);
      } else {
        console.log('Token refreshed:', data);
        checkUser();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Current User Info</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Role (user_metadata):</strong> {user.user_metadata?.role || 'none'}</p>
              <p><strong>Role (app_metadata):</strong> {user.app_metadata?.role || 'none'}</p>
              <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
              <p><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'never'}</p>
            </div>
          ) : (
            <p>No user found</p>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-3">Raw User Data</h2>
          <pre className="bg-black text-green-400 p-3 rounded overflow-auto text-xs">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="space-x-4">
          <button
            onClick={refreshToken}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Token
          </button>
          
          <button
            onClick={forceSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Force Sign Out
          </button>
          
          <button
            onClick={() => router.push('/admin/reservations')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Admin Access
          </button>
        </div>

        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <ul className="text-sm space-y-1">
            <li>• If role shows 'none', the JWT token hasn't been updated yet</li>
            <li>• Try "Refresh Token" first, then "Test Admin Access"</li>
            <li>• If that doesn't work, use "Force Sign Out" and sign back in</li>
            <li>• The database shows admin role is set, so this is a token refresh issue</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
