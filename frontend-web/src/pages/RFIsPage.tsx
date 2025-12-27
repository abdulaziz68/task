import React, { useEffect, useState } from 'react';
import { rfisAPI } from '../services/api';

const RFIsPage: React.FC = () => {
  const [rfis, setRfis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRfis();
  }, []);

  const loadRfis = async () => {
    try {
      const response = await rfisAPI.getAll();
      setRfis(response.data);
    } catch (error) {
      console.error('Error loading RFIs:', error);
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
        <h1 className="text-3xl font-bold text-gray-800">RFIs</h1>
        <p className="text-gray-600">Requests for Information - الاستفسارات</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {rfis.map((rfi) => (
            <div key={rfi.id} className="border-l-4 border-green-500 pl-4 py-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{rfi.subject}</h3>
                  <p className="text-sm text-gray-600 mt-1">{rfi.description}</p>
                  <div className="mt-2 space-x-4 text-sm">
                    <span className="text-gray-600">RFI #{rfi.rfi_number}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      rfi.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                      rfi.status === 'open' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rfi.status}
                    </span>
                    <span className="text-gray-600">Priority: {rfi.priority}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {rfis.length === 0 && (
            <div className="text-center py-12 text-gray-500">No RFIs found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFIsPage;
