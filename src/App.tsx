import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Board from './pages/Board';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

function App() {
  return (
    <div className="min-h-screen min-w-screen bg-zinc-300" style={{ fontFamily: 'Roboto' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
