import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAppSelector } from './hooks';

import Login from './pages/Login';

function App() {
  const profile = useAppSelector((state) => state.profile.profile);
  return (
    <div className="min-h-screen min-w-screen bg-secondary" style={{ fontFamily: 'Roboto' }}>
      {profile === null ? (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
