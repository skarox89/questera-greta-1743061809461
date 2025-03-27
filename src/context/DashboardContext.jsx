import { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [dashboardConfig, setDashboardConfig] = useState(() => {
    const saved = localStorage.getItem('dashboardConfig');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dashboardConfig', JSON.stringify(dashboardConfig));
  }, [dashboardConfig]);

  const addWidget = (widget) => {
    setDashboardConfig(prev => [...prev, widget]);
  };

  const updateWidget = (id, updates) => {
    setDashboardConfig(prev =>
      prev.map(widget => widget.id === id ? { ...widget, ...updates } : widget)
    );
  };

  const removeWidget = (id) => {
    setDashboardConfig(prev => prev.filter(widget => widget.id !== id));
  };

  const reorderWidgets = (startIndex, endIndex) => {
    setDashboardConfig(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  return (
    <DashboardContext.Provider value={{
      dashboardConfig,
      addWidget,
      updateWidget,
      removeWidget,
      reorderWidgets
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}