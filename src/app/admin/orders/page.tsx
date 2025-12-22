"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_type: 'pickup' | 'delivery';
  delivery_address?: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  delivery_date: string;
  delivery_time: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'payment_failed' | 'canceled' | 'completed';
  payment_method: 'online' | 'cash';
  payment_intent_id?: string;
  additional_notes?: string;
  language: string;
  created_at: string;
  order_items?: OrderItem[];
}

type StatusFilter = 'all' | 'pending' | 'paid' | 'payment_failed' | 'canceled' | 'completed';

export default function AdminOrdersPage() {
  const { theme } = useTheme();
  const { loading: authLoading, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  // State declarations - must all be declared before any conditional returns
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);

  // Filters and search
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  // Bulk actions
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Status counts
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    paid: 0,
    payment_failed: 0,
    canceled: 0,
    completed: 0
  });

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    if (!isStaff) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
        return;
      }

      setOrders(data || []);

      // Calculate status counts
      const counts = {
        all: data?.length || 0,
        pending: data?.filter(o => o.status === 'pending').length || 0,
        paid: data?.filter(o => o.status === 'paid').length || 0,
        payment_failed: data?.filter(o => o.status === 'payment_failed').length || 0,
        canceled: data?.filter(o => o.status === 'canceled').length || 0,
        completed: data?.filter(o => o.status === 'completed').length || 0,
      };

      setStatusCounts(counts);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  }, [isStaff]);

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
        setIsStaff(isAllowedEmail);
      } catch (error) {
        console.error('Error checking staff access:', error);
        setIsStaff(false);
      }
    };

    checkStaffAccess();
  }, []);

  useEffect(() => {
    if (isStaff) {
      fetchOrders();
    }
  }, [isStaff, fetchOrders]);

  // Filter and search
  useEffect(() => {
    let filtered = orders;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.customer_name.toLowerCase().includes(term) ||
        order.customer_email.toLowerCase().includes(term) ||
        order.customer_phone.includes(term) ||
        order.id.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, statusFilter, searchTerm]);

  // Auth check - must come after all hooks
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

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingIds(prev => new Set([...prev, orderId]));

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update order');
        return;
      }

      toast.success('Order status updated');
      setEditingId(null);
      await fetchOrders();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Delete order
  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error('Error deleting order:', data.error);
        toast.error(data.error || 'Failed to delete order');
        return;
      }

      toast.success('Order deleted successfully');
      await fetchOrders();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while deleting the order');
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      toast.error('No orders selected');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.size} order(s)?`)) {
      return;
    }

    setIsDeletingBulk(true);

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .in('id', Array.from(selectedIds));

      if (error) {
        console.error('Error deleting orders:', error);
        toast.error('Failed to delete orders');
        return;
      }

      toast.success(`${selectedIds.size} order(s) deleted`);
      setSelectedIds(new Set());
      setShowBulkActions(false);
      await fetchOrders();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredOrders.map(order => ({
      'Order ID': order.id,
      'Customer Name': order.customer_name,
      'Email': order.customer_email,
      'Phone': order.customer_phone,
      'Delivery Type': order.delivery_type,
      'Payment Method': order.payment_method,
      'Total Amount': `€${order.total_amount.toFixed(2)}`,
      'Status': order.status,
      'Date': order.delivery_date,
      'Time': order.delivery_time,
      'Address': order.delivery_type === 'delivery' && order.delivery_address
        ? `${order.delivery_address.street}, ${order.delivery_address.city}, ${order.delivery_address.postal_code}`
        : 'N/A',
      'Notes': order.additional_notes || '',
      'Created At': new Date(order.created_at).toLocaleString()
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row =>
        headers.map(header => {
          const value = row[header as keyof typeof row] || '';
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('CSV exported successfully');
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedOrders.map(o => o.id)));
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">Admin access required</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Order Management</h1>
        <button
          onClick={handleSignOut}
          style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF'
          }}
          className="px-4 py-2 text-sm rounded hover:opacity-90 transition-all font-medium"
        >
          Sign Out
        </button>
      </div>

      {/* Status Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {(['all', 'pending', 'paid', 'payment_failed', 'canceled', 'completed'] as StatusFilter[]).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-green-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </span>
              <span className="sm:hidden">
                {status === 'payment_failed' ? 'Failed' : status.charAt(0).toUpperCase() + status.slice(1).substring(0, 3)}
              </span>
              <span className="ml-2 text-xs">({statusCounts[status]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, phone, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-700'
                : 'bg-white text-gray-900 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
        </div>

        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF'
              }}
              className="px-4 py-2 rounded-lg hover:opacity-90 transition-all text-sm font-medium"
            >
              Bulk ({selectedIds.size})
            </button>
          )}

          <button
            onClick={exportToCSV}
            disabled={filteredOrders.length === 0}
            style={{
              backgroundColor: filteredOrders.length === 0 ? (theme === 'dark' ? '#4B5563' : '#D1D5DB') : '#16A34A',
              color: '#FFFFFF',
              cursor: filteredOrders.length === 0 ? 'not-allowed' : 'pointer'
            }}
            className="px-4 py-2 rounded-lg hover:opacity-90 transition-all text-sm font-medium"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && selectedIds.size > 0 && (
        <div className={`mb-4 p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedIds.size} order(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              disabled={isDeletingBulk}
              style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                opacity: isDeletingBulk ? 0.5 : 1,
                cursor: isDeletingBulk ? 'not-allowed' : 'pointer'
              }}
              className="px-4 py-2 rounded hover:opacity-90 transition-all text-sm font-medium"
            >
              {isDeletingBulk ? 'Deleting...' : 'Delete Selected'}
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={`text-center py-12 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <p className="text-lg">No orders found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === paginatedOrders.length && paginatedOrders.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold">Order ID</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold">Customer</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold hidden md:table-cell">Phone</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold">Type</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold">Payment</th>
                  <th className="px-2 sm:px-4 py-3 text-right text-xs font-semibold">Total</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold hidden lg:table-cell">Date</th>
                  <th className="px-2 sm:px-4 py-3 text-center text-xs font-semibold">Status</th>
                  <th className="px-2 sm:px-4 py-3 text-center text-xs font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`border-t ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    } hover:bg-opacity-50 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs font-mono">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-sm">
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-xs opacity-70">{order.customer_email}</div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-sm hidden md:table-cell">{order.customer_phone}</td>
                    <td className="px-2 sm:px-4 py-3 text-sm capitalize">{order.delivery_type}</td>
                    <td className="px-2 sm:px-4 py-3 text-sm">
                      {order.payment_method === 'cash' ? '💵 Cash' : '💳 Online'}
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-sm font-semibold text-right">
                      €{order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-sm hidden lg:table-cell">
                      <div>{new Date(order.delivery_date).toLocaleDateString()}</div>
                      <div className="text-xs opacity-70">{order.delivery_time}</div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center">
                      {editingId === order.id ? (
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          disabled={updatingIds.has(order.id)}
                          className={`text-xs px-2 py-1 rounded ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="payment_failed">Failed</option>
                          <option value="completed">Completed</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'canceled' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      )}
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {editingId === order.id ? (
                          <button
                            onClick={() => setEditingId(null)}
                            style={{
                              backgroundColor: '#6B7280',
                              color: '#FFFFFF'
                            }}
                            className="px-2 py-1 text-xs rounded hover:opacity-90 transition-all font-medium"
                          >
                            Cancel
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingId(order.id)}
                              style={{
                                backgroundColor: '#2563EB',
                                color: '#FFFFFF'
                              }}
                              className="px-2 py-1 text-xs rounded hover:opacity-90 transition-all font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              style={{
                                backgroundColor: '#DC2626',
                                color: '#FFFFFF'
                              }}
                              className="px-2 py-1 text-xs rounded hover:opacity-90 transition-all font-medium"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    backgroundColor: currentPage === 1 ? (theme === 'dark' ? '#4B5563' : '#D1D5DB') : '#16A34A',
                    color: '#FFFFFF',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                  className="px-3 py-1 rounded hover:opacity-90 transition-all font-medium"
                >
                  Previous
                </button>
                <span className="px-3 py-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    backgroundColor: currentPage === totalPages ? (theme === 'dark' ? '#4B5563' : '#D1D5DB') : '#16A34A',
                    color: '#FFFFFF',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                  className="px-3 py-1 rounded hover:opacity-90 transition-all font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
