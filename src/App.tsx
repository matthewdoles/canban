import React from 'react';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Board from './pages/Board';
import Dashboard from './pages/Dashboard';
import { store } from './store/configureReducer';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen min-w-screen bg-zinc-300" style={{ fontFamily: 'Roboto' }}>
        <Routes>
          <Route path="/board/:id" element={<Board />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
