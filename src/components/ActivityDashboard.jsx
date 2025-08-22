import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import AddActivityModal from './AddActivityModal';

const ActivityDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

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
    { id: 'all', label: 'All' },
    { id: 'calls', label: 'Calls' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'follow-ups', label: 'Follow-ups' },
    { id: 'other', label: 'Other' }
  ];

  const activities = [
    {
      id: 1,
      type: 'call',
      title: 'Call with XYZ Ltd',
      detail: 'Sales Lead: Alice Brown',
      status: 'Pending',
      date: 'Apr 24',
      icon: 'phone',
      iconColor: 'blue'
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Meeting with ABC Corp',
      detail: 'Client: John Doe',
      status: 'Scheduled',
      time: '10:00 AM',
      icon: 'calendar',
      iconColor: 'blue'
    },
    {
      id: 3,
      type: 'follow-up',
      title: 'Follow-up with DEF Inc',
      detail: 'Contact: Michael Smith',
      status: 'Completed',
      date: 'Apr 23',
      icon: 'check',
      iconColor: 'green'
    },
    {
      id: 4,
      type: 'meeting',
      title: 'Meeting with GHI Systems (Rescheduled)',
      detail: 'Client: Emma Wilson',
      status: 'Rescheduled',
      time: '2:30 PM',
      icon: 'calendar',
      iconColor: 'blue'
    },
    {
      id: 5,
      type: 'meeting',
      title: 'Meeting with GHI Systems',
      detail: 'Client: Emma Wilson',
      status: 'Scheduled',
      time: '2:30 PM',
      icon: 'calendar',
      iconColor: 'blue'
    },
    {
      id: 6,
      type: 'call',
      title: 'Call with JKL Solutions',
      detail: 'Prospect: Robert Johnson',
      status: 'Completed',
      date: 'Apr 22',
      icon: 'phone',
      iconColor: 'green'
    },
    {
      id: 7,
      type: 'follow-up',
      title: 'Follow-up with MNO Corp',
      detail: 'Contact: Sarah Davis',
      status: 'Pending',
      date: 'Apr 25',
      icon: 'check',
      iconColor: 'yellow'
    },
    {
      id: 8,
      type: 'other',
      title: 'Document Review',
      detail: 'RFP: Naval Equipment Supply',
      status: 'In Progress',
      date: 'Apr 26',
      icon: 'document',
      iconColor: 'purple'
    },
    {
      id: 9,
      type: 'call',
      title: 'Call with PQR Industries',
      detail: 'Client: David Wilson',
      status: 'Scheduled',
      time: '3:00 PM',
      icon: 'phone',
      iconColor: 'blue'
    },
    {
      id: 10,
      type: 'meeting',
      title: 'Team Standup',
      detail: 'Internal: Development Team',
      status: 'Scheduled',
      time: '9:00 AM',
      icon: 'calendar',
      iconColor: 'indigo'
    },
    {
      id: 11,
      type: 'follow-up',
      title: 'Follow-up with RST Ltd',
      detail: 'Contact: Lisa Anderson',
      status: 'Completed',
      date: 'Apr 21',
      icon: 'check',
      iconColor: 'green'
    },
    {
      id: 12,
      type: 'other',
      title: 'Proposal Preparation',
      detail: 'RFP: Cybersecurity Services',
      status: 'In Progress',
      date: 'Apr 27',
      icon: 'document',
      iconColor: 'purple'
    }
  ];

  // Filter activities based on active filter
  const getFilteredActivities = () => {
    switch (activeFilter) {
      case 'calls':
        return activities.filter(activity => activity.type === 'call');
      case 'meetings':
        return activities.filter(activity => activity.type === 'meeting');
      case 'follow-ups':
        return activities.filter(activity => activity.type === 'follow-up');
      case 'other':
        return activities.filter(activity => activity.type === 'other');
      default:
        return activities;
    }
  };

  // Get counts for each filter dynamically
  const getFilterCounts = () => {
    const counts = {
      all: activities.length,
      calls: activities.filter(activity => activity.type === 'call').length,
      meetings: activities.filter(activity => activity.type === 'meeting').length,
      'follow-ups': activities.filter(activity => activity.type === 'follow-up').length,
      other: activities.filter(activity => activity.type === 'other').length
    };
    return counts;
  };

  // Get stats based on filtered data
  const getFilteredStats = () => {
    const filteredData = getFilteredActivities();
    
    if (activeFilter === 'all') {
      return {
        total: activities.length,
        upcoming: activities.filter(activity => activity.status === 'Scheduled').length,
        pending: activities.filter(activity => activity.status === 'Pending').length,
        followUpsDue: activities.filter(activity => activity.type === 'follow-up' && activity.status === 'Pending').length,
        thisWeekDue: activities.filter(activity => activity.date && activity.date.includes('Apr')).length
      };
    } else if (activeFilter === 'calls') {
      return {
        total: filteredData.length,
        pending: filteredData.filter(activity => activity.status === 'Pending').length,
        completed: filteredData.filter(activity => activity.status === 'Completed').length,
        scheduled: filteredData.filter(activity => activity.status === 'Scheduled').length
      };
    } else if (activeFilter === 'meetings') {
      return {
        total: filteredData.length,
        scheduled: filteredData.filter(activity => activity.status === 'Scheduled').length,
        rescheduled: filteredData.filter(activity => activity.status === 'Rescheduled').length,
        thisWeek: filteredData.filter(activity => activity.time).length
      };
    } else if (activeFilter === 'follow-ups') {
      return {
        total: filteredData.length,
        pending: filteredData.filter(activity => activity.status === 'Pending').length,
        completed: filteredData.filter(activity => activity.status === 'Completed').length,
        dueThisWeek: filteredData.filter(activity => activity.date && activity.date.includes('Apr')).length
      };
    } else if (activeFilter === 'other') {
      return {
        total: filteredData.length,
        inProgress: filteredData.filter(activity => activity.status === 'In Progress').length,
        completed: filteredData.filter(activity => activity.status === 'Completed').length,
        thisWeek: filteredData.filter(activity => activity.date && activity.date.includes('Apr')).length
      };
    }
    
    return {
      total: filteredData.length,
      upcoming: 0,
      pending: 0,
      followUpsDue: 0,
      thisWeekDue: 0
    };
  };

  // Get filter-specific stats labels
  const getStatsLabels = () => {
    switch (activeFilter) {
      case 'calls':
        return [
          { label: 'Total Calls', key: 'total' },
          { label: 'Pending', key: 'pending' },
          { label: 'Completed', key: 'completed' },
          { label: 'Scheduled', key: 'scheduled' }
        ];
      case 'meetings':
        return [
          { label: 'Total Meetings', key: 'total' },
          { label: 'Scheduled', key: 'scheduled' },
          { label: 'Rescheduled', key: 'rescheduled' },
          { label: 'This Week', key: 'thisWeek' }
        ];
      case 'follow-ups':
        return [
          { label: 'Total Follow-ups', key: 'total' },
          { label: 'Pending', key: 'pending' },
          { label: 'Completed', key: 'completed' },
          { label: 'Due This Week', key: 'dueThisWeek' }
        ];
      case 'other':
        return [
          { label: 'Total Tasks', key: 'total' },
          { label: 'In Progress', key: 'inProgress' },
          { label: 'Completed', key: 'completed' },
          { label: 'This Week', key: 'thisWeek' }
        ];
      default:
        return [
          { label: 'Total Activities', key: 'total' },
          { label: 'Upcoming vs Pending', key: 'upcoming' },
          { label: 'Follow-ups Due', key: 'followUpsDue' },
          { label: 'This Week Due', key: 'thisWeekDue' }
        ];
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-gray-100 text-gray-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rescheduled': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      phone: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      calendar: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      check: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      document: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    };
    return icons[iconName] || icons.calendar;
  };

  const getIconColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      gray: 'bg-gray-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500'
    };
    return colors[color] || 'bg-blue-500';
  };

  const handleCreateActivity = (activityData) => {
    // Here you would typically send the data to your backend
    console.log('Creating new activity:', activityData);
    
    // For now, just show an alert
    alert(`Activity "${activityData.title}" created successfully!`);
    
    // In a real application, you would:
    // 1. Send the data to your API
    // 2. Update the local state
    // 3. Refresh the activity list
    // 4. Show a success notification
  };

  const filteredActivities = getFilteredActivities();
  const filterCounts = getFilterCounts();
  const filteredStats = getFilteredStats();
  const statsLabels = getStatsLabels();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeMenuItem="activity-dashboard"
        onMenuItemClick={(menuItem) => {
          if (menuItem === 'rfp-dashboard') {
            navigate('/dashboard');
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
              <h1 className="text-2xl font-bold text-gray-900">Activity Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button 
                onClick={() => setIsActivityModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New
              </button>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
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
                  <span className="ml-2 text-xs opacity-75">({filterCounts[filter.id]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsLabels.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {activeFilter === 'all' && stat.key === 'upcoming' 
                      ? `${filteredStats[stat.key] || 0} / ${filteredStats.pending || 0}`
                      : filteredStats[stat.key] || 0
                    }
                  </p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Activity List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeFilter === 'all' ? 'All Activities' : 
                   activeFilter === 'calls' ? 'Call Activities' :
                   activeFilter === 'meetings' ? 'Meeting Activities' :
                   activeFilter === 'follow-ups' ? 'Follow-up Activities' : 'Other Activities'}
                </h3>
                <span className="text-sm text-gray-500">
                  Showing {filteredActivities.length} of {activities.length} activities
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${getIconColor(activity.iconColor)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {getIcon(activity.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.detail}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {activity.status && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {activity.time || activity.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Found</h3>
                  <p className="text-gray-500">
                    {activeFilter === 'calls' ? 'No call activities found.' :
                     activeFilter === 'meetings' ? 'No meeting activities found.' :
                     activeFilter === 'follow-ups' ? 'No follow-up activities found.' :
                     activeFilter === 'other' ? 'No other activities found.' :
                     'No activities available.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Due Soon Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Due Soon</h3>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Meeting with GHI Systems</p>
                  <p className="text-sm text-gray-500">Client: Emma Wilson</p>
                </div>
                <span className="text-sm text-gray-500">2:30 PM</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSubmit={handleCreateActivity}
      />
    </div>
  );
};

export default ActivityDashboard; 