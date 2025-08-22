import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

const TeamMembers = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('team-members');
  const [searchTerm, setSearchTerm] = useState('');
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
    { id: 'all', label: 'All Members', count: 12 },
    { id: 'active', label: 'Active', count: 10 },
    { id: 'managers', label: 'Managers', count: 3 },
    { id: 'contributors', label: 'Contributors', count: 7 },
    { id: 'new', label: 'New Hires', count: 2 }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'John Smith',
      role: 'Senior RFP Manager',
      email: 'john.smith@company.com',
      department: 'Business Development',
      status: 'active',
      avatar: 'JS',
      avatarColor: 'blue',
      projects: 8,
      performance: 95,
      joinDate: 'Jan 2022',
      skills: ['RFP Management', 'Client Relations', 'Strategic Planning'],
      isManager: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'RFP Specialist',
      email: 'sarah.johnson@company.com',
      department: 'Business Development',
      status: 'active',
      avatar: 'SJ',
      avatarColor: 'green',
      projects: 12,
      performance: 88,
      joinDate: 'Mar 2023',
      skills: ['Proposal Writing', 'Research', 'Coordination'],
      isManager: false
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Technical Lead',
      email: 'michael.chen@company.com',
      department: 'Engineering',
      status: 'active',
      avatar: 'MC',
      avatarColor: 'purple',
      projects: 15,
      performance: 92,
      joinDate: 'Jun 2021',
      skills: ['Technical Writing', 'System Architecture', 'Solution Design'],
      isManager: true
    },
    {
      id: 4,
      name: 'Emily Davis',
      role: 'Business Analyst',
      email: 'emily.davis@company.com',
      department: 'Business Development',
      status: 'active',
      avatar: 'ED',
      avatarColor: 'pink',
      projects: 6,
      performance: 85,
      joinDate: 'Sep 2023',
      skills: ['Data Analysis', 'Market Research', 'Requirements Gathering'],
      isManager: false
    },
    {
      id: 5,
      name: 'David Wilson',
      role: 'RFP Coordinator',
      email: 'david.wilson@company.com',
      department: 'Operations',
      status: 'active',
      avatar: 'DW',
      avatarColor: 'indigo',
      projects: 10,
      performance: 90,
      joinDate: 'Apr 2022',
      skills: ['Project Coordination', 'Documentation', 'Process Management'],
      isManager: false
    },
    {
      id: 6,
      name: 'Lisa Brown',
      role: 'Senior RFP Manager',
      email: 'lisa.brown@company.com',
      department: 'Business Development',
      status: 'active',
      avatar: 'LB',
      avatarColor: 'yellow',
      projects: 11,
      performance: 93,
      joinDate: 'Feb 2021',
      skills: ['RFP Management', 'Team Leadership', 'Client Relations'],
      isManager: true
    },
    {
      id: 7,
      name: 'Robert Taylor',
      role: 'Technical Writer',
      email: 'robert.taylor@company.com',
      department: 'Engineering',
      status: 'active',
      avatar: 'RT',
      avatarColor: 'red',
      projects: 9,
      performance: 87,
      joinDate: 'Nov 2022',
      skills: ['Technical Writing', 'Content Creation', 'Editing'],
      isManager: false
    },
    {
      id: 8,
      name: 'Amanda Garcia',
      role: 'RFP Specialist',
      email: 'amanda.garcia@company.com',
      department: 'Business Development',
      status: 'active',
      avatar: 'AG',
      avatarColor: 'teal',
      projects: 7,
      performance: 89,
      joinDate: 'Jul 2023',
      skills: ['Proposal Writing', 'Client Communication', 'Research'],
      isManager: false
    },
    {
      id: 9,
      name: 'James Lee',
      role: 'Business Development Manager',
      email: 'james.lee@company.com',
      department: 'Business Development',
      status: 'active',
      avatar: 'JL',
      avatarColor: 'orange',
      projects: 13,
      performance: 91,
      joinDate: 'May 2020',
      skills: ['Business Development', 'Strategic Planning', 'Client Relations'],
      isManager: true
    },
    {
      id: 10,
      name: 'Jennifer White',
      role: 'RFP Coordinator',
      email: 'jennifer.white@company.com',
      department: 'Operations',
      status: 'active',
      avatar: 'JW',
      avatarColor: 'cyan',
      projects: 5,
      performance: 82,
      joinDate: 'Dec 2023',
      skills: ['Coordination', 'Administration', 'Communication'],
      isManager: false
    },
    {
      id: 11,
      name: 'Thomas Anderson',
      role: 'Technical Specialist',
      email: 'thomas.anderson@company.com',
      department: 'Engineering',
      status: 'active',
      avatar: 'TA',
      avatarColor: 'lime',
      projects: 14,
      performance: 94,
      joinDate: 'Aug 2021',
      skills: ['Technical Analysis', 'Solution Design', 'Implementation'],
      isManager: false
    },
    {
      id: 12,
      name: 'Rachel Martinez',
      role: 'RFP Specialist',
      email: 'rachel.martinez@company.com',
      department: 'Business Development',
      status: 'active',
      avatar: 'RM',
      avatarColor: 'rose',
      projects: 8,
      performance: 86,
      joinDate: 'Jan 2024',
      skills: ['Proposal Writing', 'Market Analysis', 'Client Support'],
      isManager: false
    }
  ];

  const getAvatarColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      indigo: 'bg-indigo-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      teal: 'bg-teal-500',
      orange: 'bg-orange-500',
      cyan: 'bg-cyan-500',
      lime: 'bg-lime-500',
      rose: 'bg-rose-500'
    };
    return colors[color] || 'bg-blue-500';
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'active' && member.status === 'active') ||
                         (activeFilter === 'managers' && member.isManager) ||
                         (activeFilter === 'contributors' && !member.isManager) ||
                         (activeFilter === 'new' && member.joinDate.includes('2024'));
    
    return matchesSearch && matchesFilter;
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
              <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Member
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search team members by name, role, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Tabs */}
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

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 ${getAvatarColor(member.avatarColor)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm font-bold text-white">{member.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{member.role}</p>
                    </div>
                    {member.isManager && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Manager
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-gray-600 truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-xs text-gray-600">{member.department}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-gray-600">Joined {member.joinDate}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">{member.projects}</p>
                      <p className="text-xs text-gray-500">Projects</p>
                    </div>
                    <div className="text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(member.performance)}`}>
                        {member.performance}%
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Performance</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 2).map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
                          +{member.skills.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
                      View Profile
                    </button>
                    <button className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeamMembers; 