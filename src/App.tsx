import React, { Suspense, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import Loading from './components/ui/Loading';
import { ShieldAlert } from 'lucide-react';

// Lazy load pages for performance optimization
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const FrontCamera = React.lazy(() => import('./pages/camera/FrontCamera'));
const BackCamera = React.lazy(() => import('./pages/camera/BackCamera'));
const Attendance = React.lazy(() => import('./pages/Attendance'));
// PhysicalHealth and Recap mapping
const MentalHealth = React.lazy(() => import('./pages/MentalHealth'));
const PhysicalHealth = React.lazy(() => import('./pages/PhysicalHealth'));
const Recap = React.lazy(() => import('./pages/Recap'));

type RoleGateProps = {
  allowed: string[];
  children: React.ReactNode;
};

function RoleGate({ allowed, children }: RoleGateProps) {
  const role = useMemo(() => {
    if (typeof window === 'undefined') return 'admin';
    return localStorage.getItem('role') || 'admin';
  }, []);

  if (!allowed.includes(role)) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center space-y-3">
        <ShieldAlert className="mx-auto text-rose-500" size={32} />
        <h1 className="text-xl font-semibold text-gray-900">Akses dibatasi</h1>
        <p className="text-sm text-gray-500">Halaman ini hanya dapat diakses oleh admin atau atasan.</p>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="camera/front" element={<FrontCamera />} />
            <Route path="camera/back" element={<BackCamera />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="mental-health" element={<MentalHealth />} />
            <Route path="physical-health" element={<PhysicalHealth />} />
            <Route
              path="recap"
              element={(
                <RoleGate allowed={['admin', 'atasan']}>
                  <Recap />
                </RoleGate>
              )}
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
