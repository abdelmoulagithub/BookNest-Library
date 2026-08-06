import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogue from './pages/user/Catalogue';
import MesEmprunts from './pages/user/MesEmprunts';
import Profile from './pages/user/Profile';
import Dashboard from './pages/admin/Dashboard';
import Livres from './pages/admin/Livres';
import Emprunts from './pages/admin/Emprunts';
import Utilisateurs from './pages/admin/Utilisateurs';

export default function App() {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route path="/user/catalogue" element={token ? <Catalogue /> : <Navigate to="/login" />} />
        <Route path="/user/emprunts" element={token ? <MesEmprunts /> : <Navigate to="/login" />} />
        <Route path="/user/profil" element={token ? <Profile /> : <Navigate to="/login" />} />

        {/* ADMIN */}
        <Route path="/admin" element={token && role === 'ADMIN' ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/dashboard" element={token && role === 'ADMIN' ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/livres" element={token && role === 'ADMIN' ? <Livres /> : <Navigate to="/login" />} />
        <Route path="/admin/emprunts" element={token && role === 'ADMIN' ? <Emprunts /> : <Navigate to="/login" />} />
        {/* 7al mochkil hna - bdlna Dashboard l Utilisateurs */}
        <Route path="/admin/users" element={token && role === 'ADMIN' ? <Utilisateurs /> : <Navigate to="/login" />} />
        <Route path="/admin/utilisateurs" element={token && role === 'ADMIN' ? <Utilisateurs /> : <Navigate to="/login" />} />

        {/* ROOT */}
        <Route path="/" element={
          !token ? <Navigate to="/login" /> : 
          role === 'ADMIN' ? <Navigate to="/admin" /> : 
          <Navigate to="/user/catalogue" />
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}