import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';
import { DashboardProvider } from './context/DashboardContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <DatabaseProvider>
        <DashboardProvider>
          <App />
        </DashboardProvider>
      </DatabaseProvider>
    </HashRouter>
  </StrictMode>
);