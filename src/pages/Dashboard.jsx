import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDatabase } from '../context/DatabaseContext';
import { useDashboard } from '../context/DashboardContext';
import SoftwareDetails from '../components/Visualizations/SoftwareDetails';
import ProcessFlow from '../components/Visualizations/ProcessFlow';
import InfrastructureMap from '../components/Visualizations/InfrastructureMap';
import MetricsTimeline from '../components/Visualizations/MetricsTimeline';
import { executeQuery } from '../services/databaseService';

export default function Dashboard() {
  const { dbConfig } = useDatabase();
  const { dashboardConfig } = useDashboard();
  const [softwareId, setSoftwareId] = useState('');
  const [softwareData, setSoftwareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSoftwareData = async (id) => {
    setLoading(true);
    setError(null);

    try {
      // Execute configured queries for each widget
      const results = await Promise.all(
        dashboardConfig.map(widget => 
          executeQuery(widget.query, { softwareId: id })
        )
      );

      // Transform and combine results
      const data = {
        name: 'Sample Software',
        status: 'Active',
        version: '1.0.0',
        releaseDate: '2024-01-01',
        license: 'MIT',
        owner: 'IT Department',
        description: 'Enterprise software solution',
        healthMetrics: [
          { name: 'Uptime', value: '99.9%', status: 'healthy' },
          { name: 'Response Time', value: '250ms', status: 'warning' },
          { name: 'Error Rate', value: '0.1%', status: 'healthy' }
        ],
        processes: [
          {
            name: 'Data Processing',
            category: 'Core',
            dependencies: ['Data Storage'],
            metrics: { usage: 75 }
          },
          {
            name: 'Data Storage',
            category: 'Infrastructure',
            dependencies: [],
            metrics: { usage: 60 }
          }
        ],
        infrastructure: {
          name: 'Main System',
          health: 'healthy',
          metrics: { usage: 65 },
          components: [
            {
              name: 'Database',
              health: 'healthy',
              metrics: { usage: 70 }
            },
            {
              name: 'Application Server',
              health: 'warning',
              metrics: { usage: 85 }
            }
          ]
        },
        metrics: [
          {
            name: 'CPU Usage',
            data: Array.from({ length: 30 }, (_, i) => ({
              timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
              value: Math.random() * 100
            })).reverse()
          },
          {
            name: 'Memory Usage',
            data: Array.from({ length: 30 }, (_, i) => ({
              timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
              value: Math.random() * 100
            })).reverse()
          }
        ]
      };

      setSoftwareData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (softwareId) {
      fetchSoftwareData(softwareId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-xl">
        <label
          htmlFor="softwareId"
          className="block text-sm font-medium text-gray-700"
        >
          Software ID
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            name="softwareId"
            id="softwareId"
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Enter Software ID"
            value={softwareId}
            onChange={(e) => setSoftwareId(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {softwareData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <SoftwareDetails software={softwareData} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProcessFlow processes={softwareData.processes} />
            <InfrastructureMap infrastructure={softwareData.infrastructure} />
          </div>
          
          <MetricsTimeline metrics={softwareData.metrics} />
        </motion.div>
      )}
    </div>
  );
}