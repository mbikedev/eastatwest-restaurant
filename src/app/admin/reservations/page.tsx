"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { Reservation } from '@/types/supabase';
import { sendApprovalNotification } from '@/lib/emailNotifications';
import { motion } from 'framer-motion';

interface ReservationWithConflicts extends Reservation {
  hasConflicts?: boolean;
  conflictingReservations?: Reservation[];
}

interface Stats {
  totalPending: number;
  approvedToday: number;
  rejectedToday: number;
  upcomingReservations: number;
  totalGuests: number;
  conflictsDetected: number;
}

export default function AdminReservationsPage() {
  const { theme } = useTheme();
  const [reservations, setReservations] = useState<ReservationWithConflicts[]>([]);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [guestFilter, setGuestFilter] = useState('all');

  // Check if user is staff
  useEffect(() => {
    const checkStaffAccess = async () => {
      try {
        // First try to refresh the session to get updated user metadata
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.log('Token refresh failed, using current session:', refreshError.message);
        }

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsStaff(false);
          setAuthLoading(false);
          return;
        }

        // Check if user has admin role in JWT or if using service role
        const userRole = user.user_metadata?.role || user.app_metadata?.role;
        const isAdmin = userRole === 'admin';
        
        console.log('Auth check - User:', user.email, 'Role:', userRole, 'IsAdmin:', isAdmin);
        
        setIsStaff(isAdmin);
      } catch (error) {
        console.error('Error checking staff access:', error);
        setIsStaff(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkStaffAccess();
  }, []);

  // Fallback function to detect overlapping reservations (client-side)
  const detectConflicts = (reservation: Reservation, allReservations: Reservation[]): Reservation[] => {
    return allReservations.filter(other => {
      if (other.id === reservation.id) return false;
      if (other.date !== reservation.date) return false;
      if (other.status === 'cancelled') return false;

      // Check for time overlap
      const startTime1 = new Date(`2000-01-01 ${reservation.start_time}`);
      const endTime1 = new Date(`2000-01-01 ${reservation.end_time}`);
      const startTime2 = new Date(`2000-01-01 ${other.start_time}`);
      const endTime2 = new Date(`2000-01-01 ${other.end_time}`);

      // Two time ranges overlap if start1 < end2 AND start2 < end1
      return startTime1 < endTime2 && startTime2 < endTime1;
    });
  };

  // Fetch pending reservations
  const fetchPendingReservations = useCallback(async () => {
    if (!isStaff) return;

    try {
      setLoading(true);

      // First, get all reservations to check for conflicts and stats
      const { data: fetchedAllReservations, error: allError } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (allError) {
        console.error('Error fetching all reservations:', allError);
        toast.error('Failed to fetch reservations');
        return;
      }

      setAllReservations(fetchedAllReservations || []);

      // Get pending reservations
      const { data: pendingReservations, error: pendingError } = await supabase
        .from('reservations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (pendingError) {
        console.error('Error fetching pending reservations:', pendingError);
        toast.error('Failed to fetch pending reservations');
        return;
      }

      // Add conflict detection to pending reservations
      const reservationsWithConflicts: ReservationWithConflicts[] = (pendingReservations || []).map(reservation => {
        const conflicts = detectConflicts(reservation, fetchedAllReservations || []);
        return {
          ...reservation,
          hasConflicts: conflicts.length > 0,
          conflictingReservations: conflicts
        };
      });

      console.log(`📊 Fetched ${reservationsWithConflicts.length} pending reservations for display`);
      setReservations(reservationsWithConflicts);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [isStaff]);

  useEffect(() => {
    if (isStaff) {
      fetchPendingReservations();
    }
  }, [isStaff, fetchPendingReservations]);

  // Calculate statistics
  const stats = useMemo<Stats>(() => {
    const today = new Date().toISOString().split('T')[0];

    const approvedToday = allReservations.filter(r =>
      r.status === 'confirmed' &&
      new Date(r.created_at).toISOString().split('T')[0] === today
    ).length;

    const rejectedToday = allReservations.filter(r =>
      r.status === 'cancelled' &&
      new Date(r.created_at).toISOString().split('T')[0] === today
    ).length;

    const upcomingReservations = allReservations.filter(r =>
      r.status === 'confirmed' &&
      new Date(r.date) >= new Date()
    ).length;

    const totalGuests = reservations.reduce((sum, r) => sum + (r.guests || 0), 0);

    const conflictsDetected = reservations.filter(r => r.hasConflicts).length;

    return {
      totalPending: reservations.length,
      approvedToday,
      rejectedToday,
      upcomingReservations,
      totalGuests,
      conflictsDetected
    };
  }, [reservations, allReservations]);

  // Filter reservations based on search and filters
  const filteredReservations = useMemo(() => {
    return reservations.filter(reservation => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        reservation.name.toLowerCase().includes(searchLower) ||
        reservation.email.toLowerCase().includes(searchLower) ||
        reservation.phone.toLowerCase().includes(searchLower);

      // Date filter
      const matchesDate = !dateFilter || reservation.date === dateFilter;

      // Guest filter
      const matchesGuests = guestFilter === 'all' ||
        (guestFilter === 'small' && reservation.guests <= 2) ||
        (guestFilter === 'medium' && reservation.guests >= 3 && reservation.guests <= 5) ||
        (guestFilter === 'large' && reservation.guests >= 6);

      return matchesSearch && matchesDate && matchesGuests;
    });
  }, [reservations, searchTerm, dateFilter, guestFilter]);

  // Handle approve reservation
  const handleApprove = async (reservationId: string) => {
    setProcessingIds(prev => new Set(prev).add(reservationId));
    
    try {
      // Find the reservation to get its details for email
      const reservation = reservations.find(r => r.id === reservationId);
      if (!reservation) {
        toast.error('Reservation not found');
        return;
      }

      // Update the reservation status in database
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'confirmed' })
        .eq('id', reservationId);

      if (error) {
        console.error('Error approving reservation:', error);
        toast.error('Failed to approve reservation');
        return;
      }

      // Send approval notification emails to all staff
      try {
        const emailResult = await sendApprovalNotification(reservation, 'approved');
        if (emailResult.success) {
          console.log('Approval notification emails sent:', emailResult.message);
        } else {
          console.warn('Failed to send approval notification emails:', emailResult.error);
          // Don't show error to user as the reservation was still approved
        }
      } catch (emailError) {
        console.warn('Email notification error:', emailError);
        // Don't show error to user as the reservation was still approved
      }

      toast.success('Reservation approved successfully! Staff notifications sent.');
      // Refresh the list
      fetchPendingReservations();

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(reservationId);
        return newSet;
      });
    }
  };

  // Handle reject reservation
  const handleReject = async (reservationId: string) => {
    setProcessingIds(prev => new Set(prev).add(reservationId));
    
    try {
      // Find the reservation to get its details for email
      const reservation = reservations.find(r => r.id === reservationId);
      if (!reservation) {
        toast.error('Reservation not found');
        return;
      }

      // Update the reservation status in database
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);

      if (error) {
        console.error('Error rejecting reservation:', error);
        toast.error('Failed to reject reservation');
        return;
      }

      // Send rejection notification emails to all staff
      try {
        const emailResult = await sendApprovalNotification(reservation, 'rejected');
        if (emailResult.success) {
          console.log('Rejection notification emails sent:', emailResult.message);
        } else {
          console.warn('Failed to send rejection notification emails:', emailResult.error);
          // Don't show error to user as the reservation was still rejected
        }
      } catch (emailError) {
        console.warn('Email notification error:', emailError);
        // Don't show error to user as the reservation was still rejected
      }

      toast.success('Reservation rejected successfully! Staff notifications sent.');
      // Refresh the list
      fetchPendingReservations();

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(reservationId);
        return newSet;
      });
    }
  };

  // Handle delete reservation
  const handleDelete = async (reservationId: string) => {
    setProcessingIds(prev => new Set(prev).add(reservationId));
    
    try {
      // Find the reservation to get its details for confirmation
      const reservation = reservations.find(r => r.id === reservationId);
      if (!reservation) {
        toast.error('Reservation not found');
        return;
      }

      // Delete the reservation from database
      console.log(`🗑️ Deleting reservation: ${reservation.name} (ID: ${reservationId})`);
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);

      if (error) {
        console.error('Error deleting reservation:', error);
        toast.error('Failed to delete reservation');
        return;
      }

      console.log('✅ Database deletion successful');

      toast.success(`Reservation for ${reservation.name} deleted successfully`);
      // Clear the confirmation state
      setDeleteConfirmId(null);
      // Force a complete refresh by updating the state immediately
      setReservations(prev => prev.filter(r => r.id !== reservationId));
      // Also refresh from database to ensure consistency
      setTimeout(() => {
        fetchPendingReservations();
      }, 100);

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(reservationId);
        return newSet;
      });
    }
  };

  // Loading states
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Checking access...</div>
      </div>
    );
  }

  if (!isStaff) {
    const handleForceSignOut = async () => {
      try {
        localStorage.clear();
        sessionStorage.clear();
        await supabase.auth.signOut();
        window.location.href = '/';
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    const handleRefreshToken = async () => {
      try {
        await supabase.auth.refreshSession();
        window.location.reload();
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p>You don&apos;t have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Staff access required.</p>
          
          <div className="mt-6 space-y-3">
            <p className="text-xs text-gray-600">
              If you should have admin access, try refreshing your session:
            </p>
            <div className="space-x-3">
              <button
                onClick={handleRefreshToken}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Refresh Session
              </button>
              <button
                onClick={handleForceSignOut}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                Sign Out & Try Again
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <a href="/debug-auth" className="text-blue-500 hover:underline">
                Debug Authentication
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 ${theme === "dark" ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black mt-16"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-[#A8D5BA] via-[#8FBC8F] to-[#A8D5BA] bg-clip-text text-transparent">
            Reservation Dashboard
          </h1>
          <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage and monitor all pending reservations
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
        >
          {/* Pending Reservations */}
          <div className={`relative overflow-hidden rounded-2xl p-6 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30'
              : 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">⏳</div>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                {stats.totalPending}
              </div>
            </div>
            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
              Pending
            </div>
          </div>

          {/* Approved Today */}
          <div className={`relative overflow-hidden rounded-2xl p-6 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30'
              : 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">✅</div>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {stats.approvedToday}
              </div>
            </div>
            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
              Approved Today
            </div>
          </div>

          {/* Rejected Today */}
          <div className={`relative overflow-hidden rounded-2xl p-6 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30'
              : 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">❌</div>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                {stats.rejectedToday}
              </div>
            </div>
            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
              Rejected Today
            </div>
          </div>

          {/* Upcoming Reservations */}
          <div className={`relative overflow-hidden rounded-2xl p-6 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30'
              : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">📅</div>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                {stats.upcomingReservations}
              </div>
            </div>
            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
              Upcoming
            </div>
          </div>

          {/* Total Guests */}
          <div className={`relative overflow-hidden rounded-2xl p-6 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#A8D5BA]/20 to-[#8FBC8F]/20 border border-[#A8D5BA]/30'
              : 'bg-gradient-to-br from-[#A8D5BA]/10 to-[#8FBC8F]/20 border border-[#A8D5BA]/50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">👥</div>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#8FBC8F]'}`}>
                {stats.totalGuests}
              </div>
            </div>
            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-[#A8D5BA]' : 'text-[#8FBC8F]'}`}>
              Total Guests
            </div>
          </div>

          {/* Conflicts */}
          <div className={`relative overflow-hidden rounded-2xl p-6 ${
            stats.conflictsDetected > 0
              ? theme === 'dark'
                ? 'bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/30'
                : 'bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200'
              : theme === 'dark'
                ? 'bg-gradient-to-br from-gray-700/20 to-gray-800/20 border border-gray-600/30'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">⚠️</div>
              <div className={`text-3xl font-bold ${
                stats.conflictsDetected > 0
                  ? theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stats.conflictsDetected}
              </div>
            </div>
            <div className={`text-sm font-medium ${
              stats.conflictsDetected > 0
                ? theme === 'dark' ? 'text-orange-300' : 'text-orange-700'
                : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Conflicts
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-2xl p-6 mb-8 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700'
              : 'bg-white border border-gray-200 shadow-lg'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                🔍 Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, email, or phone..."
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:border-[#A8D5BA] ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Date Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                📅 Date Filter
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:border-[#A8D5BA] ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Guest Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                👥 Guest Count
              </label>
              <select
                value={guestFilter}
                onChange={(e) => setGuestFilter(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:border-[#A8D5BA] ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Sizes</option>
                <option value="small">Small (1-2)</option>
                <option value="medium">Medium (3-5)</option>
                <option value="large">Large (6+)</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || dateFilter || guestFilter !== 'all') && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('');
                  setGuestFilter('all');
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>

        {/* Email Notification Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`mb-6 p-6 rounded-2xl border-2 ${
            theme === 'dark'
              ? 'bg-blue-900/20 border-blue-500/30'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">📧</span>
            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
              Email Notifications Active
            </h3>
          </div>
          <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
            When you approve or reject a reservation, email notifications will be automatically sent to all staff members:
            <span className="font-mono text-xs block mt-1">contact@eastatwest.com, mbagnickg@gmail.com, infos.east.west@gmail.com</span>
          </p>
          <div className={`text-sm p-3 rounded-xl ${
            theme === 'dark' ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-700'
          }`}>
            <span className="font-semibold">⚠️ Delete Action:</span> The delete button permanently removes reservations from the database.
            No email notifications are sent for deletions.
          </div>
        </motion.div>
        
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className={`text-xl font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading reservations...
            </div>
          </motion.div>
        ) : (
          <>
            {reservations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">📭</div>
                <div className={`text-xl font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No pending reservations
                </div>
              </motion.div>
            ) : (
              <>
                {/* Results count */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`mb-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Showing {filteredReservations.length} of {reservations.length} pending reservations
                </motion.div>

                {filteredReservations.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <div className={`text-xl font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      No reservations match your filters
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {filteredReservations.map((reservation, index) => (
                      <motion.div
                        key={reservation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`relative p-8 rounded-2xl border-2 shadow-xl transition-all hover:shadow-2xl ${
                          reservation.hasConflicts
                            ? theme === 'dark'
                              ? "border-red-500 bg-gradient-to-br from-red-900/30 to-red-800/20"
                              : "border-red-400 bg-gradient-to-br from-red-50 to-orange-50"
                            : theme === 'dark'
                              ? "border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50"
                              : "border-gray-200 bg-white"
                        }`}
                      >
                        {/* Conflict warning */}
                        {reservation.hasConflicts && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`mb-6 p-5 rounded-xl border-2 ${
                              theme === 'dark'
                                ? 'bg-red-900/60 border-red-500'
                                : 'bg-red-100 border-red-400'
                            }`}
                          >
                            <h4 className={`font-bold flex items-center text-lg mb-2 ${
                              theme === 'dark' ? 'text-red-200' : 'text-red-800'
                            }`}>
                              ⚠️ TIME CONFLICT DETECTED
                            </h4>
                            <p className={`text-sm mb-3 ${
                              theme === 'dark' ? 'text-red-300' : 'text-red-700'
                            }`}>
                              This reservation overlaps with {reservation.conflictingReservations?.length} other reservation(s) on the same date.
                            </p>
                            {reservation.conflictingReservations && reservation.conflictingReservations.length > 0 && (
                              <div className={`mt-3 p-3 rounded-lg ${
                                theme === 'dark' ? 'bg-red-900/40' : 'bg-red-50'
                              }`}>
                                <p className={`text-xs font-semibold mb-2 ${
                                  theme === 'dark' ? 'text-red-200' : 'text-red-800'
                                }`}>
                                  Conflicting reservations:
                                </p>
                                {reservation.conflictingReservations.map(conflict => (
                                  <div
                                    key={conflict.id}
                                    className={`text-xs ml-2 mt-1 ${
                                      theme === 'dark' ? 'text-red-300' : 'text-red-700'
                                    }`}
                                  >
                                    • {conflict.name} ({conflict.start_time} - {conflict.end_time}) - {conflict.guests} guests - Status: {conflict.status}
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                          {/* Customer Info */}
                          <div className={`p-5 rounded-xl ${
                            theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">👤</span>
                              <h3 className={`text-lg font-bold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {reservation.name}
                              </h3>
                            </div>
                            <div className="space-y-2">
                              <p className={`text-sm flex items-center gap-2 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                <span>📧</span>
                                <span className="break-all">{reservation.email}</span>
                              </p>
                              <p className={`text-sm flex items-center gap-2 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                <span>📱</span>
                                {reservation.phone}
                              </p>
                            </div>
                          </div>

                          {/* Reservation Details */}
                          <div className={`p-5 rounded-xl ${
                            theme === 'dark' ? 'bg-gradient-to-br from-[#A8D5BA]/10 to-[#8FBC8F]/10' : 'bg-gradient-to-br from-[#A8D5BA]/10 to-[#8FBC8F]/20'
                          }`}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">📅</span>
                              <h4 className={`font-bold text-[#8FBC8F]`}>
                                Reservation Details
                              </h4>
                            </div>
                            <div className="space-y-2">
                              <p className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                              }`}>
                                🗓️ {new Date(reservation.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                ⏰ {reservation.start_time} - {reservation.end_time}
                              </p>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                👥 {reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}
                              </p>
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className={`p-5 rounded-xl ${
                            theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">📋</span>
                              <h4 className={`font-bold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                Additional Info
                              </h4>
                            </div>
                            <p className={`text-xs mb-3 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Created: {new Date(reservation.created_at).toLocaleString()}
                            </p>
                            {reservation.special_requests && (
                              <div>
                                <p className={`text-sm font-semibold mb-2 ${
                                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                }`}>
                                  💬 Special Requests:
                                </p>
                                <p className={`text-sm ${
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {reservation.special_requests}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleApprove(reservation.id)}
                            disabled={processingIds.has(reservation.id)}
                            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                              processingIds.has(reservation.id)
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-xl"
                            }`}
                            title="Approve reservation and send email notifications to staff"
                          >
                            {processingIds.has(reservation.id) ? (
                              <span className="flex items-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Approving & Notifying...
                              </span>
                            ) : (
                              "✅ Approve"
                            )}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleReject(reservation.id)}
                            disabled={processingIds.has(reservation.id)}
                            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                              processingIds.has(reservation.id)
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-xl"
                            }`}
                            title="Reject reservation and send email notifications to staff"
                          >
                            {processingIds.has(reservation.id) ? (
                              <span className="flex items-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Rejecting & Notifying...
                              </span>
                            ) : (
                              "❌ Reject"
                            )}
                          </motion.button>

                          {/* Delete Button with Confirmation */}
                          {deleteConfirmId === reservation.id ? (
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDelete(reservation.id)}
                                disabled={processingIds.has(reservation.id)}
                                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                                  processingIds.has(reservation.id)
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:shadow-xl"
                                }`}
                                title="Confirm deletion - this action cannot be undone"
                              >
                                {processingIds.has(reservation.id) ? (
                                  <span className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Deleting...
                                  </span>
                                ) : (
                                  "🗑️ Confirm Delete"
                                )}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setDeleteConfirmId(null)}
                                disabled={processingIds.has(reservation.id)}
                                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                                  theme === 'dark'
                                    ? 'bg-gray-600 hover:bg-gray-500 text-white'
                                    : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                                }`}
                                title="Cancel deletion"
                              >
                                Cancel
                              </motion.button>
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setDeleteConfirmId(reservation.id)}
                              disabled={processingIds.has(reservation.id)}
                              className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                                processingIds.has(reservation.id)
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : theme === 'dark'
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-gray-500 hover:bg-gray-600 text-white"
                              }`}
                              title="Permanently delete this reservation from the database"
                            >
                              🗑️ Delete
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Refresh Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchPendingReservations}
            disabled={loading}
            className={`px-8 py-4 rounded-2xl font-bold text-white transition-all shadow-xl ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#A8D5BA] to-[#8FBC8F] hover:from-[#8FBC8F] hover:to-[#A8D5BA] hover:shadow-2xl"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">🔄</span>
                Refreshing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                🔄 Refresh Dashboard
              </span>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
