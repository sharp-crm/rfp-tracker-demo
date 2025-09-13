import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../config/supabase';

class NotificationService {
  // Get all notifications for a user
  async getUserNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Get unread notifications for a user
  async getUnreadNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Create new notification
  async createNotification(notificationData) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type || 'info',
          user_id: notificationData.user_id,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)
        .select();

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess({ message: 'Notification deleted successfully' });
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Get notification count for a user
  async getNotificationCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(count || 0);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Create system notifications for RFP events
  async createRfpNotification(userId, rfpTitle, eventType) {
    const notifications = {
      created: {
        title: 'New RFP Created',
        message: `A new RFP "${rfpTitle}" has been created.`,
        type: 'info'
      },
      updated: {
        title: 'RFP Updated',
        message: `RFP "${rfpTitle}" has been updated.`,
        type: 'info'
      },
      submitted: {
        title: 'RFP Submitted',
        message: `RFP "${rfpTitle}" has been submitted.`,
        type: 'success'
      },
      deadline_approaching: {
        title: 'RFP Deadline Approaching',
        message: `RFP "${rfpTitle}" deadline is approaching.`,
        type: 'warning'
      },
      deadline_passed: {
        title: 'RFP Deadline Passed',
        message: `RFP "${rfpTitle}" deadline has passed.`,
        type: 'error'
      }
    };

    const notification = notifications[eventType];
    if (notification) {
      return await this.createNotification({
        ...notification,
        user_id: userId
      });
    }

    return handleSupabaseSuccess({ message: 'No notification created' });
  }

  // Create system notifications for activity events
  async createActivityNotification(userId, activityTitle, eventType) {
    const notifications = {
      created: {
        title: 'New Activity Created',
        message: `A new activity "${activityTitle}" has been created.`,
        type: 'info'
      },
      updated: {
        title: 'Activity Updated',
        message: `Activity "${activityTitle}" has been updated.`,
        type: 'info'
      },
      completed: {
        title: 'Activity Completed',
        message: `Activity "${activityTitle}" has been completed.`,
        type: 'success'
      },
      due_soon: {
        title: 'Activity Due Soon',
        message: `Activity "${activityTitle}" is due soon.`,
        type: 'warning'
      },
      overdue: {
        title: 'Activity Overdue',
        message: `Activity "${activityTitle}" is overdue.`,
        type: 'error'
      }
    };

    const notification = notifications[eventType];
    if (notification) {
      return await this.createNotification({
        ...notification,
        user_id: userId
      });
    }

    return handleSupabaseSuccess({ message: 'No notification created' });
  }

  // Subscribe to real-time notifications
  subscribeToNotifications(userId, callback) {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  }
}

export default new NotificationService();
