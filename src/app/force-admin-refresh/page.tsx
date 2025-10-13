"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ForceAdminRefreshPage() {
  const [status, setStatus] = useState("Initializing...");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    forceRefreshAndTest();
  }, []);

  const forceRefreshAndTest = async () => {
    try {
      setStatus("🔄 Forcing complete session refresh...");
      
      // Step 1: Clear all local storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Step 2: Sign out completely
      setStatus("🚪 Signing out...");
      await supabase.auth.signOut();
      
      // Step 3: Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Check current session (should be null)
      setStatus("🔍 Checking current session...");
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        setStatus("⚠️ Still logged in, trying harder...");
        // Force reload the page to clear everything
        window.location.reload();
        return;
      }
      
      setStatus("✅ Successfully cleared session. Please sign in again.");
      
      // Redirect to login or home page after a delay
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      
    } catch (error) {
      console.error('Error during force refresh:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const manualSignIn = async () => {
    setStatus("🔑 Attempting to sign in...");
    try {
      // This will redirect to sign in
      window.location.href = '/auth/login'; // Adjust this to your actual login page
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">🔧 Force Admin Refresh</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm font-medium text-blue-800">Status:</p>
            <p className="text-blue-700">{status}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">What this page does:</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Clears all cached authentication data</li>
              <li>• Forces a complete sign out</li>
              <li>• Redirects you to sign in again</li>
              <li>• Your admin role will work after signing back in</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={forceRefreshAndTest}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              🔄 Force Refresh Again
            </button>
            
            <button
              onClick={manualSignIn}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              🔑 Go to Sign In
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              🏠 Go Home
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500 mt-4">
              After signing back in, try accessing 
              <a href="/admin/reservations" className="text-blue-500 hover:underline ml-1">
                /admin/reservations
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
