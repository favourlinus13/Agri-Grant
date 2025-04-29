import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import FarmerPage from './pages/FarmerPage';
import Nav from "./components/Nav"

function App() {
  return (
    <Router>
      <div className="container mt-5" style={{ paddingTop: '70px' }}>
        <Nav />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/farmer" element={<FarmerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



