import React, { useEffect, useState } from 'react';
import { meetingsAPI } from '../services/api';

const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const response = await meetingsAPI.getAll();
      setMeetings(response.data);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Meeting Minutes</h1>
        <p className="text-gray-600">محاضر الاجتماعات</p>
      </div>

      <div className="grid gap-6">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{meeting.title}</h3>
                <p className="text-sm text-gray-600 mt-1">Meeting #{meeting.meeting_number}</p>
                <p className="text-sm text-gray-600">Date: {new Date(meeting.meeting_date).toLocaleDateString()}</p>
                {meeting.location && <p className="text-sm text-gray-600">Location: {meeting.location}</p>}
              </div>
            </div>
            {meeting.agenda && (
              <div className="mt-4">
                <h4 className="font-semibold text-sm">Agenda:</h4>
                <p className="text-sm text-gray-700 mt-1">{meeting.agenda}</p>
              </div>
            )}
          </div>
        ))}
        {meetings.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            No meeting minutes found
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;
