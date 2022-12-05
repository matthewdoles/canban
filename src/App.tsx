import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages';
import Board from './pages/Board';

function App() {
  return (
    <div className="min-h-screen min-w-screen bg-secondary" style={{ fontFamily: 'Roboto' }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
