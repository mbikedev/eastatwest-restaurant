// Email notification utilities for the restaurant admin system

export interface ReservationData {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  start_time: string;
  end_time: string;
  guests: number;
  special_requests: string | null;
  status: string;
}

/**
 * Send approval notification emails to staff when a reservation is approved/rejected
 */
export async function sendApprovalNotification(
  reservationData: ReservationData, 
  action: 'approved' | 'rejected'
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch('/api/send-approval-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reservationData,
        action
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send approval notification');
    }

    return {
      success: true,
      message: result.message
    };

  } catch (error) {
    console.error('Error sending approval notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send notification email to customer when reservation is approved/rejected
 */
export async function sendCustomerNotification(
  reservationData: ReservationData,
  action: 'approved' | 'rejected'
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch('/api/send-customer-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reservationData,
        action
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send customer notification');
    }

    return {
      success: true,
      message: result.message
    };

  } catch (error) {
    console.error('Error sending customer notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send notification emails to staff when a new reservation is created
 */
export async function sendNewReservationNotification(
  reservationData: Omit<ReservationData, 'id' | 'status'>
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch('/api/send-notification-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reservationData: {
          ...reservationData,
          // Convert to the format expected by the existing API
          startTime: reservationData.start_time,
          endTime: reservationData.end_time,
          specialRequests: reservationData.special_requests
        }
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send notification');
    }

    return {
      success: true,
      message: result.message
    };

  } catch (error) {
    console.error('Error sending new reservation notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export interface CommentData {
  id?: string;
  blog_post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  blog_post_title?: string;
  blog_post_slug?: string;
}

/**
 * Send notification email to admins when a new comment is submitted
 */
export async function sendNewCommentNotification(
  commentData: CommentData
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch('/api/send-comment-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentData }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send comment notification');
    }

    return {
      success: true,
      message: result.message
    };

  } catch (error) {
    console.error('Error sending comment notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
