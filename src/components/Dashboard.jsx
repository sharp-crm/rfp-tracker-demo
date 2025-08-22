import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('rfp-dashboard');

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

  const tabs = [
    { id: 'all', label: 'All', count: 24 },
    { id: 'pending', label: 'Pending', count: 8 },
    { id: 'submitted', label: 'Submitted', count: 12 },
    { id: 'lost', label: 'Lost', count: 3 },
    { id: 'priority', label: 'Priority', count: 5 }
  ];

  const rfpData = [
    {
      id: 1,
      title: 'RFP - Naval Equipment Supply',
      client: 'ABC Corporation',
      date: 'May 10',
      status: 'pending',
      priority: 'high',
      icon: 'folder',
      iconColor: 'blue'
    },
    {
      id: 2,
      title: 'RFP - Defense Systems Upgrade',
      client: 'XYZ Ltd.',
      date: 'May 7',
      status: 'submitted',
      priority: 'medium',
      icon: 'check',
      iconColor: 'green'
    },
    {
      id: 3,
      title: 'RFP - Logistics Support Contract',
      client: 'LMN Industries',
      date: 'Apr 3',
      status: 'lost',
      priority: 'low',
      icon: 'folder',
      iconColor: 'gray'
    },
    {
      id: 4,
      title: 'RFP - Surveillance Equipment',
      client: 'PQR Enterprises',
      date: 'Apr 18',
      status: 'pending',
      priority: 'high',
      icon: 'check',
      iconColor: 'yellow'
    },
    {
      id: 5,
      title: 'RFP - Cybersecurity Services',
      client: 'DEF Solutions',
      date: 'May 15',
      status: 'submitted',
      priority: 'high',
      icon: 'shield',
      iconColor: 'purple'
    },
    {
      id: 6,
      title: 'RFP - Training Program Development',
      client: 'GHI Training Co.',
      date: 'May 20',
      status: 'pending',
      priority: 'medium',
      icon: 'book',
      iconColor: 'indigo'
    },
    {
      id: 7,
      title: 'RFP - Satellite Communication',
      client: 'SpaceTech Inc.',
      date: 'May 25',
      status: 'submitted',
      priority: 'high',
      icon: 'shield',
      iconColor: 'blue'
    },
    {
      id: 8,
      title: 'RFP - Medical Equipment Supply',
      client: 'HealthCare Plus',
      date: 'May 28',
      status: 'pending',
      priority: 'high',
      icon: 'folder',
      iconColor: 'red'
    },
    {
      id: 9,
      title: 'RFP - Software Development',
      client: 'TechCorp Solutions',
      date: 'May 30',
      status: 'submitted',
      priority: 'medium',
      icon: 'check',
      iconColor: 'green'
    },
    {
      id: 10,
      title: 'RFP - Infrastructure Project',
      client: 'BuildRight Ltd.',
      date: 'Jun 2',
      status: 'lost',
      priority: 'low',
      icon: 'folder',
      iconColor: 'gray'
    },
    {
      id: 11,
      title: 'RFP - Renewable Energy',
      client: 'GreenPower Co.',
      date: 'Jun 5',
      status: 'submitted',
      priority: 'high',
      icon: 'shield',
      iconColor: 'green'
    },
    {
      id: 12,
      title: 'RFP - Data Analytics Platform',
      client: 'DataInsight Inc.',
      date: 'Jun 8',
      status: 'pending',
      priority: 'medium',
      icon: 'book',
      iconColor: 'purple'
    }
  ];

  // Filter RFP data based on active tab
  const getFilteredRfpData = () => {
    switch (activeTab) {
      case 'pending':
        return rfpData.filter(rfp => rfp.status === 'pending');
      case 'submitted':
        return rfpData.filter(rfp => rfp.status === 'submitted');
      case 'lost':
        return rfpData.filter(rfp => rfp.status === 'lost');
      case 'priority':
        return rfpData.filter(rfp => rfp.priority === 'high');
      default:
        return rfpData;
    }
  };

  // Get counts for each tab dynamically
  const getTabCounts = () => {
    const counts = {
      all: rfpData.length,
      pending: rfpData.filter(rfp => rfp.status === 'pending').length,
      submitted: rfpData.filter(rfp => rfp.status === 'submitted').length,
      lost: rfpData.filter(rfp => rfp.status === 'lost').length,
      priority: rfpData.filter(rfp => rfp.priority === 'high').length
    };
    return counts;
  };

  // Get stats based on filtered data
  const getFilteredStats = () => {
    const filteredData = getFilteredRfpData();
    
    if (activeTab === 'all') {
      return {
        total: rfpData.length,
        submitted: rfpData.filter(rfp => rfp.status === 'submitted').length,
        dueThisWeek: rfpData.filter(rfp => rfp.status === 'pending').length,
        highPriority: rfpData.filter(rfp => rfp.priority === 'high').length
      };
    } else if (activeTab === 'pending') {
      return {
        total: filteredData.length,
        highPriority: filteredData.filter(rfp => rfp.priority === 'high').length,
        mediumPriority: filteredData.filter(rfp => rfp.priority === 'medium').length,
        lowPriority: filteredData.filter(rfp => rfp.priority === 'low').length
      };
    } else if (activeTab === 'submitted') {
      return {
        total: filteredData.length,
        highPriority: filteredData.filter(rfp => rfp.priority === 'high').length,
        thisMonth: filteredData.filter(rfp => rfp.date.includes('May')).length,
        lastMonth: filteredData.filter(rfp => rfp.date.includes('Apr')).length
      };
    } else if (activeTab === 'lost') {
      return {
        total: filteredData.length,
        thisMonth: filteredData.filter(rfp => rfp.date.includes('May')).length,
        lastMonth: filteredData.filter(rfp => rfp.date.includes('Apr')).length,
        totalValue: '$450K'
      };
    } else if (activeTab === 'priority') {
      return {
        total: filteredData.length,
        pending: filteredData.filter(rfp => rfp.status === 'pending').length,
        submitted: filteredData.filter(rfp => rfp.status === 'submitted').length,
        dueThisWeek: filteredData.filter(rfp => rfp.date.includes('May')).length
      };
    }
    
    return {
      total: filteredData.length,
      submitted: 0,
      dueThisWeek: 0,
      highPriority: 0
    };
  };

  // Get tab-specific stats labels
  const getStatsLabels = () => {
    switch (activeTab) {
      case 'pending':
        return [
          { label: 'Total Pending', key: 'total' },
          { label: 'High Priority', key: 'highPriority' },
          { label: 'Medium Priority', key: 'mediumPriority' },
          { label: 'Low Priority', key: 'lowPriority' }
        ];
      case 'submitted':
        return [
          { label: 'Total Submitted', key: 'total' },
          { label: 'High Priority', key: 'highPriority' },
          { label: 'This Month', key: 'thisMonth' },
          { label: 'Last Month', key: 'lastMonth' }
        ];
      case 'lost':
        return [
          { label: 'Total Lost', key: 'total' },
          { label: 'This Month', key: 'thisMonth' },
          { label: 'Last Month', key: 'lastMonth' },
          { label: 'Total Value', key: 'totalValue' }
        ];
      case 'priority':
        return [
          { label: 'High Priority', key: 'total' },
          { label: 'Pending', key: 'pending' },
          { label: 'Submitted', key: 'submitted' },
          { label: 'Due This Week', key: 'dueThisWeek' }
        ];
      default:
        return [
          { label: 'Total RFPs', key: 'total' },
          { label: 'Submitted', key: 'submitted' },
          { label: 'Due This Week', key: 'dueThisWeek' },
          { label: 'High Priority', key: 'highPriority' }
        ];
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getIconColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      gray: 'bg-gray-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      red: 'bg-red-500'
    };
    return colors[color] || 'bg-blue-500';
  };

  const getIcon = (iconName) => {
    const icons = {
      folder: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      check: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      shield: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      book: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253" />
        </svg>
      )
    };
    return icons[iconName] || icons.folder;
  };

  const filteredRfpData = getFilteredRfpData();
  const tabCounts = getTabCounts();
  const filteredStats = getFilteredStats();
  const statsLabels = getStatsLabels();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeMenuItem={activeMenuItem}
        onMenuItemClick={(menuItem) => {
          if (menuItem === 'activity-dashboard') {
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
              <h1 className="text-2xl font-bold text-gray-900">RFP Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 text-xs opacity-75">({tabCounts[tab.id]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsLabels.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredStats[stat.key] || 0}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                  <div className={`w-12 h-12 ${
                    index === 0 ? 'bg-blue-100' :
                    index === 1 ? 'bg-green-100' :
                    index === 2 ? 'bg-yellow-100' : 'bg-red-100'
                  } rounded-lg flex items-center justify-center`}>
                    <svg className={`w-6 h-6 ${
                      index === 0 ? 'text-blue-600' :
                      index === 1 ? 'text-green-600' :
                      index === 2 ? 'text-yellow-600' : 'text-red-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RFP List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'all' ? 'All RFPs' : 
                   activeTab === 'pending' ? 'Pending RFPs' :
                   activeTab === 'submitted' ? 'Submitted RFPs' :
                   activeTab === 'lost' ? 'Lost RFPs' : 'High Priority RFPs'}
                </h3>
                <span className="text-sm text-gray-500">
                  Showing {filteredRfpData.length} of {rfpData.length} RFPs
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredRfpData.length > 0 ? (
                filteredRfpData.map((rfp) => (
                  <div key={rfp.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${getIconColor(rfp.iconColor)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {getIcon(rfp.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{rfp.title}</p>
                        <p className="text-sm text-gray-500">Client: {rfp.client}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{rfp.date}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rfp.status)}`}>
                          {rfp.status.charAt(0).toUpperCase() + rfp.status.slice(1)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(rfp.priority)}`}>
                          {rfp.priority.charAt(0).toUpperCase() + rfp.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No RFPs Found</h3>
                  <p className="text-gray-500">
                    {activeTab === 'pending' ? 'No pending RFPs at the moment.' :
                     activeTab === 'submitted' ? 'No submitted RFPs found.' :
                     activeTab === 'lost' ? 'No lost RFPs in the system.' :
                     activeTab === 'priority' ? 'No high priority RFPs currently.' :
                     'No RFPs available.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 