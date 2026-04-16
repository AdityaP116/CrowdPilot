import { createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCrowdData } from './hooks/useCrowdData';
import WebNavbar from './components/WebNavbar';
import Home from './pages/user/Home';
import CrowdMap from './pages/user/CrowdMap';
import QueueStatus from './pages/user/QueueStatus';
import Alerts from './pages/user/Alerts';
import Dashboard from './pages/admin/Dashboard';

export const CrowdContext = createContext(null);

function AppShell() {
  const crowdData = useCrowdData();
  const alertCount = crowdData.alerts?.filter(a => a.severity === 'high').length ?? 0;

  return (
    <CrowdContext.Provider value={crowdData}>
      <WebNavbar alertCount={alertCount} />
      
      <main className="main-content">
        <Routes>
          {/* User Routes */}
          <Route path="/"       element={<Home />} />
          <Route path="/map"    element={<CrowdMap />} />
          <Route path="/queue"  element={<QueueStatus />} />
          <Route path="/alerts" element={<Alerts />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </main>
    </CrowdContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
