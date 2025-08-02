import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './style.css';
import BookingForm from './components/BookingForm';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookingForm />} />
        <Route path="/admin" element={token ? <AdminPanel /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<AdminLogin setToken={setToken} />} />
        <Route path="*" element={<h2>404 – Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
