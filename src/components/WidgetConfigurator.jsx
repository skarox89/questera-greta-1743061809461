import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import QueryBuilder from './QueryBuilder/QueryBuilder';

export default function WidgetConfigurator({ 
  widgetType, 
  onSave, 
  onCancel, 
  initialConfig = {} 
}) {
  const [config, setConfig] = useState({
    title: initialConfig.title || '',
    query: initialConfig.query || '',
    refreshInterval: initialConfig.refreshInterval || '0',
    variables: initialConfig.variables || [],
  });

  const handleQueryChange = (query) => {
    setConfig(prev => ({ ...prev, query }));
  };

  const handleVariablesChange = (variables) => {
    setConfig(prev => ({ ...prev, variables }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 space-y-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Configure {widgetType} Widget</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Widget Title
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Enter widget title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Refresh Interval (seconds)
          </label>
          <input
            type="number"
            value={config.refreshInterval}
            onChange={(e) => setConfig(prev => ({ ...prev, refreshInterval: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            min="0"
            step="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Query Builder
          </label>
          <QueryBuilder
            initialQuery={config.query}
            initialVariables={config.variables}
            onQueryChange={handleQueryChange}
            onVariablesChange={handleVariablesChange}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(config)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Save Widget
        </button>
      </div>
    </motion.div>
  );
}