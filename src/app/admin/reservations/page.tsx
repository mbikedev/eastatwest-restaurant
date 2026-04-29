"use client";

// Admin reservations page with Add New functionality + Capacity Management
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import { supabase } from '@/lib/supabaseClient';
import { safeClear } from "@/utils/storage";
import toast from 'react-hot-toast';
import { Reservation } from '@/types/supabase';
import { MAX_CAPACITY, TIME_SLOTS, getServicePeriod } from '@/lib/capacityManager';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed';

// Slot availability type from API
interface SlotAvailability {
  totalGuests: number;
  remainingCapacity: number;
  isFull: boolean;
  reservations: { id: string; name: string; guests: number; start_time: string; end_time: string }[];
}

export default function AdminReservationsPage() {
  const { loading: authLoading, isAuthenticated } = useAdminAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);

  // Force dark mode as default for admin reservations
  const theme = 'dark';

  // Filters and search
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  // Full edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Bulk actions
  const [bulkAction, setBulkAction] = useState<string>('');
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  // Add reservation modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newReservation, setNewReservation] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    start_time: '',
    end_time: '',
    guests: 2,
    special_requests: '',
    status: 'pending' as 'pending' | 'confirmed' | 'cancelled' | 'completed',
    language: 'en'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Status counts
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0
  });

  // Capacity dashboard state
  const [capacityDate, setCapacityDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [slotAvailability, setSlotAvailability] = useState<Record<string, SlotAvailability>>({});
  const [loadingCapacity, setLoadingCapacity] = useState(false);
  const [showCapacityPanel, setShowCapacityPanel] = useState(true);

  // Capacity validation for add/edit modals
  const [modalCapacityCheck, setModalCapacityCheck] = useState<{
    canBook: boolean;
    maxAvailable: number;
    checking: boolean;
    message: string;
  }>({ canBook: true, maxAvailable: MAX_CAPACITY, checking: false, message: '' });

  // Apply dark mode to document when component mounts
  useEffect(() => {
    const wasDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.add('dark');

    // Restore previous theme on unmount
    return () => {
      if (!wasDark) {
        document.documentElement.classList.remove('dark');
      }
    };
  }, []);

  // Fetch capacity data for a given date
  const fetchCapacity = useCallback(async (date: string) => {
    setLoadingCapacity(true);
    try {
      const response = await fetch(`/api/reservations/availability?date=${date}`);
      const result = await response.json();
      if (result.success && result.slots) {
        setSlotAvailability(result.slots);
      }
    } catch (error) {
      console.error('Failed to fetch capacity data:', error);
    } finally {
      setLoadingCapacity(false);
    }
  }, []);

  // Fetch capacity when date changes
  useEffect(() => {
    if (isStaff && capacityDate) {
      fetchCapacity(capacityDate);
    }
  }, [isStaff, capacityDate, fetchCapacity]);

  // Check capacity for modal forms (add/edit)
  const checkModalCapacity = useCallback(async (
    date: string,
    startTime: string,
    endTime: string,
    guests: number,
    excludeId?: string
  ) => {
    if (!date || !startTime || !endTime || !guests) {
      setModalCapacityCheck({ canBook: true, maxAvailable: MAX_CAPACITY, checking: false, message: '' });
      return;
    }
    setModalCapacityCheck(prev => ({ ...prev, checking: true }));
    try {
      const response = await fetch('/api/reservations/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, startTime, endTime, guests, excludeId }),
      });
      const result = await response.json();
      if (result.success) {
        setModalCapacityCheck({
          canBook: result.canBook,
          maxAvailable: result.maxAvailable,
          checking: false,
          message: result.canBook
            ? `${result.maxAvailable} seats available (${result.peakOccupancy}/${MAX_CAPACITY} occupied)`
            : `Cannot book: only ${result.maxAvailable} seats available at peak. ${result.conflictSlots.length} slot(s) would exceed capacity.`,
        });
      }
    } catch {
      setModalCapacityCheck({ canBook: true, maxAvailable: MAX_CAPACITY, checking: false, message: 'Could not verify capacity' });
    }
  }, []);

  // Check if user is staff
  useEffect(() => {
    const checkStaffAccess = async () => {
      try {
        const { error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError) {
          console.log('Token refresh failed, using current session:', refreshError.message);
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsStaff(false);
          return;
        }

        const ALLOWED_ADMIN_EMAILS = [
          'mbagnickg@gmail.com',
          'infos.east.west@gmail.com',
          'hannamoubayed@hotmail.com'
        ];

        const isAllowedEmail = ALLOWED_ADMIN_EMAILS.includes(user.email?.toLowerCase() || '');

        console.log('Auth check - User:', user.email, 'IsAllowedAdmin:', isAllowedEmail);

        setIsStaff(isAllowedEmail);
      } catch (error) {
        console.error('Error checking staff access:', error);
        setIsStaff(false);
      }
    };

    checkStaffAccess();
  }, []);

  // Helper function to check if a reservation has passed
  const isPastReservation = useCallback((reservation: Reservation): boolean => {
    try {
      const now = new Date();
      const reservationDate = new Date(`${reservation.date}T${reservation.end_time}`);
      return reservationDate < now;
    } catch (error) {
      console.error('Error checking if reservation is past:', error);
      return false;
    }
  }, []);

  // Fetch all reservations
  const fetchReservations = useCallback(async () => {
    if (!isStaff) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reservations:', error);
        toast.error('Failed to fetch reservations');
        return;
      }

      // Auto-mark past reservations as completed
      const reservationsToUpdate: string[] = [];
      const updatedData = (data || []).map(reservation => {
        // Only update if reservation has passed and is not already completed or cancelled
        if (isPastReservation(reservation) &&
            reservation.status !== 'completed' &&
            reservation.status !== 'cancelled') {
          reservationsToUpdate.push(reservation.id);
          return { ...reservation, status: 'completed' as const };
        }
        return reservation;
      });

      // Update past reservations in database
      if (reservationsToUpdate.length > 0) {
        console.log(`Auto-marking ${reservationsToUpdate.length} past reservations as completed`);

        // Update all past reservations in parallel
        await Promise.all(
          reservationsToUpdate.map(id =>
            supabase
              .from('reservations')
              .update({ status: 'completed' })
              .eq('id', id)
          )
        );
      }

      setReservations(updatedData);
      calculateStatusCounts(updatedData);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [isStaff]);

  useEffect(() => {
    if (isStaff) {
      fetchReservations();
    }
  }, [isStaff, fetchReservations]);

  // Calculate status counts
  const calculateStatusCounts = (data: Reservation[]) => {
    const counts = {
      all: data.length,
      pending: data.filter(r => r.status === 'pending').length,
      // Only count upcoming confirmed reservations
      confirmed: data.filter(r => r.status === 'confirmed' && !isPastReservation(r)).length,
      cancelled: data.filter(r => r.status === 'cancelled').length,
      completed: data.filter(r => r.status === 'completed').length
    };
    setStatusCounts(counts);
  };

  // Filter reservations
  useEffect(() => {
    let filtered = [...reservations];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => {
        // For confirmed status, only show upcoming reservations
        if (statusFilter === 'confirmed') {
          return r.status === statusFilter && !isPastReservation(r);
        }
        return r.status === statusFilter;
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.phone.includes(term) ||
        r.id.toString().includes(term)
      );
    }

    setFilteredReservations(filtered);
    setCurrentPage(1);
  }, [statusFilter, searchTerm, reservations, isPastReservation]);

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReservations.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(getPaginatedData().map(r => r.id));
      setSelectedIds(newSelected);
    } else {
      setSelectedIds(new Set());
    }
  };

  // Handle individual selection
  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Guests', 'Date', 'Start Time', 'End Time', 'Status', 'Created At'];
    const csvData = filteredReservations.map(r => [
      r.id,
      r.name,
      r.email,
      r.phone,
      r.guests,
      r.date,
      r.start_time,
      r.end_time,
      r.status,
      new Date(r.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Reservations exported to CSV');
  };

  // Update reservation status
  const updateStatus = async (reservationId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    setUpdatingIds(prev => new Set(prev).add(reservationId));

    try {
      console.log('Attempting to update reservation:', { reservationId, newStatus });

      const { data, error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', reservationId)
        .select();

      if (error) {
        console.error('Error updating status:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        toast.error(`Failed to update status: ${error.message}`);
        return;
      }

      console.log('Update successful:', data);

      // Get the reservation data for email notifications
      const reservation = reservations.find(r => r.id === reservationId);

      // Update local state
      setReservations(prev =>
        prev.map(r => r.id === reservationId ? { ...r, status: newStatus } : r)
      );

      // Recalculate status counts
      const updatedReservations = reservations.map(r =>
        r.id === reservationId ? { ...r, status: newStatus } : r
      );
      calculateStatusCounts(updatedReservations);

      toast.success(`Status updated to ${newStatus}`);
      setEditingId(null);

      // Send email notifications for approved or rejected reservations
      if (reservation && (newStatus === 'confirmed' || newStatus === 'cancelled')) {
        const action = newStatus === 'confirmed' ? 'approved' : 'rejected';

        // Import email functions dynamically
        const { sendApprovalNotification, sendCustomerNotification } = await import('@/lib/emailNotifications');

        // Send notifications in parallel (don't block UI)
        Promise.all([
          sendApprovalNotification(reservation, action),
          sendCustomerNotification(reservation, action)
        ]).then(([staffResult, customerResult]) => {
          if (staffResult.success && customerResult.success) {
            toast.success('Email notifications sent to staff and customer');
          } else {
            const errors = [];
            if (!staffResult.success) errors.push('staff');
            if (!customerResult.success) errors.push('customer');
            toast.error(`Failed to send notifications to: ${errors.join(', ')}`);
          }
        }).catch(err => {
          console.error('Error sending email notifications:', err);
          toast.error('Failed to send email notifications');
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(reservationId);
        return newSet;
      });
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      toast.error('No reservations selected');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedIds.size} reservation(s)? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setIsDeletingBulk(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error('You must be logged in to delete reservations');
        return;
      }

      // Delete each reservation using the API route
      const deletePromises = Array.from(selectedIds).map(async (reservationId) => {
        const response = await fetch('/api/admin/delete-reservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ reservationId })
        });

        if (!response.ok) {
          throw new Error(`Failed to delete reservation ${reservationId}`);
        }

        return reservationId;
      });

      const deletedIds = await Promise.all(deletePromises);

      // Update local state
      setReservations(prev => prev.filter(r => !selectedIds.has(r.id)));

      // Recalculate status counts
      const updatedReservations = reservations.filter(r => !selectedIds.has(r.id));
      calculateStatusCounts(updatedReservations);

      // Clear selections
      setSelectedIds(new Set());
      setBulkAction('');

      toast.success(`Successfully deleted ${deletedIds.length} reservation(s)`);
    } catch (error) {
      console.error('Error deleting reservations:', error);
      toast.error('Failed to delete some reservations');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  // Handle bulk action apply
  const handleApplyBulkAction = () => {
    if (bulkAction === 'trash') {
      handleBulkDelete();
    } else if (!bulkAction) {
      toast.error('Please select a bulk action');
    }
  };

  // Handle edit reservation
  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setShowEditModal(true);
  };

  // Handle update reservation
  const handleUpdateReservation = async () => {
    if (!editingReservation) return;

    // Validate required fields
    if (!editingReservation.name || !editingReservation.email || !editingReservation.phone ||
      !editingReservation.date || !editingReservation.start_time || !editingReservation.end_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Capacity check before updating (exclude current reservation from count)
    if (editingReservation.status !== 'cancelled' && editingReservation.status !== 'completed') {
      try {
        const capResponse = await fetch('/api/reservations/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: editingReservation.date,
            startTime: editingReservation.start_time,
            endTime: editingReservation.end_time,
            guests: editingReservation.guests,
            excludeId: editingReservation.id,
          }),
        });
        const capResult = await capResponse.json();
        if (capResult.success && !capResult.canBook) {
          toast.error(`Cannot update: only ${capResult.maxAvailable} seats available. Restaurant max capacity is ${MAX_CAPACITY}.`);
          return;
        }
      } catch {
        console.warn('Capacity check failed, proceeding with update');
      }
    }

    setIsUpdating(true);

    try {
      const updateData = {
        name: editingReservation.name,
        email: editingReservation.email,
        phone: editingReservation.phone,
        date: editingReservation.date,
        start_time: editingReservation.start_time,
        end_time: editingReservation.end_time,
        guests: editingReservation.guests,
        special_requests: editingReservation.special_requests,
        status: editingReservation.status,
        language: editingReservation.language,
        updated_at: new Date().toISOString()
      };

      console.log('🔄 Updating reservation:', {
        id: editingReservation.id,
        currentStatus: reservations.find(r => r.id === editingReservation.id)?.status,
        newStatus: editingReservation.status,
        updateData
      });

      const { data, error } = await supabase
        .from('reservations')
        .update(updateData)
        .eq('id', editingReservation.id)
        .select();

      if (error) {
        console.error('❌ Error updating reservation:', error);
        toast.error('Failed to update reservation');
        return;
      }

      console.log('✅ Update response from database:', data);

      // Check if status changed to confirmed or cancelled
      const originalReservation = reservations.find(r => r.id === editingReservation.id);
      const statusChanged = originalReservation && originalReservation.status !== editingReservation.status;
      const shouldSendEmail = statusChanged && (editingReservation.status === 'confirmed' || editingReservation.status === 'cancelled');

      // Update local state
      setReservations(prev =>
        prev.map(r => r.id === editingReservation.id ? { ...editingReservation, updated_at: new Date().toISOString() } : r)
      );

      // Recalculate status counts
      const updatedReservations = reservations.map(r =>
        r.id === editingReservation.id ? { ...editingReservation, updated_at: new Date().toISOString() } : r
      );
      calculateStatusCounts(updatedReservations);

      // Close modal and reset
      setShowEditModal(false);
      setEditingReservation(null);

      toast.success('Reservation updated successfully');

      // Send email notifications if status changed to confirmed or cancelled
      if (shouldSendEmail) {
        const action = editingReservation.status === 'confirmed' ? 'approved' : 'rejected';

        // Import email functions dynamically
        const { sendApprovalNotification, sendCustomerNotification } = await import('@/lib/emailNotifications');

        // Send notifications in parallel (don't block UI)
        Promise.all([
          sendApprovalNotification(editingReservation, action),
          sendCustomerNotification(editingReservation, action)
        ]).then(([staffResult, customerResult]) => {
          if (staffResult.success && customerResult.success) {
            toast.success('Email notifications sent to staff and customer');
          } else {
            const errors = [];
            if (!staffResult.success) errors.push('staff');
            if (!customerResult.success) errors.push('customer');
            toast.error(`Failed to send notifications to: ${errors.join(', ')}`);
          }
        }).catch(err => {
          console.error('Error sending email notifications:', err);
          toast.error('Failed to send email notifications');
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle add new reservation
  const handleAddReservation = async () => {
    // Validate required fields
    if (!newReservation.name || !newReservation.email || !newReservation.phone ||
      !newReservation.date || !newReservation.start_time || !newReservation.end_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Capacity check before adding
    try {
      const capResponse = await fetch('/api/reservations/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newReservation.date,
          startTime: newReservation.start_time,
          endTime: newReservation.end_time,
          guests: newReservation.guests,
        }),
      });
      const capResult = await capResponse.json();
      if (capResult.success && !capResult.canBook) {
        toast.error(`Cannot add: only ${capResult.maxAvailable} seats available. Restaurant max capacity is ${MAX_CAPACITY}.`);
        return;
      }
    } catch {
      console.warn('Capacity check failed, proceeding with add');
    }

    setIsAdding(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error('You must be logged in to add reservations');
        return;
      }

      // Generate invoice number for the reservation
      const invoiceNumber = `INV-${String(Date.now()).slice(-4)}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      const response = await fetch('/api/admin/add-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...newReservation,
          invoice_number: invoiceNumber
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add reservation');
      }

      const result = await response.json();
      console.log('📝 Add reservation result:', result);

      // Send email notification to customer
      if (result.success && result.data) {
        console.log('📧 Attempting to send confirmation email to:', newReservation.email);

        try {
          const emailPayload = {
            email: newReservation.email,
            guests: newReservation.guests,
            language: newReservation.language || 'en',
            invoiceNumber: invoiceNumber,
            reservationData: {
              name: newReservation.name,
              email: newReservation.email,
              phone: newReservation.phone,
              date: newReservation.date,
              startTime: newReservation.start_time,
              endTime: newReservation.end_time,
              guests: newReservation.guests,
              specialRequests: newReservation.special_requests || '',
            }
          };

          console.log('📧 Email payload:', emailPayload);

          const emailResponse = await fetch('/api/send-reservation-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailPayload)
          });

          console.log('📧 Email response status:', emailResponse.status);

          if (emailResponse.ok) {
            console.log('✅ Confirmation email sent to customer');
            toast.success('Reservation added and confirmation email sent');
          } else {
            const errorData = await emailResponse.json();
            console.error('❌ Failed to send confirmation email:', errorData);
            toast.error('Reservation added but email failed to send');
          }
        } catch (emailError) {
          console.error('❌ Error sending confirmation email:', emailError);
          toast.error('Reservation added but email failed to send');
        }
      } else {
        console.error('❌ No reservation data in result:', result);
        toast.error('Reservation added but email could not be sent');
      }

      // Refresh reservations list and capacity data
      await fetchReservations();
      if (capacityDate === newReservation.date) {
        fetchCapacity(capacityDate);
      }

      // Reset form and close modal
      setNewReservation({
        name: '',
        email: '',
        phone: '',
        date: '',
        start_time: '',
        end_time: '',
        guests: 2,
        special_requests: '',
        status: 'pending',
        language: 'en'
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding reservation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add reservation');
    } finally {
      setIsAdding(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300';
      case 'completed': return 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-900 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-transparent border-[#A8D5BA] rounded-full animate-spin"></div>
          <p className="text-lg text-gray-900 dark:text-white">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isStaff) {
    const handleGoToLogin = () => {
      window.location.href = '/login';
    };

    const handleForceSignOut = async () => {
      try {
        safeClear();
        sessionStorage.clear();
        await supabase.auth.signOut();
        window.location.href = '/';
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`text-center max-w-md p-8 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className={theme === "dark" ? "text-white" : "text-gray-900"}>
            You don&apos;t have permission to access this page.
          </p>
          <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            Admin access required.
          </p>

          <div className="mt-6 space-y-3">
            <div className="space-y-2">
              <button
                onClick={handleGoToLogin}
                className="w-full px-4 py-2 bg-[#A8D5BA] text-white rounded hover:bg-[#8BC5A8] text-sm font-medium"
              >
                Go to Login Page
              </button>
              <button
                onClick={handleForceSignOut}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-16 sm:mt-20">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex justify-between items-center">
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Reservations
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
                style={{
                  color: theme === 'dark' ? '#EF4444' : '#10B981',
                  backgroundColor: '#10B981'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke={theme === 'dark' ? '#EF4444' : '#1a1d1cff'} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline" style={{ color: theme === 'dark' ? '#060606ff' : '#161817ff' }}>Add New</span>
              </button>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
                style={{
                  color: '#FFFFFF',
                  backgroundColor: '#EF4444'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="#FFFFFF" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline" style={{ color: '#FFFFFF' }}>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Capacity Dashboard */}
        <div className={`mb-4 rounded-lg border ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <button
            onClick={() => setShowCapacityPanel(!showCapacityPanel)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold ${
              theme === "dark" ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-50"
            } rounded-lg transition-colors`}
          >
            <span>Capacity Dashboard ({MAX_CAPACITY} max seats)</span>
            <span className="text-xs">{showCapacityPanel ? '▼' : '▶'}</span>
          </button>

          {showCapacityPanel && (
            <div className="px-4 pb-4 space-y-3">
              {/* Date selector */}
              <div className="flex items-center gap-3">
                <label className={`text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Date:
                </label>
                <input
                  type="date"
                  value={capacityDate}
                  onChange={(e) => setCapacityDate(e.target.value)}
                  className={`px-2 py-1 border rounded text-xs ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />
                <button
                  onClick={() => setCapacityDate(new Date().toISOString().split('T')[0])}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Today
                </button>
                {loadingCapacity && (
                  <span className="text-xs text-gray-400">Loading...</span>
                )}
              </div>

              {/* Service period summaries */}
              {(() => {
                const lunchSlots = TIME_SLOTS.filter(s => getServicePeriod(s) === 'lunch');
                const dinnerSlots = TIME_SLOTS.filter(s => getServicePeriod(s) === 'dinner');
                const lunchPeak = Math.max(0, ...lunchSlots.map(s => slotAvailability[s]?.totalGuests || 0));
                const dinnerPeak = Math.max(0, ...dinnerSlots.map(s => slotAvailability[s]?.totalGuests || 0));

                return (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Lunch summary */}
                    <div className={`p-3 rounded-lg border ${
                      lunchPeak >= MAX_CAPACITY
                        ? 'border-red-500/50 bg-red-500/10'
                        : lunchPeak >= MAX_CAPACITY * 0.7
                        ? 'border-yellow-500/50 bg-yellow-500/10'
                        : 'border-green-500/50 bg-green-500/10'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                          LUNCH (11:30-14:30)
                        </span>
                        <span className={`text-xs font-bold ${
                          lunchPeak >= MAX_CAPACITY ? 'text-red-400' : lunchPeak >= MAX_CAPACITY * 0.7 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {lunchPeak}/{MAX_CAPACITY}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            lunchPeak >= MAX_CAPACITY ? 'bg-red-500' : lunchPeak >= MAX_CAPACITY * 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, (lunchPeak / MAX_CAPACITY) * 100)}%` }}
                        />
                      </div>
                      {lunchPeak >= MAX_CAPACITY && (
                        <span className="text-[10px] text-red-400 font-semibold mt-1 block">FULLY BOOKED</span>
                      )}
                    </div>

                    {/* Dinner summary */}
                    <div className={`p-3 rounded-lg border ${
                      dinnerPeak >= MAX_CAPACITY
                        ? 'border-red-500/50 bg-red-500/10'
                        : dinnerPeak >= MAX_CAPACITY * 0.7
                        ? 'border-yellow-500/50 bg-yellow-500/10'
                        : 'border-green-500/50 bg-green-500/10'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                          DINNER (18:00-22:00)
                        </span>
                        <span className={`text-xs font-bold ${
                          dinnerPeak >= MAX_CAPACITY ? 'text-red-400' : dinnerPeak >= MAX_CAPACITY * 0.7 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {dinnerPeak}/{MAX_CAPACITY}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            dinnerPeak >= MAX_CAPACITY ? 'bg-red-500' : dinnerPeak >= MAX_CAPACITY * 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, (dinnerPeak / MAX_CAPACITY) * 100)}%` }}
                        />
                      </div>
                      {dinnerPeak >= MAX_CAPACITY && (
                        <span className="text-[10px] text-red-400 font-semibold mt-1 block">FULLY BOOKED</span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Detailed time slot grid */}
              <div>
                <div className={`text-xs font-medium mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Slot-by-slot occupancy:
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-15 gap-1">
                  {TIME_SLOTS.map(slot => {
                    const data = slotAvailability[slot];
                    const total = data?.totalGuests || 0;
                    const pct = (total / MAX_CAPACITY) * 100;
                    const isFull = total >= MAX_CAPACITY;

                    return (
                      <div
                        key={slot}
                        className={`relative p-1.5 rounded text-center border cursor-default ${
                          isFull
                            ? 'border-red-500/70 bg-red-500/20'
                            : pct >= 70
                            ? 'border-yellow-500/50 bg-yellow-500/10'
                            : pct > 0
                            ? 'border-green-500/50 bg-green-500/10'
                            : theme === 'dark'
                            ? 'border-gray-700 bg-gray-800'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                        title={`${slot}: ${total}/${MAX_CAPACITY} guests${isFull ? ' (FULL)' : ''}\n${data?.reservations?.map(r => `${r.name}: ${r.guests} guests`).join('\n') || 'No reservations'}`}
                      >
                        <div className={`text-[10px] font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                          {slot}
                        </div>
                        <div className={`text-[10px] font-bold ${
                          isFull ? 'text-red-400' : pct >= 70 ? 'text-yellow-400' : total > 0 ? 'text-green-400' : 'text-gray-500'
                        }`}>
                          {total}/{MAX_CAPACITY}
                        </div>
                        {/* Mini bar */}
                        <div className="w-full h-1 bg-gray-700 rounded-full mt-0.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isFull ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Tabs */}
        <div className={`flex gap-0 mb-4 border-b overflow-x-auto ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          {[
            { key: 'all', label: 'All', shortLabel: 'All', count: statusCounts.all },
            { key: 'pending', label: 'Pending', shortLabel: 'Pend', count: statusCounts.pending },
            { key: 'confirmed', label: 'Confirmed', shortLabel: 'Conf', count: statusCounts.confirmed },
            { key: 'completed', label: 'Completed', shortLabel: 'Comp', count: statusCounts.completed },
            { key: 'cancelled', label: 'Cancelled', shortLabel: 'Canc', count: statusCounts.cancelled }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as StatusFilter)}
              className={`px-1 sm:px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap text-[10px] sm:text-sm flex-1 sm:flex-none ${statusFilter === tab.key
                ? 'border-pink-600 text-pink-600'
                : `border-transparent ${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"}`
                }`}
            >
              <span className="sm:hidden">{tab.shortLabel}<br />({tab.count})</span>
              <span className="hidden sm:inline">{tab.label} ({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="space-y-2 mb-4">
          {/* First row: Bulk actions and selected count */}
          <div className="flex gap-2 items-center">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className={`px-2 py-2 border rounded text-xs ${theme === "dark"
                ? "border-gray-600 text-gray-300 bg-gray-800"
                : "border-gray-300 bg-white"
                }`}
            >
              <option value="">Bulk</option>
              <option value="trash">Delete</option>
            </select>
            <button
              onClick={handleApplyBulkAction}
              disabled={isDeletingBulk || selectedIds.size === 0}
              className={`px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed text-xs ${theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : ""
                }`}
            >
              {isDeletingBulk ? '...' : 'Apply'}
            </button>
            {selectedIds.size > 0 && (
              <span className={`px-2 py-2 text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                ({selectedIds.size})
              </span>
            )}
            <button
              onClick={exportToCSV}
              className="ml-auto px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded text-xs"
            >
              CSV
            </button>
          </div>

          {/* Second row: Search */}
          <div>
            <input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`px-3 py-2 border rounded w-full text-sm ${theme === "dark"
                ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 placeholder-gray-500"
                }`}
            />
          </div>
        </div>

        {/* Items count and pagination info */}
        <div className={`flex justify-between items-center mb-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          <span>{filteredReservations.length} items</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 disabled:opacity-50"
            >
              ‹‹
            </button>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 disabled:opacity-50"
            >
              ‹
            </button>
            <span>
              {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 disabled:opacity-50"
            >
              ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 disabled:opacity-50"
            >
              ››
            </button>
          </div>
        </div>

        {/* Table */}
        <div className={`overflow-x-auto rounded-lg border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          <table className={`w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th className="px-1 sm:px-2 py-2 text-left w-8">
                  <input
                    type="checkbox"
                    checked={getPaginatedData().length > 0 && getPaginatedData().every(r => selectedIds.has(r.id))}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded w-3 h-3"
                  />
                </th>
                <th className={`px-1 sm:px-2 py-2 text-left text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} uppercase`}>ID</th>
                <th className={`px-1 sm:px-2 py-2 text-left text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} uppercase`}>Name</th>
                <th className={`hidden md:table-cell px-2 py-2 text-left text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} uppercase`}>Phone</th>
                <th className={`hidden sm:table-cell px-2 py-2 text-center text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} uppercase`}>Seats</th>
                <th className={`hidden lg:table-cell px-2 py-2 text-left text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} uppercase`}>Date</th>
                <th className={`px-1 sm:px-2 py-2 text-left text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} uppercase`}>Status</th>
                <th className={`px-1 sm:px-2 py-2 text-left text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} uppercase`}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">Loading...</td>
                </tr>
              ) : getPaginatedData().length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">No reservations found</td>
                </tr>
              ) : (
                getPaginatedData().map((reservation) => (
                  <tr key={reservation.id} className={`${theme === "dark" ? "hover:bg-gray-700 border-gray-700" : "hover:bg-gray-100 border-gray-200"}`}>
                    <td className="px-1 sm:px-2 py-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(reservation.id)}
                        onChange={(e) => handleSelectOne(reservation.id, e.target.checked)}
                        className="rounded w-3 h-3"
                      />
                    </td>
                    <td className="px-1 sm:px-2 py-2 text-xs">{reservation.id.slice(0, 4)}</td>
                    <td className="px-1 sm:px-2 py-2 text-xs font-medium">
                      <div className="max-w-[100px] truncate">{reservation.name}</div>
                      <div className="text-[10px] text-gray-500 md:hidden">{reservation.phone}</div>
                      <div className="text-[10px] text-gray-500 sm:hidden">{reservation.guests} seats</div>
                      <div className="text-[10px] text-gray-500 lg:hidden">
                        {new Date(reservation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-2 py-2 text-xs">{reservation.phone}</td>
                    <td className="hidden sm:table-cell px-2 py-2 text-xs text-center">{reservation.guests}</td>
                    <td className="hidden lg:table-cell px-2 py-2 text-xs">
                      <div className="whitespace-nowrap">{new Date(reservation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      <div className="text-[10px] text-gray-500 whitespace-nowrap">{reservation.start_time}</div>
                    </td>
                    <td className="px-1 py-2 text-center">
                      <div className={`inline-block px-1.5 py-1 rounded text-[9px] font-semibold ${getStatusColor(reservation.status)}`}>
                        {reservation.status === 'pending' ? 'Pend' :
                          reservation.status === 'confirmed' ? 'Conf' :
                            reservation.status === 'cancelled' ? 'Canc' :
                              reservation.status === 'completed' ? 'Comp' : reservation.status}
                      </div>
                    </td>
                    <td className="px-1 py-2 text-center">
                      {editingId === reservation.id ? (
                        <div className="flex gap-0.5 justify-center">
                          <button
                            onClick={() => updateStatus(reservation.id, 'confirmed')}
                            disabled={updatingIds.has(reservation.id)}
                            style={{
                              width: '24px',
                              height: '24px',
                              backgroundColor: '#16A34A',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              borderRadius: '0.25rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: updatingIds.has(reservation.id) ? 0.5 : 1,
                              cursor: updatingIds.has(reservation.id) ? 'not-allowed' : 'pointer'
                            }}
                            className="hover:opacity-80 transition-opacity"
                            title="Approve"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => updateStatus(reservation.id, 'cancelled')}
                            disabled={updatingIds.has(reservation.id)}
                            style={{
                              width: '24px',
                              height: '24px',
                              backgroundColor: '#DC2626',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              borderRadius: '0.25rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: updatingIds.has(reservation.id) ? 0.5 : 1,
                              cursor: updatingIds.has(reservation.id) ? 'not-allowed' : 'pointer'
                            }}
                            className="hover:opacity-80 transition-opacity"
                            title="Reject"
                          >
                            ✗
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{
                              width: '24px',
                              height: '24px',
                              backgroundColor: '#6B7280',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              borderRadius: '0.25rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            className="hover:opacity-80 transition-opacity"
                            title="Cancel"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1 justify-center flex-wrap">
                          <button
                            onClick={() => handleEditReservation(reservation)}
                            style={{
                              backgroundColor: theme === 'dark' ? '#7C3AED' : '#8B5CF6',
                              color: '#FFFFFF',
                              fontSize: '9px',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontWeight: '600'
                            }}
                            className="hover:opacity-90 transition-opacity"
                            title="Edit All Details"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setEditingId(reservation.id)}
                            style={{
                              backgroundColor: theme === 'dark' ? '#1D4ED8' : '#2563EB',
                              color: '#FFFFFF',
                              fontSize: '9px',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontWeight: '600'
                            }}
                            className="hover:opacity-90 transition-opacity"
                            title="Quick Status"
                          >
                            Status
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Reservation Modal */}
        {showEditModal && editingReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-2xl w-full rounded-lg shadow-xl max-h-[90vh] overflow-y-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}>
              {/* Modal Header */}
              <div className={`sticky top-0 z-10 flex justify-between items-center p-4 border-b rounded-t-lg ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}>
                <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Edit Reservation
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingReservation(null);
                  }}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editingReservation.name}
                    onChange={(e) => setEditingReservation({ ...editingReservation, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                    placeholder="Customer name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editingReservation.email}
                    onChange={(e) => setEditingReservation({ ...editingReservation, email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                    placeholder="customer@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={editingReservation.phone}
                    onChange={(e) => setEditingReservation({ ...editingReservation, phone: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                    placeholder="+32 123 456 789"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={editingReservation.date}
                    onChange={(e) => {
                      const date = e.target.value;
                      setEditingReservation({ ...editingReservation, date });
                      if (date && editingReservation.start_time && editingReservation.end_time) {
                        checkModalCapacity(date, editingReservation.start_time, editingReservation.end_time, editingReservation.guests, editingReservation.id);
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                  />
                </div>

                {/* Time Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={editingReservation.start_time}
                      onChange={(e) => {
                        const start_time = e.target.value;
                        setEditingReservation({ ...editingReservation, start_time });
                        if (editingReservation.date && start_time && editingReservation.end_time) {
                          checkModalCapacity(editingReservation.date, start_time, editingReservation.end_time, editingReservation.guests, editingReservation.id);
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                        }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={editingReservation.end_time}
                      onChange={(e) => {
                        const end_time = e.target.value;
                        setEditingReservation({ ...editingReservation, end_time });
                        if (editingReservation.date && editingReservation.start_time && end_time) {
                          checkModalCapacity(editingReservation.date, editingReservation.start_time, end_time, editingReservation.guests, editingReservation.id);
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                        }`}
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={MAX_CAPACITY}
                    value={editingReservation.guests}
                    onChange={(e) => {
                      const guests = parseInt(e.target.value) || 1;
                      setEditingReservation({ ...editingReservation, guests });
                      if (editingReservation.date && editingReservation.start_time && editingReservation.end_time) {
                        checkModalCapacity(editingReservation.date, editingReservation.start_time, editingReservation.end_time, guests, editingReservation.id);
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                  />
                </div>

                {/* Capacity Check Indicator for Edit Modal */}
                {editingReservation.date && editingReservation.start_time && editingReservation.end_time && (
                  <div className={`p-3 rounded-lg border ${
                    modalCapacityCheck.checking
                      ? 'border-gray-500 bg-gray-500/10'
                      : modalCapacityCheck.canBook
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-red-500/50 bg-red-500/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      {modalCapacityCheck.checking ? (
                        <span className="text-xs text-gray-400">Checking capacity...</span>
                      ) : (
                        <>
                          <span className={`text-sm ${modalCapacityCheck.canBook ? 'text-green-400' : 'text-red-400'}`}>
                            {modalCapacityCheck.canBook ? '✓' : '✗'}
                          </span>
                          <span className={`text-xs ${modalCapacityCheck.canBook ? 'text-green-300' : 'text-red-300'}`}>
                            {modalCapacityCheck.message}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Status
                  </label>
                  <select
                    value={editingReservation.status}
                    onChange={(e) => setEditingReservation({ ...editingReservation, status: e.target.value as any })}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Special Requests */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Special Requests
                  </label>
                  <textarea
                    value={editingReservation.special_requests || ''}
                    onChange={(e) => setEditingReservation({ ...editingReservation, special_requests: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                    placeholder="Any special requests or notes..."
                  />
                </div>

                {/* Language */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Language
                  </label>
                  <select
                    value={editingReservation.language}
                    onChange={(e) => setEditingReservation({ ...editingReservation, language: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`sticky bottom-0 flex justify-between items-center gap-3 p-4 border-t rounded-b-lg ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}>
                <div className="flex-1"></div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingReservation(null);
                    }}
                    disabled={isUpdating}
                    className={`px-4 py-2 rounded-lg font-medium ${theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      } disabled:opacity-50`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateReservation}
                    disabled={isUpdating || (!modalCapacityCheck.canBook && !modalCapacityCheck.checking)}
                    className={`px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                      !modalCapacityCheck.canBook && !modalCapacityCheck.checking
                        ? 'bg-red-500 text-white cursor-not-allowed'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    {isUpdating ? 'Updating...' : !modalCapacityCheck.canBook ? 'Capacity Exceeded' : 'Update Reservation'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Reservation Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-2xl w-full rounded-lg shadow-xl max-h-[90vh] overflow-y-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}>
              {/* Modal Header */}
              <div className={`sticky top-0 z-10 flex justify-between items-center p-4 border-b rounded-t-lg ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}>
                <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Add New Reservation
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newReservation.name}
                    onChange={(e) => setNewReservation({ ...newReservation, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                    placeholder="Customer name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newReservation.email}
                    onChange={(e) => setNewReservation({ ...newReservation, email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                    placeholder="customer@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={newReservation.phone}
                    onChange={(e) => setNewReservation({ ...newReservation, phone: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                    placeholder="+32 123 456 789"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newReservation.date}
                    onChange={(e) => {
                      const date = e.target.value;
                      setNewReservation({ ...newReservation, date });
                      if (date && newReservation.start_time && newReservation.end_time) {
                        checkModalCapacity(date, newReservation.start_time, newReservation.end_time, newReservation.guests);
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                  />
                </div>

                {/* Time Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={newReservation.start_time}
                      onChange={(e) => {
                        const start_time = e.target.value;
                        setNewReservation({ ...newReservation, start_time });
                        if (newReservation.date && start_time && newReservation.end_time) {
                          checkModalCapacity(newReservation.date, start_time, newReservation.end_time, newReservation.guests);
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                        }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={newReservation.end_time}
                      onChange={(e) => {
                        const end_time = e.target.value;
                        setNewReservation({ ...newReservation, end_time });
                        if (newReservation.date && newReservation.start_time && end_time) {
                          checkModalCapacity(newReservation.date, newReservation.start_time, end_time, newReservation.guests);
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                        }`}
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={MAX_CAPACITY}
                    value={newReservation.guests}
                    onChange={(e) => {
                      const guests = parseInt(e.target.value) || 1;
                      setNewReservation({ ...newReservation, guests });
                      if (newReservation.date && newReservation.start_time && newReservation.end_time) {
                        checkModalCapacity(newReservation.date, newReservation.start_time, newReservation.end_time, guests);
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                  />
                </div>

                {/* Capacity Check Indicator for Add Modal */}
                {newReservation.date && newReservation.start_time && newReservation.end_time && (
                  <div className={`p-3 rounded-lg border ${
                    modalCapacityCheck.checking
                      ? 'border-gray-500 bg-gray-500/10'
                      : modalCapacityCheck.canBook
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-red-500/50 bg-red-500/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      {modalCapacityCheck.checking ? (
                        <span className="text-xs text-gray-400">Checking capacity...</span>
                      ) : (
                        <>
                          <span className={`text-sm ${modalCapacityCheck.canBook ? 'text-green-400' : 'text-red-400'}`}>
                            {modalCapacityCheck.canBook ? '✓' : '✗'}
                          </span>
                          <span className={`text-xs ${modalCapacityCheck.canBook ? 'text-green-300' : 'text-red-300'}`}>
                            {modalCapacityCheck.message}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Status
                  </label>
                  <select
                    value={newReservation.status}
                    onChange={(e) => setNewReservation({ ...newReservation, status: e.target.value as any })}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Special Requests */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Special Requests
                  </label>
                  <textarea
                    value={newReservation.special_requests}
                    onChange={(e) => setNewReservation({ ...newReservation, special_requests: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                    placeholder="Any special requests or notes..."
                  />
                </div>

                {/* Language */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                    Language
                  </label>
                  <select
                    value={newReservation.language}
                    onChange={(e) => setNewReservation({ ...newReservation, language: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                      }`}
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`sticky bottom-0 flex justify-between items-center gap-3 p-4 border-t rounded-b-lg ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}>
                <div className="flex-1"></div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    disabled={isAdding}
                    className={`px-4 py-2 rounded-lg font-medium ${theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                      } disabled:opacity-50`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddReservation}
                    disabled={isAdding || (!modalCapacityCheck.canBook && !modalCapacityCheck.checking)}
                    className={`px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                      !modalCapacityCheck.canBook && !modalCapacityCheck.checking
                        ? 'bg-red-500 text-white cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-black'
                    }`}
                  >
                    {isAdding ? 'Adding...' : !modalCapacityCheck.canBook ? 'Capacity Exceeded' : 'Add Reservation'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
