import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../config/supabase';

class ActivityService {
  // Get all activities
  async getAllActivities() {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          user_profiles:created_by(name, email),
          rfps:rfp_id(title, client)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Get activity by ID
  async getActivityById(id) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          user_profiles:created_by(name, email),
          rfps:rfp_id(title, client)
        `)
        .eq('id', id)
        .single();

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Create new activity
  async createActivity(activityData) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          title: activityData.title,
          type: activityData.type || 'Meeting',
          scheduled_date: activityData.scheduledDate,
          time: activityData.time,
          due_date: activityData.dueDate,
          priority: activityData.priority || 'High',
          status: activityData.status || 'Pending',
          assignee: activityData.assignee,
          description: activityData.description,
          rfp_id: activityData.rfp_id || null,
          created_by: activityData.created_by
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

  // Update activity
  async updateActivity(id, updates) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', id)
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

  // Delete activity
  async deleteActivity(id) {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess({ message: 'Activity deleted successfully' });
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Get activities by status
  async getActivitiesByStatus(status) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          user_profiles:created_by(name, email),
          rfps:rfp_id(title, client)
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Get activities by priority
  async getActivitiesByPriority(priority) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          user_profiles:created_by(name, email),
          rfps:rfp_id(title, client)
        `)
        .eq('priority', priority)
        .order('created_at', { ascending: false });

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Get activities by assignee
  async getActivitiesByAssignee(assignee) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          user_profiles:created_by(name, email),
          rfps:rfp_id(title, client)
        `)
        .eq('assignee', assignee)
        .order('created_at', { ascending: false });

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Get overdue activities
  async getOverdueActivities() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          user_profiles:created_by(name, email),
          rfps:rfp_id(title, client)
        `)
        .lt('due_date', today)
        .neq('status', 'Completed')
        .order('due_date', { ascending: true });

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Get upcoming activities (next 7 days)
  async getUpcomingActivities() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          user_profiles:created_by(name, email),
          rfps:rfp_id(title, client)
        `)
        .gte('due_date', today)
        .lte('due_date', nextWeekStr)
        .neq('status', 'Completed')
        .order('due_date', { ascending: true });

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Get activity statistics
  async getActivityStats() {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('status, priority, due_date, created_at');

      if (error) {
        return handleSupabaseError(error);
      }

      const today = new Date().toISOString().split('T')[0];
      
      const stats = {
        total: data.length,
        pending: data.filter(activity => activity.status === 'Pending').length,
        inProgress: data.filter(activity => activity.status === 'In Progress').length,
        completed: data.filter(activity => activity.status === 'Completed').length,
        overdue: data.filter(activity => 
          activity.due_date < today && activity.status !== 'Completed'
        ).length,
        highPriority: data.filter(activity => activity.priority === 'High').length,
        mediumPriority: data.filter(activity => activity.priority === 'Medium').length,
        lowPriority: data.filter(activity => activity.priority === 'Low').length
      };

      return handleSupabaseSuccess(stats);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Search activities
  async searchActivities(query) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          user_profiles:created_by(name, email),
          rfps:rfp_id(title, client)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,assignee.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
}

export default new ActivityService();
