import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../config/supabase';

class RfpService {
  // Get all RFPs
  async getAllRfps() {
    try {
      const { data, error } = await supabase
        .from('rfps')
        .select(`
          *,
          user_profiles:created_by(name, email)
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

  // Get RFP by ID
  async getRfpById(id) {
    try {
      const { data, error } = await supabase
        .from('rfps')
        .select(`
          *,
          user_profiles:created_by(name, email),
          activities(*)
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

  // Create new RFP
  async createRfp(rfpData) {
    try {
      const { data, error } = await supabase
        .from('rfps')
        .insert({
          title: rfpData.title,
          client: rfpData.client,
          value: rfpData.value || '$0.00',
          priority: rfpData.priority || 'Medium',
          status: 'pending',
          deadline: rfpData.deadline,
          assignee: rfpData.assignee,
          description: rfpData.description,
          created_by: rfpData.created_by
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

  // Update RFP
  async updateRfp(id, updates) {
    try {
      const { data, error } = await supabase
        .from('rfps')
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

  // Delete RFP
  async deleteRfp(id) {
    try {
      const { error } = await supabase
        .from('rfps')
        .delete()
        .eq('id', id);

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess({ message: 'RFP deleted successfully' });
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Get RFPs by status
  async getRfpsByStatus(status) {
    try {
      const { data, error } = await supabase
        .from('rfps')
        .select(`
          *,
          user_profiles:created_by(name, email)
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

  // Get RFPs by priority
  async getRfpsByPriority(priority) {
    try {
      const { data, error } = await supabase
        .from('rfps')
        .select(`
          *,
          user_profiles:created_by(name, email)
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

  // Get RFP statistics
  async getRfpStats() {
    try {
      const { data, error } = await supabase
        .from('rfps')
        .select('status, priority, created_at');

      if (error) {
        return handleSupabaseError(error);
      }

      const stats = {
        total: data.length,
        pending: data.filter(rfp => rfp.status === 'pending').length,
        submitted: data.filter(rfp => rfp.status === 'submitted').length,
        lost: data.filter(rfp => rfp.status === 'lost').length,
        highPriority: data.filter(rfp => rfp.priority === 'High').length,
        mediumPriority: data.filter(rfp => rfp.priority === 'Medium').length,
        lowPriority: data.filter(rfp => rfp.priority === 'Low').length
      };

      return handleSupabaseSuccess(stats);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Search RFPs
  async searchRfps(query) {
    try {
      const { data, error } = await supabase
        .from('rfps')
        .select(`
          *,
          user_profiles:created_by(name, email)
        `)
        .or(`title.ilike.%${query}%,client.ilike.%${query}%,description.ilike.%${query}%`)
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

export default new RfpService();
