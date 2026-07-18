import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { MenuBook, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', color: 'black', borderBottom: '1px solid #eee' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <MenuBook color="primary" />
          <Typography variant="h6" fontWeight={800} color="primary">BookNest</Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          {!token? (
            <>
              <Button onClick={() => navigate('/login')}>Login</Button>
              <Button variant="contained" onClick={() => navigate('/register')}>S'inscrire</Button>
            </>
          ) : (
            <>
              <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>{user.name?.[0]}</Avatar>
              <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
              <Button color="error" startIcon={<Logout />} onClick={logout}>Logout</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}