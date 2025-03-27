import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

export default function SoftwareDetails({ software }) {
  const getStatusColor = (status) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      deprecated: 'bg-red-100 text-red-800',
      development: 'bg-blue-100 text-blue-800'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{software.name}</h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(software.status)}`}>
            {software.status}
          </div>
          <p className="mt-4 text-gray-600">{software.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Key Information</h3>
            <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Version</dt>
                <dd className="mt-1 text-sm text-gray-900">{software.version}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Release Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(software.releaseDate), 'MMM dd, yyyy')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">License</dt>
                <dd className="mt-1 text-sm text-gray-900">{software.license}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Owner</dt>
                <dd className="mt-1 text-sm text-gray-900">{software.owner}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Health Status</h3>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {software.healthMetrics?.map((metric, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center">
                    {metric.status === 'healthy' && <FaCheckCircle className="text-green-500" />}
                    {metric.status === 'warning' && <FaExclamationTriangle className="text-yellow-500" />}
                    {metric.status === 'critical' && <FaInfoCircle className="text-red-500" />}
                    <span className="ml-2 text-sm font-medium text-gray-900">{metric.name}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}