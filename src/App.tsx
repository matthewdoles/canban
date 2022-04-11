import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Board from './pages/Board';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen min-w-screen bg-zinc-300 p-8" style={{ fontFamily: 'Roboto' }}>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
