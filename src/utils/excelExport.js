import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Generate comprehensive dummy data for KPIs
const generateKpiData = (period) => {
  const currentDate = new Date();
  let startDate, endDate, periodLabel;
  
  switch (period) {
    case 'week':
      startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = currentDate;
      periodLabel = 'This Week';
      break;
    case 'month':
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = currentDate;
      periodLabel = 'This Month';
      break;
    case 'quarter':
      const quarter = Math.floor(currentDate.getMonth() / 3);
      startDate = new Date(currentDate.getFullYear(), quarter * 3, 1);
      endDate = currentDate;
      periodLabel = 'This Quarter';
      break;
    case 'year':
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      endDate = currentDate;
      periodLabel = 'This Year';
      break;
    default:
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = currentDate;
      periodLabel = 'This Month';
  }

  // RFP Performance Data
  const rfpPerformance = [
    { month: 'Jan', submitted: 12, won: 8, lost: 4, winRate: 67, avgValue: 125000, totalRevenue: 1000000 },
    { month: 'Feb', submitted: 15, won: 10, lost: 5, winRate: 67, avgValue: 135000, totalRevenue: 1350000 },
    { month: 'Mar', submitted: 18, won: 12, lost: 6, winRate: 67, avgValue: 142000, totalRevenue: 1704000 },
    { month: 'Apr', submitted: 14, won: 9, lost: 5, winRate: 64, avgValue: 138000, totalRevenue: 1242000 },
    { month: 'May', submitted: 16, won: 11, lost: 5, winRate: 69, avgValue: 145000, totalRevenue: 1595000 },
    { month: 'Jun', submitted: 20, won: 14, lost: 6, winRate: 70, avgValue: 150000, totalRevenue: 2100000 }
  ];

  // Win/Loss Analysis
  const winLossAnalysis = [
    { category: 'Defense Systems', submitted: 25, won: 18, lost: 7, winRate: 72, avgValue: 180000 },
    { category: 'Cybersecurity', submitted: 20, won: 14, lost: 6, winRate: 70, avgValue: 220000 },
    { category: 'Logistics', submitted: 15, won: 9, lost: 6, winRate: 60, avgValue: 95000 },
    { category: 'Training', submitted: 12, won: 8, lost: 4, winRate: 67, avgValue: 75000 },
    { category: 'Infrastructure', submitted: 18, won: 11, lost: 7, winRate: 61, avgValue: 320000 },
    { category: 'Software', submitted: 22, won: 16, lost: 6, winRate: 73, avgValue: 185000 }
  ];

  // Team Productivity Data
  const teamProductivity = [
    { teamMember: 'John Smith', rfpsHandled: 15, winRate: 73, avgResponseTime: 2.5, clientSatisfaction: 4.8 },
    { teamMember: 'Sarah Johnson', rfpsHandled: 18, winRate: 78, avgResponseTime: 2.1, clientSatisfaction: 4.9 },
    { teamMember: 'Mike Davis', rfpsHandled: 12, winRate: 67, avgResponseTime: 3.2, clientSatisfaction: 4.6 },
    { teamMember: 'Emma Wilson', rfpsHandled: 20, winRate: 75, avgResponseTime: 2.3, clientSatisfaction: 4.7 },
    { teamMember: 'David Brown', rfpsHandled: 14, winRate: 71, avgResponseTime: 2.8, clientSatisfaction: 4.5 },
    { teamMember: 'Lisa Anderson', rfpsHandled: 16, winRate: 69, avgResponseTime: 2.9, clientSatisfaction: 4.8 }
  ];

  // Client Satisfaction Data
  const clientSatisfaction = [
    { client: 'ABC Corporation', projects: 8, satisfaction: 4.8, repeatBusiness: 'Yes', avgResponseTime: 2.1 },
    { client: 'XYZ Ltd.', projects: 12, satisfaction: 4.6, repeatBusiness: 'Yes', avgResponseTime: 2.3 },
    { client: 'DEF Solutions', projects: 6, satisfaction: 4.9, repeatBusiness: 'Yes', avgResponseTime: 1.9 },
    { client: 'GHI Systems', projects: 10, satisfaction: 4.7, repeatBusiness: 'Yes', avgResponseTime: 2.4 },
    { client: 'LMN Industries', projects: 5, satisfaction: 4.5, repeatBusiness: 'No', avgResponseTime: 3.1 },
    { client: 'PQR Enterprises', projects: 9, satisfaction: 4.8, repeatBusiness: 'Yes', avgResponseTime: 2.2 }
  ];

  // Timeline Analysis
  const timelineAnalysis = [
    { phase: 'Proposal Development', avgDays: 5, minDays: 3, maxDays: 8, efficiency: 85 },
    { phase: 'Client Review', avgDays: 3, minDays: 1, maxDays: 7, efficiency: 78 },
    { phase: 'Revision Cycles', avgDays: 2, minDays: 1, maxDays: 4, efficiency: 92 },
    { phase: 'Final Submission', avgDays: 1, minDays: 1, maxDays: 2, efficiency: 95 },
    { phase: 'Client Decision', avgDays: 8, minDays: 3, maxDays: 15, efficiency: 65 },
    { phase: 'Contract Signing', avgDays: 3, minDays: 1, maxDays: 7, efficiency: 88 }
  ];

  // Revenue Metrics
  const revenueMetrics = [
    { month: 'Jan', totalRevenue: 1000000, newBusiness: 650000, repeatBusiness: 350000, growthRate: 12 },
    { month: 'Feb', totalRevenue: 1350000, newBusiness: 850000, repeatBusiness: 500000, growthRate: 35 },
    { month: 'Mar', totalRevenue: 1704000, newBusiness: 1100000, repeatBusiness: 604000, growthRate: 26 },
    { month: 'Apr', totalRevenue: 1242000, newBusiness: 780000, repeatBusiness: 462000, growthRate: -27 },
    { month: 'May', totalRevenue: 1595000, newBusiness: 950000, repeatBusiness: 645000, growthRate: 28 },
    { month: 'Jun', totalRevenue: 2100000, newBusiness: 1250000, repeatBusiness: 850000, growthRate: 32 }
  ];

  return {
    periodLabel,
    startDate: startDate.toLocaleDateString(),
    endDate: endDate.toLocaleDateString(),
    rfpPerformance,
    winLossAnalysis,
    teamProductivity,
    clientSatisfaction,
    timelineAnalysis,
    revenueMetrics
  };
};

// Export comprehensive KPI report to Excel
export const exportKpiReport = (period = 'month') => {
  const data = generateKpiData(period);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Summary Dashboard
  const summaryData = [
    ['RFP TRACKER - KPI REPORT'],
    [''],
    [`Period: ${data.periodLabel}`],
    [`Date Range: ${data.startDate} to ${data.endDate}`],
    [`Generated: ${new Date().toLocaleString()}`],
    [''],
    ['KEY PERFORMANCE INDICATORS'],
    [''],
    ['Metric', 'Value', 'Target', 'Status'],
    ['Total RFPs Submitted', data.rfpPerformance.reduce((sum, item) => sum + item.submitted, 0), '100', 'On Track'],
    ['Overall Win Rate', `${Math.round(data.rfpPerformance.reduce((sum, item) => sum + item.winRate, 0) / data.rfpPerformance.length)}%`, '70%', 'Above Target'],
    ['Total Revenue', `$${(data.revenueMetrics.reduce((sum, item) => sum + item.totalRevenue, 0) / 1000000).toFixed(1)}M`, '$8M', 'On Track'],
    ['Average Response Time', '2.5 days', '3 days', 'Above Target'],
    ['Client Satisfaction', '4.7/5.0', '4.5/5.0', 'Above Target']
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary Dashboard');
  
  // RFP Performance
  const rfpSheetData = [
    ['RFP PERFORMANCE BY MONTH'],
    [''],
    ['Month', 'Submitted', 'Won', 'Lost', 'Win Rate (%)', 'Avg Value ($)', 'Total Revenue ($)'],
    ...data.rfpPerformance.map(item => [
      item.month,
      item.submitted,
      item.won,
      item.lost,
      item.winRate,
      item.avgValue.toLocaleString(),
      item.totalRevenue.toLocaleString()
    ])
  ];
  
  const rfpSheet = XLSX.utils.aoa_to_sheet(rfpSheetData);
  XLSX.utils.book_append_sheet(workbook, rfpSheet, 'RFP Performance');
  
  // Win/Loss Analysis
  const winLossSheetData = [
    ['WIN/LOSS ANALYSIS BY CATEGORY'],
    [''],
    ['Category', 'Submitted', 'Won', 'Lost', 'Win Rate (%)', 'Avg Value ($)'],
    ...data.winLossAnalysis.map(item => [
      item.category,
      item.submitted,
      item.won,
      item.lost,
      item.winRate,
      item.avgValue.toLocaleString()
    ])
  ];
  
  const winLossSheet = XLSX.utils.aoa_to_sheet(winLossSheetData);
  XLSX.utils.book_append_sheet(workbook, winLossSheet, 'Win Loss Analysis');
  
  // Team Productivity
  const teamSheetData = [
    ['TEAM PRODUCTIVITY METRICS'],
    [''],
    ['Team Member', 'RFPs Handled', 'Win Rate (%)', 'Avg Response Time (days)', 'Client Satisfaction (5.0)'],
    ...data.teamProductivity.map(item => [
      item.teamMember,
      item.rfpsHandled,
      item.winRate,
      item.avgResponseTime,
      item.clientSatisfaction
    ])
  ];
  
  const teamSheet = XLSX.utils.aoa_to_sheet(teamSheetData);
  XLSX.utils.book_append_sheet(workbook, teamSheet, 'Team Productivity');
  
  // Client Satisfaction
  const clientSheetData = [
    ['CLIENT SATISFACTION ANALYSIS'],
    [''],
    ['Client', 'Projects', 'Satisfaction (5.0)', 'Repeat Business', 'Avg Response Time (days)'],
    ...data.clientSatisfaction.map(item => [
      item.client,
      item.projects,
      item.satisfaction,
      item.repeatBusiness,
      item.avgResponseTime
    ])
  ];
  
  const clientSheet = XLSX.utils.aoa_to_sheet(clientSheetData);
  XLSX.utils.book_append_sheet(workbook, clientSheet, 'Client Satisfaction');
  
  // Timeline Analysis
  const timelineSheetData = [
    ['TIMELINE ANALYSIS'],
    [''],
    ['Phase', 'Avg Days', 'Min Days', 'Max Days', 'Efficiency (%)'],
    ...data.timelineAnalysis.map(item => [
      item.phase,
      item.avgDays,
      item.minDays,
      item.maxDays,
      item.efficiency
    ])
  ];
  
  const timelineSheet = XLSX.utils.aoa_to_sheet(timelineSheetData);
  XLSX.utils.book_append_sheet(workbook, timelineSheet, 'Timeline Analysis');
  
  // Revenue Metrics
  const revenueSheetData = [
    ['REVENUE METRICS'],
    [''],
    ['Month', 'Total Revenue ($)', 'New Business ($)', 'Repeat Business ($)', 'Growth Rate (%)'],
    ...data.revenueMetrics.map(item => [
      item.month,
      item.totalRevenue.toLocaleString(),
      item.newBusiness.toLocaleString(),
      item.repeatBusiness.toLocaleString(),
      item.growthRate
    ])
  ];
  
  const revenueSheet = XLSX.utils.aoa_to_sheet(revenueSheetData);
  XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Revenue Metrics');
  
  // Generate filename
  const filename = `RFP_KPI_Report_${data.periodLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Save the file
  XLSX.writeFile(workbook, filename);
};

// Export specific report types
export const exportRfpPerformance = (period = 'month') => {
  const data = generateKpiData(period);
  
  const workbook = XLSX.utils.book_new();
  const sheetData = [
    ['RFP PERFORMANCE REPORT'],
    [''],
    [`Period: ${data.periodLabel}`],
    [`Generated: ${new Date().toLocaleString()}`],
    [''],
    ['Month', 'Submitted', 'Won', 'Lost', 'Win Rate (%)', 'Avg Value ($)', 'Total Revenue ($)'],
    ...data.rfpPerformance.map(item => [
      item.month,
      item.submitted,
      item.won,
      item.lost,
      item.winRate,
      item.avgValue.toLocaleString(),
      item.totalRevenue.toLocaleString()
    ])
  ];
  
  const sheet = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, sheet, 'RFP Performance');
  
  const filename = `RFP_Performance_${data.periodLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

export const exportWinLossAnalysis = (period = 'month') => {
  const data = generateKpiData(period);
  
  const workbook = XLSX.utils.book_new();
  const sheetData = [
    ['WIN/LOSS ANALYSIS REPORT'],
    [''],
    [`Period: ${data.periodLabel}`],
    [`Generated: ${new Date().toLocaleString()}`],
    [''],
    ['Category', 'Submitted', 'Won', 'Lost', 'Win Rate (%)', 'Avg Value ($)'],
    ...data.winLossAnalysis.map(item => [
      item.category,
      item.submitted,
      item.won,
      item.lost,
      item.winRate,
      item.avgValue.toLocaleString()
    ])
  ];
  
  const sheet = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, sheet, 'Win Loss Analysis');
  
  const filename = `Win_Loss_Analysis_${data.periodLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

export const exportTeamProductivity = (period = 'month') => {
  const data = generateKpiData(period);
  
  const workbook = XLSX.utils.book_new();
  const sheetData = [
    ['TEAM PRODUCTIVITY REPORT'],
    [''],
    [`Period: ${data.periodLabel}`],
    [`Generated: ${new Date().toLocaleString()}`],
    [''],
    ['Team Member', 'RFPs Handled', 'Win Rate (%)', 'Avg Response Time (days)', 'Client Satisfaction (5.0)'],
    ...data.teamProductivity.map(item => [
      item.teamMember,
      item.rfpsHandled,
      item.winRate,
      item.avgResponseTime,
      item.clientSatisfaction
    ])
  ];
  
  const sheet = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, sheet, 'Team Productivity');
  
  const filename = `Team_Productivity_${data.periodLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

export const exportRevenueMetrics = (period = 'month') => {
  const data = generateKpiData(period);
  
  const workbook = XLSX.utils.book_new();
  const sheetData = [
    ['REVENUE METRICS REPORT'],
    [''],
    [`Period: ${data.periodLabel}`],
    [`Generated: ${new Date().toLocaleString()}`],
    [''],
    ['Month', 'Total Revenue ($)', 'New Business ($)', 'Repeat Business ($)', 'Growth Rate (%)'],
    ...data.revenueMetrics.map(item => [
      item.month,
      item.totalRevenue.toLocaleString(),
      item.newBusiness.toLocaleString(),
      item.repeatBusiness.toLocaleString(),
      item.growthRate
    ])
  ];
  
  const sheet = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, sheet, 'Revenue Metrics');
  
  const filename = `Revenue_Metrics_${data.periodLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
}; 