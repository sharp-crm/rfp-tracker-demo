import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

const Notifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('notifications');
  const [activeFilter, setActiveFilter] = useState('all');

  // Safety check - if no user, show loading or redirect
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  const filters = [
    { id: 'all', label: 'All', count: 24 },
    { id: 'unread', label: 'Unread', count: 8 },
    { id: 'important', label: 'Important', count: 5 },
    { id: 'rfp', label: 'RFP Updates', count: 12 },
    { id: 'system', label: 'System', count: 7 }
  ];

  const notifications = [
    {
      id: 1,
      type: 'rfp',
      title: 'New RFP Submission Deadline',
      message: 'RFP for Naval Equipment Supply is due in 3 days. Please ensure all documents are submitted on time.',
      time: '2 hours ago',
      isRead: false,
      isImportant: true,
      icon: 'bell',
      iconColor: 'red'
    },
    {
      id: 2,
      type: 'rfp',
      title: 'RFP Status Updated',
      message: 'Your submission for Defense Systems Upgrade has been reviewed and is under evaluation.',
      time: '4 hours ago',
      isRead: false,
      isImportant: false,
      icon: 'check-circle',
      iconColor: 'green'
    },
    {
      id: 3,
      type: 'system',
      title: 'System Maintenance Notice',
      message: 'Scheduled maintenance will occur on May 20th from 2:00 AM to 4:00 AM EST.',
      time: '1 day ago',
      isRead: true,
      isImportant: false,
      icon: 'wrench',
      iconColor: 'blue'
    },
    {
      id: 4,
      type: 'rfp',
      title: 'Client Feedback Received',
      message: 'ABC Corporation has provided feedback on your recent proposal. Please review and respond.',
      time: '1 day ago',
      isRead: true,
      isImportant: true,
      icon: 'chat',
      iconColor: 'purple'
    },
    {
      id: 5,
      type: 'system',
      title: 'New Team Member Added',
      message: 'Sarah Johnson has been added to your team. She will have access to RFP projects.',
      time: '2 days ago',
      isRead: true,
      isImportant: false,
      icon: 'user-plus',
      iconColor: 'indigo'
    },
    {
      id: 6,
      type: 'rfp',
      title: 'RFP Won - Congratulations!',
      message: 'Your team has successfully won the Logistics Support Contract with LMN Industries.',
      time: '3 days ago',
      isRead: true,
      isImportant: true,
      icon: 'trophy',
      iconColor: 'yellow'
    },
    {
      id: 7,
      type: 'system',
      title: 'Document Upload Complete',
      message: 'All required documents for the Surveillance Equipment RFP have been uploaded successfully.',
      time: '4 days ago',
      isRead: true,
      isImportant: false,
      icon: 'document',
      iconColor: 'gray'
    },
    {
      id: 8,
      type: 'rfp',
      title: 'Follow-up Reminder',
      message: 'Don\'t forget to follow up with DEF Solutions regarding the Cybersecurity Services proposal.',
      time: '5 days ago',
      isRead: true,
      isImportant: false,
      icon: 'clock',
      iconColor: 'orange'
    }
  ];

  const getIcon = (iconName) => {
    const icons = {
      'bell': (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.5A17.12 17.12 0 002 12c0 3.042 1.135 5.824 3 7.938l3-2.647zM4.19 19.5A17.12 17.12 0 012 12c0-3.042 1.135-5.824 3-7.938l3 2.647z" />
        </svg>
      ),
      'check-circle': (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'wrench': (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      'chat': (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      'user-plus': (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      'trophy': (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      'document': (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      'clock': (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[iconName] || icons['bell'];
  };

  const getIconColor = (color) => {
    const colors = {
      red: 'bg-red-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      yellow: 'bg-yellow-500',
      orange: 'bg-orange-500',
      gray: 'bg-gray-500'
    };
    return colors[color] || 'bg-blue-500';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.isRead;
    if (activeFilter === 'important') return notification.isImportant;
    if (activeFilter === 'rfp') return notification.type === 'rfp';
    if (activeFilter === 'system') return notification.type === 'system';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeMenuItem={activeMenuItem}
        onMenuItemClick={(menuItem) => {
          if (menuItem === 'rfp-dashboard') {
            navigate('/dashboard');
          } else if (menuItem === 'activity-dashboard') {
            navigate('/activity-dashboard');
          }
          // Add navigation for other menu items as needed
        }}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-0' : 'ml-64'}`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Mark all as read
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 text-xs opacity-75">({filter.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeFilter === 'all' ? 'All Notifications' : 
                 activeFilter === 'unread' ? 'Unread Notifications' :
                 activeFilter === 'important' ? 'Important Notifications' :
                 activeFilter === 'rfp' ? 'RFP Updates' : 'System Notifications'}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 ${getIconColor(notification.iconColor)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {getIcon(notification.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        {notification.isImportant && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Important
                          </span>
                        )}
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notification.time}</span>
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <button className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                              Mark as read
                            </button>
                          )}
                          <button className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
                            Archive
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.5A17.12 17.12 0 002 12c0 3.042 1.135 5.824 3 7.938l3-2.647zM4.19 19.5A17.12 17.12 0 012 12c0-3.042 1.135-5.824 3-7.938l3 2.647z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! Check back later for new updates.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Notifications; 