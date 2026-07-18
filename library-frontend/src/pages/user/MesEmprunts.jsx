import { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, CircularProgress, Snackbar, Alert, Tabs, Tab } from '@mui/material';
import UserLayout from './UserLayout';
import api from '../../services/api';

export default function MesEmprunts() {
  const [emprunts, setEmprunts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [tab, setTab] = useState(0);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchEmprunts(); }, []);

  const fetchEmprunts = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await api.get(`/emprunts/user/${user.id}`);
      setEmprunts(res.data);
    } catch (e) { setEmprunts([]); }
    finally { setLoading(false); }
  };

  const handleRetourner = async (empruntId, titre) => {
    try {
      setLoadingId(empruntId);
      await api.put(`/emprunts/${empruntId}/retour`);
      setEmprunts(prev => prev.map(em => em.id === empruntId? {...em, retourne: true, dateRetourReelle: new Date().toISOString().split('T')[0]} : em));
      setSnack({ open: true, message: `"${titre}" retourné avec succès!`, severity: 'success' });
    } catch (err) {
      setSnack({ open: true, message: err.response?.data || 'Erreur', severity: 'warning' });
    } finally { setLoadingId(null); }
  };

  const enCours = emprunts.filter(e =>!e.retourne);
  const retournes = emprunts.filter(e => e.retourne);
  const list = tab === 0? enCours : retournes;

  const calcRetard = (datePrevue) => {
    const diff = Math.floor((new Date() - new Date(datePrevue)) / (1000*60*60*24));
    return diff > 0? diff : 0;
  };

  if (loading) return <UserLayout><Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box></UserLayout>;

  return (
    <UserLayout>
      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={900}>Mes Emprunts</Typography>
          <Chip label={`${enCours.length} en cours`} sx={{ bgcolor: '#111', color: 'white', fontWeight: 700 }} />
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label={`En cours (${enCours.length})`} sx={{ textTransform: 'none', fontWeight: 700 }} />
          <Tab label={`Historique (${retournes.length})`} sx={{ textTransform: 'none', fontWeight: 700 }} />
        </Tabs>

        {list.length === 0? (
          <Box sx={{ textAlign: 'center', mt: 6, p: 6, bgcolor: 'white', borderRadius: 6 }}>
            <Typography fontSize={48}>{tab === 0? '📭' : '📚'}</Typography>
            <Typography fontWeight={700} mt={2}>{tab === 0? 'Aucun emprunt en cours' : 'Aucun historique'}</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 2.5 }}>
            {list.map(emp => {
              const livre = emp.livre;
              const joursRetard = calcRetard(emp.dateRetourPrevue);
              const enRetard = joursRetard > 0 &&!emp.retourne;
              const isRetourne = emp.retourne;
              return (
                <Box key={emp.id} sx={{ bgcolor: 'white', borderRadius: 5, p: 2.5, border: '1px solid #f1f5f9', opacity: isRetourne? 0.8 : 1 }}>
                  {isRetourne && <Chip label=" Retourné" size="small" sx={{ float: 'right', bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 700, fontSize: 10 }} />}
                  {enRetard && <Chip label={` En retard ${joursRetard}j`} size="small" sx={{ float: 'right', bgcolor: '#fecaca', color: '#dc2626', fontWeight: 700, fontSize: 10 }} />}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 1, clear: 'both' }}>
                    <Box sx={{ width: 64, height: 64, bgcolor: '#f3f4f6', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📚</Box>
                    <Box><Typography fontWeight={800} fontSize={14.5}>{livre?.titre}</Typography><Typography fontSize={12.5} color="#6b7280">{livre?.auteur}</Typography></Box>
                  </Box>
                  <Box sx={{ bgcolor: '#f9fafb', borderRadius: 3, p: 1.5, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography fontSize={11} color="#6b7280">Emprunté le</Typography><Typography fontSize={11} fontWeight={700}>{emp.dateEmprunt}</Typography></Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography fontSize={11} color="#6b7280">{isRetourne? 'Retourné le' : 'Retour prévu'}</Typography><Typography fontSize={11} fontWeight={700} color={enRetard? '#ef4444' : '#111'}>{isRetourne? emp.dateRetourReelle : emp.dateRetourPrevue}</Typography></Box>
                    {enRetard && <Typography fontSize={10} color="#ef4444" mt={0.5} fontWeight={700}>Pénalité estimée: {joursRetard * 2} DH</Typography>}
                  </Box>
                  {isRetourne? <Button fullWidth disabled sx={{ borderRadius: 10, bgcolor: '#f3f4f6' }}> Retour effectué</Button> :
                    <Button fullWidth disabled={loadingId === emp.id} onClick={() => handleRetourner(emp.id, livre?.titre)} sx={{ borderRadius: 10, bgcolor: '#111', color: 'white', fontWeight: 700, textTransform: 'none' }}>{loadingId === emp.id? <CircularProgress size={16} color="inherit" /> : 'Retourner'}</Button>}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({...snack, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 3 }}>{snack.message}</Alert>
      </Snackbar>
    </UserLayout>
  );
}