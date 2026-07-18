import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { AutoStories } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 2 }}>
      <Paper elevation={24} sx={{ width: 400, p: 4.5, borderRadius: 6, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        
        {/* HEADER - Nafs Login bdebt */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ width: 64, height: 64, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <AutoStories sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} textAlign="center">Bienvenue</Typography>
          <Typography color="text.secondary" variant="body2" textAlign="center" mt={0.8}>Créez votre compte BookNest</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5, fontSize: 13 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField 
            label="Nom complet" 
            size="small" 
            fullWidth 
            required 
            value={form.name} 
            onChange={e=>setForm({...form, name: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8f9ff' } }}
          />
          <TextField 
            label="Email" 
            type="email" 
            size="small" 
            fullWidth 
            required 
            value={form.email} 
            onChange={e=>setForm({...form, email: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8f9ff' } }}
          />
          <TextField 
            label="Mot de passe" 
            type="password" 
            size="small" 
            fullWidth 
            required 
            value={form.password} 
            onChange={e=>setForm({...form, password: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8f9ff' } }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading}
            sx={{ mt: 1, borderRadius: 3, py: 1.4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontWeight: 700, textTransform: 'none', fontSize: 15, boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)' }}
          >
            {loading?'...':'Créer un compte'}
          </Button>

          <Typography textAlign="center" variant="body2" sx={{ fontSize: 13.5, mt: 1 }}>
            Déjà un compte? <Link to="/login" style={{ color: '#667eea', fontWeight: 700, textDecoration: 'none' }}>Se connecter</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}