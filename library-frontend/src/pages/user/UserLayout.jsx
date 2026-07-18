import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Avatar } from '@mui/material';
import { MenuBook, Bookmark, Person, Logout } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const menu = [
  { label: 'Catalogue', icon: <MenuBook />, path: '/user/catalogue' },
  { label: 'Mes Emprunts', icon: <Bookmark />, path: '/user/emprunts' },
  { label: 'Profil', icon: <Person />, path: '/user/profil' },
];

export default function UserLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fb' }}>
      <Box sx={{ width: 260, bgcolor: 'white', borderRight: '1px solid #eef0f3', position: 'fixed', height: '100vh', p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" alignItems="center" gap={1.5} p={1} mb={2}>
          <Box sx={{ width: 32, height: 32, bgcolor: '#111', color: 'white', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>B</Box>
          <Typography fontWeight={800}>BookNest</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#111827', color: 'white', p: 1.5, borderRadius: 3, mb: 3 }}>
          <Avatar sx={{ width: 38, height: 38 }}>{user.name?.[0]?.toUpperCase()}</Avatar>
          <Box sx={{ overflow: 'hidden' }}><Typography fontSize={13} fontWeight={600} noWrap>{user.name}</Typography><Typography fontSize={11} sx={{ opacity: 0.6 }} noWrap>{user.email}</Typography></Box>
        </Box>
        <List sx={{ flex: 1, p: 0 }}>
          {menu.map(m => {
            const active = location.pathname === m.path;
            return <ListItem key={m.path} button onClick={() => navigate(m.path)} sx={{ borderRadius: 3, mb: 1, cursor: 'pointer', bgcolor: active? '#5b5bff' : 'transparent', color: active? 'white' : '#6b7280', '&:hover': { bgcolor: active? '#5b5bff' : '#f4f6f9' } }}><ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{m.icon}</ListItemIcon><ListItemText primary={m.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active? 700 : 500 }} /></ListItem>;
          })}
        </List>
        <Box onClick={() => { localStorage.clear(); navigate('/login'); }} sx={{ display: 'flex', gap: 1.5, p: 2, borderTop: '1px solid #eef0f3', color: '#ef4444', cursor: 'pointer' }}><Logout fontSize="small" /><Typography fontSize={14} fontWeight={600}>Déconnexion</Typography></Box>
      </Box>
      <Box sx={{ flex: 1, ml: '260px' }}>{children}</Box>
    </Box>
  );
}