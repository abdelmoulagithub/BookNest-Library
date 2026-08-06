import { useState, useEffect } from 'react';
import { Box, Typography, Chip, Button, TextField, InputAdornment, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Search } from '@mui/icons-material';
import UserLayout from './UserLayout';
import api from '../../services/api';

export default function Catalogue() {
  const [livres, setLivres] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const getColor = (g) => {
    const map = {
      Conte: '#fef3c7',
      Thriller: '#fecaca',
      Policier: '#dbeafe',
      Fantasy: '#d1fae5',
      Histoire: '#dbeafe',
      Roman: '#e0e7ff',
      'Science-Fiction': '#f3e8ff',
      bio: '#f3f4f6',
      'Développement personnel': '#ffedd5'
    };
    return map[g] || '#f3f4f6';
  };

  useEffect(() => {
    fetchLivres();
  }, []);

  const fetchLivres = async () => {
    try {
      setLoading(true);
      const res = await api.get('/livres');
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data.content) data = res.data.content;
      else if (res.data.data) data = res.data.data;
      setLivres(data);
    } catch (e) {
      console.error('Erreur fetch livres:', e.response?.data || e.message);
      setLivres([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmprunter = async (livre) => {
    const stock = livre.nombreExemplaires?? livre.nombre_exemplaires?? 0;
    if (stock <= 0) {
      setSnack({ open: true, message: `Rupture de stock pour "${livre.titre}"`, severity: 'error' });
      return;
    }
    try {
      setLoadingId(livre.id);
      const userStr = localStorage.getItem('user');
      const user = userStr? JSON.parse(userStr) : null;

      if (!user ||!user.id) {
        setSnack({ open: true, message: 'Veuillez vous reconnecter', severity: 'error' });
        return;
      }

    const payload = { user_id: user.id, livre_id: livre.id };
      await api.post('/emprunts', payload);

      setLivres(prev =>
        prev.map(b => {
          if (b.id === livre.id) {
            const current = b.nombreExemplaires?? b.nombre_exemplaires?? 0;
            return {...b, nombreExemplaires: current - 1, nombre_exemplaires: current - 1 };
          }
          return b;
        })
      );

      setSnack({
        open: true,
        message: `"${livre.titre}" emprunté avec succès! Retour prévu dans 14 jours.`,
        severity: 'success'
      });
    } catch (err) {
      console.error(err);
      const msg = typeof err.response?.data === 'string'? err.response.data : err.response?.data?.message || err.message;

      if (msg.includes('deja msalf') || msg.includes('déjà')) {
        setSnack({
          open: true,
          message: `Vous avez déjà emprunté "${livre.titre}" et ne l'avez pas encore retourné.`,
          severity: 'warning'
        });
      } else {
        setSnack({ open: true, message: msg, severity: 'error' });
      }
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = livres.filter(l => {
    const matchGenre = genre === 'Tous' || l.genre === genre;
    const lower = search.toLowerCase();
    const matchSearch = l.titre?.toLowerCase().includes(lower) || l.auteur?.toLowerCase().includes(lower);
    return matchGenre && matchSearch;
  });

  const genres = ['Tous',...new Set(livres.map(b => b.genre).filter(Boolean))];

  if (loading) {
    return (
      <UserLayout>
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Box sx={{ p: 4, px: 5, maxWidth: 1400, mx: 'auto' }}>
        <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: -1.2, mb: 2.5 }}>
          Découvrir
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', gap: 1.2, overflowX: 'auto', pb: 0.5 }}>
            {genres.map(g => (
              <Chip
                key={g}
                label={g}
                onClick={() => setGenre(g)}
                sx={{
                  borderRadius: 10,
                  px: 2,
                  py: 2.5,
                  cursor: 'pointer',
                  bgcolor: genre === g? '#111' : 'white',
                  color: genre === g? 'white' : '#111',
                  border: '1px solid #e5e7eb',
                  fontWeight: genre === g? 700 : 500,
                  '&:hover': { bgcolor: genre === g? '#111' : '#f3f4f6' }
                }}
              />
            ))}
          </Box>
          <TextField
            size="small"
            placeholder="Chercher un livre, auteur..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{
              width: 320,
              bgcolor: 'white',
              borderRadius: 10,
              '& fieldset': { borderColor: '#e5e7eb', borderRadius: 10 }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              )
            }}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 2.5 }}>
          {filtered.map(livre => {
            const stock = livre.nombreExemplaires?? livre.nombre_exemplaires?? 0;
            const dispo = stock > 0;
            return (
              <Box
                key={livre.id}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 6,
                  p: 1.5,
                  border: '1px solid #f1f5f9',
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 24px rgba(0,0,0,0.06)' }
                }}
              >
                <Box sx={{ bgcolor: getColor(livre.genre), borderRadius: 5, height: 160, p: 2, position: 'relative' }}>
                  <Chip label={livre.genre} size="small" sx={{ bgcolor: 'white', fontSize: 10, height: 22, fontWeight: 700 }} />
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: 'white',
                      borderRadius: '50%',
                      mx: 'auto',
                      mt: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
                      boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                    }}
                  >
                    📚
                  </Box>
                </Box>
                <Box p={1} pt={2}>
                  <Typography fontWeight={700} fontSize={13.5} noWrap>
                    {livre.titre}
                  </Typography>
                  <Typography fontSize={11.5} color="#6b7280" noWrap>
                    {livre.auteur}
                  </Typography>
                  <Typography fontSize={11} fontWeight={700} mt={0.5} sx={{ color: dispo? '#16a34a' : '#ef4444' }}>
                    {dispo? `${stock} dispo` : 'Rupture'}
                  </Typography>
                  <Button
                    fullWidth
                    onClick={() => handleEmprunter(livre)}
                    disabled={!dispo || loadingId === livre.id}
                    sx={{
                      mt: 1.5,
                      borderRadius: 10,
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: 12.5,
                      py: 0.8,
                      bgcolor: dispo? '#111' : '#f3f4f6',
                      color: dispo? 'white' : '#9ca3af',
                      '&:hover': { bgcolor: dispo? '#000' : '#f3f4f6' },
                      '&.Mui-disabled': { bgcolor: '#f3f4f6', color: '#9ca3af' }
                    }}
                  >
                    {loadingId === livre.id? <CircularProgress size={16} color="inherit" /> : dispo? 'Emprunter' : 'Rupture'}
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({...snack, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnack({...snack, open: false })}
          severity={snack.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 3, fontWeight: 600, fontSize: 13 }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </UserLayout>
  );
}