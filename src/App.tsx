import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppSelector } from './hooks';
import Board from './pages/Board';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  const user = useAppSelector((state) => state.user.firebaseUser);
  return (
    <div className="min-h-screen min-w-screen bg-zinc-300" style={{ fontFamily: 'Roboto' }}>
      {user === null ? (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/board/:id" element={<Board />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
