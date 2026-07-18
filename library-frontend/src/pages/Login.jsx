import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, AutoStories } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const APP_NAME = "BookNest";

export default function Login() {
  const [email, setEmail] = useState('admin@library.com');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 2 }}>
      <Paper elevation={24} sx={{ width: 400, p: 4.5, borderRadius: 5, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        
        {/* Logo + Bienvenue WST */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ 
            width: 64, height: 64, 
            background: 'linear-gradient(135deg, #667eea, #764ba2)', 
            borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            mb: 2 
          }}>
            <AutoStories sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} textAlign="center" sx={{ letterSpacing: '-0.5px' }}>
            Bienvenue
          </Typography>
          <Typography color="text.secondary" variant="body2" textAlign="center" mt={0.8}>
            Connectez-vous à votre espace
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5, fontSize: 13 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Email"
            size="small"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Email fontSize="small" /></InputAdornment>
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8f9ff' } }}
          />
          <TextField
            label="Mot de passe"
            size="small"
            type={show ? 'text' : 'password'}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShow(!show)} edge="end">
                    {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8f9ff' } }}
          />
          
          <Button type="submit" variant="contained" fullWidth disabled={loading}
            sx={{ 
              mt: 1, 
              borderRadius: 3, 
              py: 1.4, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              fontWeight: 700, 
              textTransform: 'none',
              fontSize: 15,
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': { boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)' }
            }}>
            {loading ? '...' : 'Se connecter'}
          </Button>

          <Typography textAlign="center" variant="body2" sx={{ fontSize: 13.5, mt: 1 }}>
            Pas de compte? <Link to="/register" style={{ color: '#667eea', fontWeight: 700, textDecoration: 'none' }}>Créer un compte</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}