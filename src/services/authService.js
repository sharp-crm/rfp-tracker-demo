import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../config/supabase';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  // Sign up new user
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || 'User',
            role: userData.role || 'User'
          }
        }
      });

      if (error) {
        return handleSupabaseError(error);
      }

      // Create user profile in public.user_profiles table
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: userData.name || 'User',
            role: userData.role || 'User',
            permissions: userData.role === 'Administrator' 
              ? ['read', 'write', 'delete', 'manage_users']
              : userData.role === 'Manager'
              ? ['read', 'write', 'delete']
              : ['read', 'write']
          })
          .select()
          .single();

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't fail the signup if profile creation fails
          // The profile will be created on first login
        } else {
          console.log('User profile created successfully:', profileData);
        }
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Sign in user
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return handleSupabaseError(error);
      }

      if (data.user) {
        // Get user profile from public.user_profiles table
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          
          // If profile doesn't exist, create it
          if (profileError.code === 'PGRST116') {
            console.log('Creating missing user profile...');
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert({
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name || 'User',
                role: data.user.user_metadata?.role || 'User',
                permissions: data.user.user_metadata?.role === 'Administrator' 
                  ? ['read', 'write', 'delete', 'manage_users']
                  : data.user.user_metadata?.role === 'Manager'
                  ? ['read', 'write', 'delete']
                  : ['read', 'write']
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating user profile:', createError);
              this.currentUser = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name || 'User',
                role: data.user.user_metadata?.role || 'User',
                permissions: ['read', 'write']
              };
            } else {
              this.currentUser = newProfile;
            }
          } else {
            this.currentUser = {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || 'User',
              role: data.user.user_metadata?.role || 'User',
              permissions: ['read', 'write']
            };
          }
        } else {
          this.currentUser = profile;
        }
        
        this.isAuthenticated = true;
        
        // Store in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('isAuthenticated', 'true');
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return handleSupabaseError(error);
      }

      this.currentUser = null;
      this.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      
      return handleSupabaseSuccess({ message: 'Signed out successfully' });
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Get current user
  getCurrentUser() {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.isAuthenticated = true;
      }
    }
    return this.currentUser;
  }

  // Check if user is authenticated
  checkAuthStatus() {
    if (!this.isAuthenticated) {
      const storedAuth = localStorage.getItem('isAuthenticated');
      if (storedAuth === 'true') {
        this.isAuthenticated = true;
      }
    }
    return this.isAuthenticated;
  }

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return handleSupabaseError(error);
      }

      // Update current user if it's the logged-in user
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser = { ...this.currentUser, ...data };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Check if user has specific permission
  hasPermission(permission) {
    const user = this.getCurrentUser();
    return user && user.permissions && user.permissions.includes(permission);
  }

  // Get all users (for admin purposes)
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return handleSupabaseError(error);
      }

      return handleSupabaseSuccess(data);
    } catch (error) {
      return handleSupabaseError(error);
    }
  }

  // Initialize auth state from Supabase session
  async initializeAuth() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return false;
      }

      if (session?.user) {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          
          // If profile doesn't exist, create it
          if (profileError.code === 'PGRST116') {
            console.log('Creating missing user profile...');
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || 'User',
                role: session.user.user_metadata?.role || 'User',
                permissions: session.user.user_metadata?.role === 'Administrator' 
                  ? ['read', 'write', 'delete', 'manage_users']
                  : session.user.user_metadata?.role === 'Manager'
                  ? ['read', 'write', 'delete']
                  : ['read', 'write']
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating user profile:', createError);
              this.currentUser = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || 'User',
                role: session.user.user_metadata?.role || 'User',
                permissions: ['read', 'write']
              };
            } else {
              this.currentUser = newProfile;
            }
          } else {
            this.currentUser = {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || 'User',
              role: session.user.user_metadata?.role || 'User',
              permissions: ['read', 'write']
            };
          }
        } else {
          this.currentUser = profile;
        }
        
        this.isAuthenticated = true;
        
        // Store in localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error initializing auth:', error);
      return false;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Get user profile
        supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (!error && profile) {
              this.currentUser = profile;
              this.isAuthenticated = true;
              localStorage.setItem('currentUser', JSON.stringify(profile));
              localStorage.setItem('isAuthenticated', 'true');
              callback(true, profile);
            } else if (error && error.code === 'PGRST116') {
              // Profile doesn't exist, create it
              console.log('Creating missing user profile...');
              supabase
                .from('user_profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.user_metadata?.name || 'User',
                  role: session.user.user_metadata?.role || 'User',
                  permissions: session.user.user_metadata?.role === 'Administrator' 
                    ? ['read', 'write', 'delete', 'manage_users']
                    : session.user.user_metadata?.role === 'Manager'
                    ? ['read', 'write', 'delete']
                    : ['read', 'write']
                })
                .select()
                .single()
                .then(({ data: newProfile, error: createError }) => {
                  if (!createError && newProfile) {
                    this.currentUser = newProfile;
                    this.isAuthenticated = true;
                    localStorage.setItem('currentUser', JSON.stringify(newProfile));
                    localStorage.setItem('isAuthenticated', 'true');
                    callback(true, newProfile);
                  } else {
                    // Fallback to basic user data
                    const fallbackUser = {
                      id: session.user.id,
                      email: session.user.email,
                      name: session.user.user_metadata?.name || 'User',
                      role: session.user.user_metadata?.role || 'User',
                      permissions: ['read', 'write']
                    };
                    this.currentUser = fallbackUser;
                    this.isAuthenticated = true;
                    localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
                    localStorage.setItem('isAuthenticated', 'true');
                    callback(true, fallbackUser);
                  }
                });
            }
          });
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        callback(false, null);
      }
    });
  }
}

// Export a singleton instance
export default new AuthService();