import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar } from '@mui/material';
import { Dashboard, MenuBook, Bookmark, People, Logout } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout({ children }){
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menu = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { label: 'Livres', icon: <MenuBook />, path: '/admin/livres' },
    { label: 'Emprunts', icon: <Bookmark />, path: '/admin/emprunts' },
    { label: 'Utilisateurs', icon: <People />, path: '/admin/users' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* SIDEBAR - DARK li kan zwin */}
      <Box sx={{ width: 270, bgcolor: '#0a0a0a', color: 'white', p: 2.5, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 4 }}>
          <Box sx={{ width: 32, height: 32, bgcolor: 'white', color: 'black', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>B</Box>
          <Typography fontWeight={800}>BookNest</Typography>
          <Box sx={{ ml: 1, fontSize: 9, bgcolor: '#262626', px: 1, py: 0.3, borderRadius: 1, fontWeight: 700 }}>ADMIN</Box>
        </Box>

        <Box sx={{ bgcolor: '#171717', borderRadius: 3, p: 1.5, display: 'flex', gap: 1.5, mb: 4, border: '1px solid #262626' }}>
          <Avatar sx={{ bgcolor: '#6366f1', width: 38, height: 38 }}>{user.name?.[0] || 'A'}</Avatar>
          <Box>
            <Typography fontSize={13.5} fontWeight={700}>{user.name || 'Admin'}</Typography>
            <Typography fontSize={11.5} sx={{ color: '#a1a1aa' }}>Administrateur</Typography>
          </Box>
        </Box>

        <List sx={{ flex: 1, p: 0 }}>
          {menu.map(m => {
            const active = location.pathname === m.path;
            return (
              <ListItemButton key={m.path} onClick={()=>navigate(m.path)}
                sx={{ borderRadius: 2, mb: 0.8, bgcolor: active? 'white' : 'transparent', color: active? 'black' : '#a1a1aa', '&:hover': { bgcolor: active? 'white' : '#171717', color: active? 'black' : 'white' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{m.icon}</ListItemIcon>
                <ListItemText primary={m.label} primaryTypographyProps={{ fontSize: 13.5, fontWeight: active? 700 : 500 }} />
              </ListItemButton>
            )
          })}
        </List>

       <Box sx={{ mt: 'auto', pt: 2,pb: 2, borderTop: '1px solid #262626' }}>
  <ListItemButton onClick={()=>{localStorage.clear(); window.location.replace('/login')}} 
    sx={{ borderRadius: 2, color: '#71717a', '&:hover': { bgcolor: '#171717', color: 'white' } }}>
    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><Logout /></ListItemIcon>
    <ListItemText primary="Déconnexion" primaryTypographyProps={{ fontSize: 13.5 }} />
  </ListItemButton>
</Box>
      </Box>

      {/* CONTENT - mfar9a */}
      <Box sx={{ flex: 1, bgcolor: '#f6f6f7', minHeight: '100vh', overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
}