import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Conversor from './pages/Conversor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/conversor" element={<Conversor />} />
      </Routes>
    </Router>
  );
}

export default App;
