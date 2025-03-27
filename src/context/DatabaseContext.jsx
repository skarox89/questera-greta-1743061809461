import { createContext, useContext, useState } from 'react';

const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const [dbConfig, setDbConfig] = useState(() => {
    const savedConfig = localStorage.getItem('dbConfig');
    return savedConfig ? JSON.parse(savedConfig) : null;
  });

  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    error: null
  });

  const saveConfig = (config) => {
    localStorage.setItem('dbConfig', JSON.stringify(config));
    setDbConfig(config);
  };

  const clearConfig = () => {
    localStorage.removeItem('dbConfig');
    setDbConfig(null);
    setConnectionStatus({ isConnected: false, error: null });
  };

  return (
    <DatabaseContext.Provider 
      value={{ 
        dbConfig, 
        connectionStatus, 
        setConnectionStatus, 
        saveConfig, 
        clearConfig 
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}