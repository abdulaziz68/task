import React, { useEffect, useState } from 'react';
import { engineersAPI } from '../services/api';

const EngineersPage: React.FC = () => {
  const [engineers, setEngineers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEngineers();
  }, []);

  const loadEngineers = async () => {
    try {
      const response = await engineersAPI.getAll();
      setEngineers(response.data);
    } catch (error) {
      console.error('Error loading engineers:', error);
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
        <h1 className="text-3xl font-bold text-gray-800">Engineers</h1>
        <p className="text-gray-600">المهندسين الخارجيين</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {engineers.map((engineer) => (
          <div key={engineer.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{engineer.name}</h3>
                <p className="text-sm text-gray-600">{engineer.specialization || 'Engineer'}</p>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-gray-700">📧 {engineer.email}</p>
                  {engineer.phone && <p className="text-gray-700">📱 {engineer.phone}</p>}
                  {engineer.company && <p className="text-gray-700">🏢 {engineer.company}</p>}
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${
                engineer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {engineer.status}
              </span>
            </div>
          </div>
        ))}
        {engineers.length === 0 && (
          <div className="col-span-full bg-white rounded-lg shadow p-12 text-center text-gray-500">
            No engineers found
          </div>
        )}
      </div>
    </div>
  );
};

export default EngineersPage;
