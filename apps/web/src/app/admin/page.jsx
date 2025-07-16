import { useState, useEffect } from 'react';
import useUser from '@/utils/useUser';
import { Users, Clock, Calendar, Settings, BarChart3, QrCode } from 'lucide-react';

export default function AdminPanel() {
  const { data: user, loading } = useUser();
  const [employees, setEmployees] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeToday: 0,
    totalHours: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    if (user) {
      fetchEmployees();
      fetchTimeEntries();
      fetchStats();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTimeEntries = async () => {
    try {
      const response = await fetch('/api/time-entries');
      if (response.ok) {
        const data = await response.json();
        setTimeEntries(data);
      }
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayEntries = timeEntries.filter(entry => 
        entry.entry_date === today
      );
      
      setStats({
        totalEmployees: employees.length,
        activeToday: todayEntries.filter(entry => !entry.clock_out_time).length,
        totalHours: todayEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0),
        pendingRequests: 0
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the admin panel</p>
          <a 
            href="/account/signin" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'employees', name: 'Employees', icon: Users },
    { id: 'timesheet', name: 'Timesheet', icon: Clock },
    { id: 'qr-codes', name: 'QR Codes', icon: QrCode },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">OLA Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <a 
                href="/account/logout" 
                className="text-sm text-red-600 hover:text-red-700"
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Today</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeToday}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hours Today</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalHours.toFixed(1)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {timeEntries.slice(0, 5).map((entry, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-900">
                          Employee clocked {entry.clock_out_time ? 'out' : 'in'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.clock_in_time).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Employee Management</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.member_code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-4">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Timesheet Tab */}
        {activeTab === 'timesheet' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Timesheet Overview</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <a 
                  href="/timesheet" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  View Full Timesheet
                </a>
              </div>
              <p className="text-gray-600">
                Access detailed timesheet reports, export data, and manage employee hours.
              </p>
            </div>
          </div>
        )}

        {/* QR Codes Tab */}
        {activeTab === 'qr-codes' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">QR Code Management</h3>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Generate QR Codes for Mobile App
                </h4>
                <p className="text-gray-600 mb-6">
                  Create QR codes that employees can scan with the mobile app to clock in/out
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Generate QR Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Work Schedule</h4>
                  <p className="text-sm text-gray-600">Configure default work hours and break times</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Overtime Rules</h4>
                  <p className="text-sm text-gray-600">Set overtime calculation rules and rates</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Holidays</h4>
                  <p className="text-sm text-gray-600">Manage public holidays and special dates</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Notifications</h4>
                  <p className="text-sm text-gray-600">Configure email and SMS notifications</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}