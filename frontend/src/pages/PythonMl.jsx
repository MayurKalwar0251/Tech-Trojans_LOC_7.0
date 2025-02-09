import React, { useState } from 'react';

const CrimeMapViewer = () => {
  const [loading, setLoading] = useState(false);
  const [mapUrl, setMapUrl] = useState('');
  const [error, setError] = useState('');

  const generateMap = async (e) => {
    e.preventDefault()
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:5000/generate_map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: 19.0999,
          longitude: 72.8519
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate map');
      }

      const data = await response.json();
      setMapUrl(data.map_url);
    } catch (err) {
      setError('Error generating map: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="space-y-4">
          <button 
            onClick={generateMap} 
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            {loading && (
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            Generate Crime Map
          </button>

          {error && (
            <div className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {mapUrl && (
            <div className="mt-4">
              <iframe
                src={"http://127.0.0.1:5000/view_map"}
                className="w-full h-96 border border-gray-200 rounded-lg"
                title="Crime Map"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrimeMapViewer;