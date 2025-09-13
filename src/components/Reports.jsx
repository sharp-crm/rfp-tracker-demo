import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import rfpService from '../services/rfpService';
import activityService from '../services/activityService';
import { 
  exportKpiReport, 
  exportRfpPerformance, 
  exportWinLossAnalysis, 
  exportTeamProductivity, 
  exportRevenueMetrics 
} from '../utils/excelExport';

const Reports = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('reports');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isExporting, setIsExporting] = useState(false);
  const [rfpData, setRfpData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch RFPs and Activities in parallel
        const [rfpResult, activityResult] = await Promise.all([
          rfpService.getAllRfps(),
          activityService.getAllActivities()
        ]);
        
        if (rfpResult.success) {
          setRfpData(rfpResult.data || []);
        }
        
        if (activityResult.success) {
          setActivityData(activityResult.data || []);
        }
        
        if (!rfpResult.success || !activityResult.success) {
          setError('Failed to fetch some data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

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

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  const reportCategories = [
    { 
      id: 'rfp-performance', 
      label: 'RFP Performance', 
      icon: 'chart-bar', 
      color: 'blue',
      exportFunction: exportRfpPerformance,
      description: 'Monthly RFP submission, win rates, and performance metrics'
    },
    { 
      id: 'win-loss', 
      label: 'Win/Loss Analysis', 
      icon: 'pie-chart', 
      color: 'green',
      exportFunction: exportWinLossAnalysis,
      description: 'Detailed analysis by category and industry vertical'
    },
    { 
      id: 'revenue', 
      label: 'Revenue Metrics', 
      icon: 'currency-dollar', 
      color: 'purple',
      exportFunction: exportRevenueMetrics,
      description: 'Revenue trends, growth rates, and business mix analysis'
    },
    { 
      id: 'team-productivity', 
      label: 'Team Productivity', 
      icon: 'users', 
      color: 'indigo',
      exportFunction: exportTeamProductivity,
      description: 'Individual and team performance metrics'
    },
    { 
      id: 'client-satisfaction', 
      label: 'Client Satisfaction', 
      icon: 'heart', 
      color: 'pink',
      exportFunction: null,
      description: 'Client feedback and satisfaction scores'
    },
    { 
      id: 'timeline', 
      label: 'Timeline Analysis', 
      icon: 'clock', 
      color: 'yellow',
      exportFunction: null,
      description: 'Process efficiency and timeline optimization'
    }
  ];

  // Calculate performance data from database
  const calculatePerformanceData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Group RFPs by month
    const monthlyData = {};
    
    rfpData.forEach(rfp => {
      const rfpDate = new Date(rfp.created_at);
      const monthKey = `${rfpDate.getFullYear()}-${rfpDate.getMonth()}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: rfpDate.toLocaleDateString('en-US', { month: 'short' }),
          submitted: 0,
          won: 0,
          lost: 0,
          revenue: 0
        };
      }
      
      monthlyData[monthKey].submitted++;
      
      if (rfp.status === 'Won') {
        monthlyData[monthKey].won++;
        monthlyData[monthKey].revenue += rfp.estimated_value || 0;
      } else if (rfp.status === 'Lost') {
        monthlyData[monthKey].lost++;
      }
    });
    
    // Convert to array and calculate win rates
    const performanceData = Object.values(monthlyData).map(data => ({
      ...data,
      winRate: data.submitted > 0 ? Math.round((data.won / data.submitted) * 100) : 0
    }));
    
    return performanceData;
  };

  const performanceData = calculatePerformanceData();

  const getIcon = (iconName) => {
    const icons = {
      'chart-bar': (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      'pie-chart': (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      'currency-dollar': (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      'users': (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      'heart': (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      'clock': (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[iconName] || icons['chart-bar'];
  };

  const getIconColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      pink: 'bg-pink-500',
      yellow: 'bg-yellow-500'
    };
    return colors[color] || 'bg-blue-500';
  };

  const handleExport = async (exportFunction, reportName) => {
    if (!exportFunction) {
      alert(`${reportName} export is coming soon!`);
      return;
    }

    setIsExporting(true);
    try {
      await exportFunction(selectedPeriod);
      // Show success message
      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      await exportKpiReport(selectedPeriod);
      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
    }
  };

  const totalRfps = performanceData.reduce((sum, item) => sum + item.submitted, 0);
  const totalWon = performanceData.reduce((sum, item) => sum + item.won, 0);
  const overallWinRate = Math.round((totalWon / totalRfps) * 100);
  const totalRevenue = performanceData.reduce((sum, item) => sum + item.revenue, 0);

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
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.label}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleExportAll}
                disabled={isExporting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <svg className="w-5 h-5 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export All KPIs
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading reports data...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading reports data</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content - only show when not loading */}
          {!loading && (
            <>
              {/* Report Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {reportCategories.map((category) => (
              <div key={category.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 ${getIconColor(category.color)} rounded-lg flex items-center justify-center`}>
                    {getIcon(category.icon)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.label}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExport(category.exportFunction, category.label)}
                    disabled={!category.exportFunction || isExporting}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      category.exportFunction 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isExporting ? 'Exporting...' : 'Export Excel'}
                  </button>
                  <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600 mb-2">{totalRfps}</p>
                <p className="text-sm text-gray-600">Total RFPs</p>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 mb-2">{overallWinRate}%</p>
                <p className="text-sm text-gray-600">Win Rate</p>
                <p className="text-xs text-green-600 mt-1">+5% from last month</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600 mb-2">${(totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xs text-green-600 mt-1">+18% from last month</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600 mb-2">24</p>
                <p className="text-sm text-gray-600">Avg. Days</p>
                <p className="text-xs text-red-600 mt-1">+2 days from last month</p>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Performance Overview</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {performanceData.map((data, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium text-gray-600">{data.month}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                      <div 
                        className="bg-blue-600 h-8 rounded-full relative"
                        style={{ width: `${(data.submitted / 20) * 100}%` }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">{data.submitted}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-sm text-gray-600 text-right">
                      {data.winRate}% Win Rate
                    </div>
                    <div className="w-24 text-sm text-gray-600 text-right">
                      ${(data.revenue / 1000000).toFixed(1)}M
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Q2 Performance Report</p>
                      <p className="text-sm text-gray-500">Generated on May 15, 2024</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleExport(exportKpiReport, 'Q2 Performance')}
                    disabled={isExporting}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                  >
                    {isExporting ? 'Exporting...' : 'Download'}
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Win/Loss Analysis</p>
                      <p className="text-sm text-gray-500">Generated on May 10, 2024</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleExport(exportWinLossAnalysis, 'Win/Loss Analysis')}
                    disabled={isExporting}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                  >
                    {isExporting ? 'Exporting...' : 'Download'}
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Revenue Summary</p>
                      <p className="text-sm text-gray-500">Generated on May 5, 2024</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleExport(exportRevenueMetrics, 'Revenue Summary')}
                    disabled={isExporting}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                  >
                    {isExporting ? 'Exporting...' : 'Download'}
                  </button>
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports; 