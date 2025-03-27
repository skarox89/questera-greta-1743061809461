import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DashboardBuilder from './pages/DashboardBuilder';
import ConfigureDatabase from './pages/ConfigureDatabase';
import { useDatabase } from './context/DatabaseContext';

function App() {
  const { dbConfig } = useDatabase();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={dbConfig ? <Dashboard /> : <ConfigureDatabase />} />
        <Route path="builder" element={<DashboardBuilder />} />
        <Route path="configure" element={<ConfigureDatabase />} />
      </Route>
    </Routes>
  );
}

export default App;