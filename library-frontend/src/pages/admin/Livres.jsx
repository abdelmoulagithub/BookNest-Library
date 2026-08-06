import { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from './AdminLayout';
import { 
  Box, Typography, TextField, Button, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Snackbar, Alert
} from '@mui/material';

export default function Livres(){
  const [livres, setLivres] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [snack, setSnack] = useState({open:false, msg:'', sev:'success'});
  const [form, setForm] = useState({
    titre: '',
    auteur: '',
    isbn: '',
    genre: 'Roman',
    nombre_exemplaires: 1
  });

  const fetchLivres = async () => {
    try {
      const res = await api.get('/livres');
      setLivres(res.data);
    } catch (e) { console.log(e) }
  };

  useEffect(()=>{ fetchLivres(); }, []);

  const handleOpenAdd = () => {
    setEditId(null);
    setForm({ titre:'', auteur:'', isbn:'', genre:'Roman', nombre_exemplaires:1 });
    setOpen(true);
  };

  const handleOpenEdit = (livre) => {
    setEditId(livre.id);
    setForm({
      titre: livre.titre || '',
      auteur: livre.auteur || '',
      isbn: livre.isbn || '',
      genre: livre.genre || 'Roman',
      nombre_exemplaires: livre.nombreExemplaires || livre.nombre_exemplaires || 1
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if(!form.titre.trim() || !form.auteur.trim()){
      setSnack({open:true, msg:'Titre et Auteur obligatoires', sev:'warning'});
      return;
    }

    // PAYLOAD M9AD M3A LivreDTO - bla _
    const payload = {
      titre: form.titre.trim(),
      auteur: form.auteur.trim(),
      isbn: form.isbn ? form.isbn.toString().trim() : "",
      genre: form.genre,
      nombreExemplaires: parseInt(form.nombre_exemplaires) || 1
    };

    try {
      if(editId){
        await api.put(`/livres/${editId}`, payload);
        setSnack({open:true, msg:'Livre modifié avec succès !', sev:'success'});
      } else {
        await api.post('/livres', payload);
        setSnack({open:true, msg:'Livre ajouté avec succès !', sev:'success'});
      }
      setOpen(false);
      fetchLivres();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message;
      setSnack({open:true, msg: typeof msg === 'string' ? msg : JSON.stringify(msg), sev:'error'});
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Supprimer ce livre ?')) return;
    try {
      await api.delete(`/livres/${id}`);
      setSnack({open:true, msg:'Livre supprimé', sev:'success'});
      fetchLivres();
    } catch (err) {
      setSnack({open:true, msg:'Erreur suppression', sev:'error'});
    }
  };

  const filtered = livres.filter(l => 
    l.titre?.toLowerCase().includes(search.toLowerCase()) || 
    l.auteur?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <Box sx={{ p:3, bgcolor:'#f5f5f7', minHeight:'100vh', width:'100%' }}>
        
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3, flexWrap:'wrap', gap:2 }}>
          <Box>
            <Typography fontWeight={800} fontSize={24}>Livres</Typography>
            <Typography color="#6b7280" fontSize={14}>Gérez votre collection ({livres.length} livres)</Typography>
          </Box>
          <Button onClick={handleOpenAdd} sx={{ bgcolor:'#6366f1', color:'white', borderRadius:2.5, px:3, py:1.2, textTransform:'none', fontWeight:700, '&:hover':{bgcolor:'#4f46e5'} }}>
            + Nouveau Livre
          </Button>
        </Box>

        <Box sx={{ bgcolor:'white', p:1.5, borderRadius:3, mb:3, border:'1px solid #eef0f3' }}>
          <TextField fullWidth placeholder="Rechercher par titre ou auteur..." value={search} onChange={e=>setSearch(e.target.value)} size="small" sx={{ '& fieldset':{border:'none'} }} />
        </Box>

        <Box sx={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:3, width:'100%' }}>
          {filtered.map(livre => {
            const stock = livre.nombreExemplaires ?? livre.nombre_exemplaires ?? 0;
            const isDispo = livre.disponible;
            return (
              <Box key={livre.id} sx={{ bgcolor:'white', borderRadius:4, p:2.5, border:'1px solid #eef0f3', display:'flex', flexDirection:'column', transition:'all 0.2s', '&:hover':{ boxShadow:'0 12px 32px rgba(99,102,241,0.12)', transform:'translateY(-4px)' } }}>
                <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2.5 }}>
                  <Chip label={livre.genre || 'Roman'} size="small" sx={{ bgcolor:'#eef2ff', color:'#4338ca', fontWeight:700, fontSize:11, height:24 }} />
                  <Chip label={isDispo ? 'Dispo' : 'Rupture'} size="small" sx={{ bgcolor: isDispo ? '#dcfce7' : '#fee2e2', color: isDispo ? '#166534' : '#991b1b', fontWeight:700, fontSize:11, height:24 }} />
                </Box>
                <Typography fontWeight={800} fontSize={16} sx={{ lineHeight:1.3, mb:0.5, minHeight:42 }}>{livre.titre}</Typography>
                <Typography color="#6b7280" fontSize={13.5} sx={{ mb:1 }}>{livre.auteur}</Typography>
                <Typography color="#9ca3af" fontSize={11}>ISBN: {livre.isbn}</Typography>
                <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mt:'auto', pt:2.5, borderTop:'1px solid #f3f4f6' }}>
                  <Box sx={{ bgcolor:'#f9fafb', px:1.5, py:0.5, borderRadius:2 }}><Typography fontSize={12} fontWeight={700}>Stock: {stock}</Typography></Box>
                  <Box sx={{ display:'flex', gap:2 }}>
                    <Typography onClick={()=>handleOpenEdit(livre)} sx={{ color:'#6366f1', cursor:'pointer', fontSize:13, fontWeight:700 }}>Modifier</Typography>
                    <Typography onClick={()=>handleDelete(livre.id)} sx={{ color:'#ef4444', cursor:'pointer', fontSize:13, fontWeight:700 }}>Supprimer</Typography>
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Box>

        <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx:{borderRadius:4, p:1} }}>
          <DialogTitle fontWeight={800} fontSize={18}>{editId ? 'Modifier le livre' : 'Ajouter un livre'}</DialogTitle>
          <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2.5, mt:1 }}>
            <TextField label="Titre *" value={form.titre} onChange={e=>setForm({...form, titre:e.target.value})} fullWidth />
            <TextField label="Auteur *" value={form.auteur} onChange={e=>setForm({...form, auteur:e.target.value})} fullWidth />
            <TextField label="ISBN" value={form.isbn} onChange={e=>setForm({...form, isbn:e.target.value})} fullWidth />
            <TextField select label="Genre" value={form.genre} onChange={e=>setForm({...form, genre:e.target.value})} fullWidth>
              <MenuItem value="Roman">Roman</MenuItem>
              <MenuItem value="Fantasy">Fantasy</MenuItem>
              <MenuItem value="Science-Fiction">Science-Fiction</MenuItem>
              <MenuItem value="bio">Bio</MenuItem>
              <MenuItem value="Histoire">Histoire</MenuItem>
              <MenuItem value="Développement personnel">Développement personnel</MenuItem>
            </TextField>
            <TextField label="Nombre d'exemplaires *" type="number" inputProps={{min:1}} value={form.nombre_exemplaires} onChange={e=>setForm({...form, nombre_exemplaires:e.target.value})} fullWidth />
          </DialogContent>
          <DialogActions sx={{ p:2.5, pt:0 }}>
            <Button onClick={()=>setOpen(false)} sx={{ textTransform:'none', color:'#6b7280' }}>Annuler</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor:'#6366f1', borderRadius:2.5, textTransform:'none', px:3, fontWeight:700 }}>Enregistrer</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snack.open} autoHideDuration={4000} onClose={()=>setSnack({...snack, open:false})} anchorOrigin={{vertical:'bottom', horizontal:'right'}}>
          <Alert onClose={()=>setSnack({...snack, open:false})} severity={snack.sev} variant="filled" sx={{borderRadius:3, fontWeight:600}}>{snack.msg}</Alert>
        </Snackbar>

      </Box>
    </AdminLayout>
  );
}