import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ActivityLog {
  id: number;
  action: string;
  username: string;
  full_name?: string;
  changes?: any;
  created_at: string;
}

interface ActivityTimelineProps {
  entityType: string;
  entityId: number;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ entityType, entityId }) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [entityType, entityId]);

  const loadActivities = async () => {
    try {
      const response = await axios.get(`/api/activity-logs/${entityType}/${entityId}`);
      setActivities(response.data);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'approve': return '✅';
      case 'reject': return '❌';
      case 'upload': return '📤';
      case 'download': return '📥';
      case 'comment': return '💬';
      default: return '📝';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'border-green-500';
      case 'update': return 'border-blue-500';
      case 'delete': return 'border-red-500';
      case 'approve': return 'border-green-600';
      case 'reject': return 'border-red-600';
      default: return 'border-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading activity...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Activity Timeline
        <span className="text-sm text-gray-500 mr-2">سجل النشاطات</span>
      </h3>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No activity recorded yet</p>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`border-l-4 ${getActionColor(activity.action)} pl-4 py-2`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getActionIcon(activity.action)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {activity.full_name || activity.username}
                    </span>
                    <span className="text-sm text-gray-600">
                      {activity.action}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.created_at).toLocaleString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {activity.changes && (
                    <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(activity.changes, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
