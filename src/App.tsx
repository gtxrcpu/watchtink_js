import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import Loading from './components/ui/Loading';

// Lazy load pages for performance optimization
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const FrontCamera = React.lazy(() => import('./pages/camera/FrontCamera'));
const BackCamera = React.lazy(() => import('./pages/camera/BackCamera'));
const Attendance = React.lazy(() => import('./pages/Attendance'));
// PhysicalHealth and Recap mapping
const MentalHealth = React.lazy(() => import('./pages/MentalHealth'));
const PhysicalHealth = React.lazy(() => import('./pages/PhysicalHealth'));
const Recap = React.lazy(() => import('./pages/Recap'));

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
            <Route path="recap" element={<Recap />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
