import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ConversorEstrutura from './pages/ConversorEstrutura';
import Admin from './pages/Admin';
import Relatorio from './pages/Relatorio';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/conversor" element={<ConversorEstrutura />} />
        <Route path="/admin" element={<Admin />} />
        <Route path='/relatorio' element={<Relatorio />} />
      </Routes>
    </Router>
  );
}

export default App;
