import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">لوحة التحكم</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Link
          to="/shop-drawings"
          className="bg-blue-500 text-white rounded-lg p-6 shadow-lg hover:bg-blue-600 transition"
        >
          <div className="text-4xl font-bold">{stats?.totals?.shopDrawings || 0}</div>
          <div className="text-sm mt-2">Shop Drawings</div>
          <div className="text-xs opacity-80">الرسومات التنفيذية</div>
        </Link>

        <Link
          to="/rfis"
          className="bg-green-500 text-white rounded-lg p-6 shadow-lg hover:bg-green-600 transition"
        >
          <div className="text-4xl font-bold">{stats?.totals?.rfis || 0}</div>
          <div className="text-sm mt-2">RFIs</div>
          <div className="text-xs opacity-80">الاستفسارات</div>
        </Link>

        <Link
          to="/meetings"
          className="bg-purple-500 text-white rounded-lg p-6 shadow-lg hover:bg-purple-600 transition"
        >
          <div className="text-4xl font-bold">{stats?.totals?.meetings || 0}</div>
          <div className="text-sm mt-2">Meetings</div>
          <div className="text-xs opacity-80">محاضر الاجتماعات</div>
        </Link>

        <Link
          to="/engineers"
          className="bg-orange-500 text-white rounded-lg p-6 shadow-lg hover:bg-orange-600 transition"
        >
          <div className="text-4xl font-bold">{stats?.totals?.engineers || 0}</div>
          <div className="text-sm mt-2">Engineers</div>
          <div className="text-xs opacity-80">المهندسين</div>
        </Link>

        <Link
          to="/tasks"
          className="bg-red-500 text-white rounded-lg p-6 shadow-lg hover:bg-red-600 transition"
        >
          <div className="text-4xl font-bold">{stats?.totals?.tasks || 0}</div>
          <div className="text-sm mt-2">Tasks</div>
          <div className="text-xs opacity-80">المهام</div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
          <div className="space-y-3">
            {stats?.recentTasks?.map((task: any) => (
              <div key={task.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-600">
                  Status: <span className="font-semibold">{task.status}</span> | 
                  Priority: <span className="font-semibold">{task.priority}</span>
                </div>
              </div>
            ))}
            {(!stats?.recentTasks || stats.recentTasks.length === 0) && (
              <div className="text-gray-500 text-center py-4">No recent tasks</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent RFIs</h2>
          <div className="space-y-3">
            {stats?.recentRfis?.map((rfi: any) => (
              <div key={rfi.id} className="border-l-4 border-green-500 pl-4 py-2">
                <div className="font-medium">{rfi.subject}</div>
                <div className="text-sm text-gray-600">
                  RFI #{rfi.rfi_number} | Status: <span className="font-semibold">{rfi.status}</span>
                </div>
              </div>
            ))}
            {(!stats?.recentRfis || stats.recentRfis.length === 0) && (
              <div className="text-gray-500 text-center py-4">No recent RFIs</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
