// Dummy users data
const DUMMY_USERS = [
  {
    id: 1,
    email: 'admin@rfp.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'Administrator',
    permissions: ['read', 'write', 'delete', 'manage_users']
  },
  {
    id: 2,
    email: 'user@rfp.com',
    password: 'user123',
    name: 'Regular User',
    role: 'User',
    permissions: ['read', 'write']
  },
  {
    id: 3,
    email: 'manager@rfp.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'Manager',
    permissions: ['read', 'write', 'delete']
  }
];

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  // Login method
  login(email, password) {
    const user = DUMMY_USERS.find(
      user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (user) {
      // Don't store password in session
      const { password: _, ...userWithoutPassword } = user;
      this.currentUser = userWithoutPassword;
      this.isAuthenticated = true;
      
      // Store in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      localStorage.setItem('isAuthenticated', 'true');
      
      return true;
    }
    
    return false;
  }

  // Logout method
  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    
    // Clear localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
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

  // Get all users (for admin purposes)
  getAllUsers() {
    return DUMMY_USERS.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // Check if user has specific permission
  hasPermission(permission) {
    const user = this.getCurrentUser();
    return user && user.permissions.includes(permission);
  }

  // Update user profile (simulated)
  updateProfile(userId, updates) {
    const userIndex = DUMMY_USERS.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      DUMMY_USERS[userIndex] = { ...DUMMY_USERS[userIndex], ...updates };
      
      // Update current user if it's the logged-in user
      if (this.currentUser && this.currentUser.id === userId) {
        const { password: _, ...userWithoutPassword } = DUMMY_USERS[userIndex];
        this.currentUser = userWithoutPassword;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      }
      
      return true;
    }
    return false;
  }
}

// Export a singleton instance
export default new AuthService(); 