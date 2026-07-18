import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogue from './pages/user/Catalogue';
import MesEmprunts from './pages/user/MesEmprunts';
import Profile from './pages/user/Profile';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/user/catalogue" element={<Catalogue />} />
          <Route path="/user/emprunts" element={<MesEmprunts />} />
          <Route path="/user/historique" element={<MesEmprunts />} />
          <Route path="/user/profil" element={<Profile />} />

          <Route path="/" element={<Navigate to="/user/catalogue" replace />} />
          <Route path="*" element={<Navigate to="/user/catalogue" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}