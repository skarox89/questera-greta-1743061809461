import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { testConnection } from '../services/databaseService';
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function ConfigureDatabase() {
  const navigate = useNavigate();
  const { dbConfig, saveConfig, clearConfig, connectionStatus, setConnectionStatus } = useDatabase();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    if (dbConfig) {
      setFormState({
        ...dbConfig,
        password: '' // Don't show saved password
      });
    }
  }, [dbConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await testConnection(formState);
    
    setConnectionStatus({
      isConnected: result.success,
      error: result.error
    });
    
    setIsLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await testConnection(formState);
    
    if (result.success) {
      saveConfig(formState);
      setConnectionStatus({ isConnected: true, error: null });
      navigate('/');
    } else {
      setConnectionStatus({
        isConnected: false,
        error: result.error
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Database Configuration</h2>
          {dbConfig && (
            <button
              onClick={clearConfig}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear Configuration
            </button>
          )}
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="host" className="block text-sm font-medium text-gray-700">
                Host
              </label>
              <input
                type="text"
                name="host"
                id="host"
                value={formState.host}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="localhost"
              />
            </div>

            <div>
              <label htmlFor="port" className="block text-sm font-medium text-gray-700">
                Port
              </label>
              <input
                type="text"
                name="port"
                id="port"
                value={formState.port}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="5432"
              />
            </div>
          </div>

          <div>
            <label htmlFor="database" className="block text-sm font-medium text-gray-700">
              Database Name
            </label>
            <input
              type="text"
              name="database"
              id="database"
              value={formState.database}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formState.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formState.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          {connectionStatus.error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <FaExclamationCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {connectionStatus.error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {connectionStatus.isConnected && !connectionStatus.error && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <FaCheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Connection successful!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleTest}
              disabled={isLoading}
              className="flex-1 inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin h-5 w-5 mr-2" />
              ) : (
                'Test Connection'
              )}
            </button>

            <button
              type="submit"
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin h-5 w-5 mr-2" />
              ) : (
                'Save Configuration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}