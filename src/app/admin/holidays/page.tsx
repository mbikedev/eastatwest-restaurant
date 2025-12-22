'use client';

// Admin holidays page for managing restaurant closures and holidays
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { Holiday } from '@/types/holidays';
import { RecurrencePattern } from '@/types/holidays';
import {
  formatDateRange,
  formatRecurrencePattern,
  validateHolidayForm,
} from '@/lib/holidayUtils';
import { m } from 'framer-motion';

type StatusFilter = 'all' | 'active' | 'inactive' | 'recurring';

export default function AdminHolidaysPage() {
  const { loading: authLoading, isAuthenticated } = useAdminAuth();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [filteredHolidays, setFilteredHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  // Force dark mode as default for admin
  const theme = 'dark';

  // Filters and search
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Add/Edit modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    notes: '',
    start_date: '',
    end_date: '',
    is_recurring: false,
    recurrence_type: 'annual' as 'annual' | 'weekly' | 'monthly',
    recurrence_month: 12,
    recurrence_day: 25,
    recurrence_day_of_week: 0,
    recurrence_end_date: '',
    is_active: true,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Status counts
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
    recurring: 0,
  });

  // Apply dark mode to document
  useEffect(() => {
    const wasDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.add('dark');

    return () => {
      if (!wasDark) {
        document.documentElement.classList.remove('dark');
      }
    };
  }, []);

  // Fetch holidays
  const fetchHolidays = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      setHolidays(data || []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast.error('Failed to fetch holidays');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHolidays();
    }
  }, [isAuthenticated, fetchHolidays]);

  // Filter and search holidays
  useEffect(() => {
    let filtered = [...holidays];

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter((h) => h.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter((h) => !h.is_active);
    } else if (statusFilter === 'recurring') {
      filtered = filtered.filter((h) => h.is_recurring);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(term) ||
          h.description?.toLowerCase().includes(term) ||
          h.notes?.toLowerCase().includes(term)
      );
    }

    setFilteredHolidays(filtered);

    // Update counts
    setStatusCounts({
      all: holidays.length,
      active: holidays.filter((h) => h.is_active).length,
      inactive: holidays.filter((h) => !h.is_active).length,
      recurring: holidays.filter((h) => h.is_recurring).length,
    });
  }, [holidays, statusFilter, searchTerm]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      notes: '',
      start_date: '',
      end_date: '',
      is_recurring: false,
      recurrence_type: 'annual',
      recurrence_month: 12,
      recurrence_day: 25,
      recurrence_day_of_week: 0,
      recurrence_end_date: '',
      is_active: true,
    });
  };

  // Handle add holiday
  const handleAddHoliday = async () => {
    try {
      setIsSubmitting(true);

      const holidayData: any = {
        name: formData.name,
        description: formData.description || null,
        notes: formData.notes || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_recurring: formData.is_recurring,
        is_active: formData.is_active,
      };

      // Add recurrence pattern if recurring
      if (formData.is_recurring) {
        if (formData.recurrence_type === 'annual') {
          holidayData.recurrence_pattern = {
            type: 'annual',
            month: formData.recurrence_month,
            day: formData.recurrence_day,
          };
        } else if (formData.recurrence_type === 'weekly') {
          holidayData.recurrence_pattern = {
            type: 'weekly',
            day_of_week: formData.recurrence_day_of_week,
          };
        } else if (formData.recurrence_type === 'monthly') {
          holidayData.recurrence_pattern = {
            type: 'monthly',
            day: formData.recurrence_day,
          };
        }

        if (formData.recurrence_end_date) {
          holidayData.recurrence_end_date = formData.recurrence_end_date;
        }
      }

      // Validate
      const errors = validateHolidayForm(holidayData);
      if (errors.length > 0) {
        toast.error(errors[0].message);
        return;
      }

      // Get auth session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Call API
      const response = await fetch('/api/admin/holidays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(holidayData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add holiday');
      }

      toast.success('Holiday added successfully');
      setShowAddModal(false);
      resetForm();
      fetchHolidays();
    } catch (error) {
      console.error('Error adding holiday:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add holiday');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit holiday
  const handleEditHoliday = async () => {
    if (!editingHoliday) return;

    try {
      setIsSubmitting(true);

      const holidayData: any = {
        name: formData.name,
        description: formData.description || null,
        notes: formData.notes || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_recurring: formData.is_recurring,
        is_active: formData.is_active,
      };

      // Add recurrence pattern if recurring
      if (formData.is_recurring) {
        if (formData.recurrence_type === 'annual') {
          holidayData.recurrence_pattern = {
            type: 'annual',
            month: formData.recurrence_month,
            day: formData.recurrence_day,
          };
        } else if (formData.recurrence_type === 'weekly') {
          holidayData.recurrence_pattern = {
            type: 'weekly',
            day_of_week: formData.recurrence_day_of_week,
          };
        } else if (formData.recurrence_type === 'monthly') {
          holidayData.recurrence_pattern = {
            type: 'monthly',
            day: formData.recurrence_day,
          };
        }

        if (formData.recurrence_end_date) {
          holidayData.recurrence_end_date = formData.recurrence_end_date;
        }
      } else {
        holidayData.recurrence_pattern = null;
        holidayData.recurrence_end_date = null;
      }

      // Validate
      const errors = validateHolidayForm(holidayData);
      if (errors.length > 0) {
        toast.error(errors[0].message);
        return;
      }

      // Get auth session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Call API
      const response = await fetch(`/api/admin/holidays/${editingHoliday.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(holidayData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update holiday');
      }

      toast.success('Holiday updated successfully');
      setShowEditModal(false);
      setEditingHoliday(null);
      resetForm();
      fetchHolidays();
    } catch (error) {
      console.error('Error updating holiday:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update holiday');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete holiday
  const handleDeleteHoliday = async (id: string) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(`/api/admin/holidays/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete holiday');
      }

      toast.success('Holiday deleted successfully');
      fetchHolidays();
    } catch (error) {
      console.error('Error deleting holiday:', error);
      toast.error('Failed to delete holiday');
    }
  };

  // Handle toggle active
  const handleToggleActive = async (holiday: Holiday) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(`/api/admin/holidays/${holiday.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ is_active: !holiday.is_active }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle holiday status');
      }

      toast.success(
        `Holiday ${!holiday.is_active ? 'activated' : 'deactivated'} successfully`
      );
      fetchHolidays();
    } catch (error) {
      console.error('Error toggling holiday status:', error);
      toast.error('Failed to toggle holiday status');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      toast.error('No holidays selected');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.size} holiday(s)?`
      )
    )
      return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const promises = Array.from(selectedIds).map((id) =>
        fetch(`/api/admin/holidays/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        })
      );

      await Promise.all(promises);

      toast.success(`${selectedIds.size} holiday(s) deleted successfully`);
      setSelectedIds(new Set());
      fetchHolidays();
    } catch (error) {
      console.error('Error bulk deleting holidays:', error);
      toast.error('Failed to delete holidays');
    }
  };

  // Open edit modal
  const openEditModal = (holiday: Holiday) => {
    setEditingHoliday(holiday);

    // Parse recurrence pattern
    let recurrence_type: 'annual' | 'weekly' | 'monthly' = 'annual';
    let recurrence_month = 12;
    let recurrence_day = 25;
    let recurrence_day_of_week = 0;

    if (holiday.recurrence_pattern) {
      const pattern = holiday.recurrence_pattern as RecurrencePattern;
      recurrence_type = pattern.type;

      if (pattern.type === 'annual') {
        recurrence_month = pattern.month;
        recurrence_day = pattern.day;
      } else if (pattern.type === 'weekly') {
        recurrence_day_of_week = pattern.day_of_week;
      } else if (pattern.type === 'monthly') {
        recurrence_day = pattern.day;
      }
    }

    setFormData({
      name: holiday.name,
      description: holiday.description || '',
      notes: holiday.notes || '',
      start_date: holiday.start_date,
      end_date: holiday.end_date,
      is_recurring: holiday.is_recurring,
      recurrence_type,
      recurrence_month,
      recurrence_day,
      recurrence_day_of_week,
      recurrence_end_date: holiday.recurrence_end_date || '',
      is_active: holiday.is_active,
    });

    setShowEditModal(true);
  };

  // Auth loading screen
  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Pagination
  const totalPages = Math.ceil(filteredHolidays.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHolidays = filteredHolidays.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Holiday Management</h1>
          <p className="text-gray-400">
            Manage restaurant closures and holiday periods
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
          >
            Add New Holiday
          </button>

          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
            >
              Delete Selected ({selectedIds.size})
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['all', 'active', 'inactive', 'recurring'] as StatusFilter[]).map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)} (
                {statusCounts[filter]})
              </button>
            )
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search holidays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading holidays...</div>
        ) : currentHolidays.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No holidays found. Click "Add New Holiday" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        currentHolidays.length > 0 &&
                        currentHolidays.every((h) => selectedIds.has(h.id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(new Set(currentHolidays.map((h) => h.id)));
                        } else {
                          setSelectedIds(new Set());
                        }
                      }}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Date Range</th>
                  <th className="p-4 text-left">Recurrence</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentHolidays.map((holiday) => (
                  <m.tr
                    key={holiday.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-700 hover:bg-gray-750"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(holiday.id)}
                        onChange={(e) => {
                          const newSet = new Set(selectedIds);
                          if (e.target.checked) {
                            newSet.add(holiday.id);
                          } else {
                            newSet.delete(holiday.id);
                          }
                          setSelectedIds(newSet);
                        }}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{holiday.name}</div>
                      {holiday.description && (
                        <div className="text-sm text-gray-400">
                          {holiday.description}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      {formatDateRange(holiday.start_date, holiday.end_date)}
                    </td>
                    <td className="p-4 text-sm">
                      {formatRecurrencePattern(holiday.recurrence_pattern as RecurrencePattern | null)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          holiday.is_active
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {holiday.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleToggleActive(holiday)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                        >
                          {holiday.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => openEditModal(holiday)}
                          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHoliday(holiday.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </m.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {showAddModal ? 'Add New Holiday' : 'Edit Holiday'}
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                    placeholder="e.g., Christmas 2025"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                    placeholder="Public-facing description"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Internal Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                    rows={2}
                    placeholder="Internal notes (not shown to customers)"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          start_date: e.target.value,
                          end_date: formData.end_date || e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                    />
                  </div>
                </div>

                {/* Recurring */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_recurring}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_recurring: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">
                      Recurring Holiday
                    </span>
                  </label>
                </div>

                {/* Recurrence Pattern */}
                {formData.is_recurring && (
                  <div className="bg-gray-700 p-4 rounded-lg space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Recurrence Type
                      </label>
                      <select
                        value={formData.recurrence_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recurrence_type: e.target.value as
                              | 'annual'
                              | 'weekly'
                              | 'monthly',
                          })
                        }
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg"
                      >
                        <option value="annual">Annually</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>

                    {formData.recurrence_type === 'annual' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Month (1-12)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="12"
                            value={formData.recurrence_month}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                recurrence_month: parseInt(e.target.value),
                              })
                            }
                            className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Day (1-31)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="31"
                            value={formData.recurrence_day}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                recurrence_day: parseInt(e.target.value),
                              })
                            }
                            className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg"
                          />
                        </div>
                      </div>
                    )}

                    {formData.recurrence_type === 'monthly' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Day of Month (1-31)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={formData.recurrence_day}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              recurrence_day: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg"
                        />
                      </div>
                    )}

                    {formData.recurrence_type === 'weekly' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Day of Week
                        </label>
                        <select
                          value={formData.recurrence_day_of_week}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              recurrence_day_of_week: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg"
                        >
                          <option value="0">Sunday</option>
                          <option value="1">Monday</option>
                          <option value="2">Tuesday</option>
                          <option value="3">Wednesday</option>
                          <option value="4">Thursday</option>
                          <option value="5">Friday</option>
                          <option value="6">Saturday</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Recurrence End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.recurrence_end_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recurrence_end_date: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Leave empty for indefinite recurrence
                      </p>
                    </div>
                  </div>
                )}

                {/* Active */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingHoliday(null);
                    resetForm();
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={showAddModal ? handleAddHoliday : handleEditHoliday}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Saving...'
                    : showAddModal
                    ? 'Add Holiday'
                    : 'Update Holiday'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
