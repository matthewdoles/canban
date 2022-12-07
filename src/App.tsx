import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages';
import Board from './pages/Board';
import Demo from './pages/Demo';

function App() {
  return (
    <div className="min-h-screen min-w-screen bg-secondary" style={{ fontFamily: 'Roboto' }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
