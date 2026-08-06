import { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from './AdminLayout';
import { Box, Typography, TextField, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Snackbar, Alert } from '@mui/material';

export default function Emprunts(){
  const [emprunts, setEmprunts] = useState([]);
  const [livres, setLivres] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('TOUS');
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [snack, setSnack] = useState({open:false, msg:'', sev:'success'});
  const [form, setForm] = useState({ livre_id:'', user_id:'' });

  const fetchAll = async () => {
    const [eRes, lRes, uRes] = await Promise.all([api.get('/emprunts'), api.get('/livres'), api.get('/users')]);
    setEmprunts(eRes.data); setLivres(lRes.data); setUsers(uRes.data);
  };
  useEffect(()=>{ fetchAll(); }, []);

  const handlePreter = async () => {
    if(!form.livre_id || !form.user_id) return setSnack({open:true, msg:'Choisir livre et utilisateur', sev:'warning'});
    try{ await api.post('/emprunts', form); setSnack({open:true, msg:'Livre prêté avec succès !', sev:'success'}); setOpen(false); setForm({livre_id:'', user_id:''}); fetchAll(); }
    catch(err){ setSnack({open:true, msg: err.response?.data?.message || 'Erreur', sev:'error'}); }
  };

  const openConfirm = (emprunt) => { setSelected(emprunt); setConfirmOpen(true); };
  const handleRetourConfirm = async () => {
    try{ await api.put(`/emprunts/${selected.id}/retour`); setSnack({open:true, msg:`Retour effectué • ${selected?.penalite || 0} DH encaissés`, sev:'success'}); setConfirmOpen(false); setSelected(null); fetchAll(); }
    catch(err){ setSnack({open:true, msg:'Erreur retour', sev:'error'}); }
  };

  const filtered = emprunts.filter(e => {
    const txt = `${e.livre?.titre || ''} ${e.user?.name || ''}`.toLowerCase();
    const ok = txt.includes(search.toLowerCase());
    if(filter==='EN_COURS') return !e.retourne && ok;
    if(filter==='RETOURNE') return e.retourne && ok;
    if(filter==='RETARD') return !e.retourne && new Date(e.dateRetourPrevue) < new Date() && ok;
    return ok;
  });

  const getStatus = (e) => {
    if(e.retourne) return e.penalite > 0 ? {label:`Retard • ${e.penalite} DH`, color:'#fee2e2', text:'#991b1b'} : {label:'Retourné', color:'#dcfce7', text:'#166534'};
    if(new Date(e.dateRetourPrevue) < new Date()){
      const j = Math.max(1, Math.ceil((new Date() - new Date(e.dateRetourPrevue))/(1000*60*60*24)));
      return {label:`En retard ${j}j • ${j*10} DH`, color:'#fef3c7', text:'#92400e', penalite:j*10, jours:j};
    }
    return {label:'En cours', color:'#e0e7ff', text:'#4338ca'};
  };

  return (
    <AdminLayout>
      <Box sx={{p:3, bgcolor:'#f5f5f7', minHeight:'100vh'}}>
        <Box sx={{display:'flex', justifyContent:'space-between', mb:3}}><Box><Typography fontWeight={800} fontSize={22}>Emprunts</Typography><Typography fontSize={13} color="#6b7280">{filtered.length} emprunts • {emprunts.filter(e=>!e.retourne && new Date(e.dateRetourPrevue)<new Date()).length} en retard</Typography></Box><Button onClick={()=>setOpen(true)} sx={{bgcolor:'#111827', color:'white', borderRadius:2.5, px:3, textTransform:'none', fontWeight:700}}>+ Prêter un livre</Button></Box>
        <Box sx={{display:'flex', gap:1, mb:2}}>{['TOUS','EN_COURS','RETARD','RETOURNE'].map(f=><Chip key={f} label={f} onClick={()=>setFilter(f)} sx={{bgcolor: filter===f?'#6366f1':'white', color: filter===f?'white':'#6b7280', fontWeight:700, cursor:'pointer', border:'1px solid #eef0f3'}}/>)}</Box>
        <Box sx={{bgcolor:'white', p:1.5, borderRadius:3, mb:3, border:'1px solid #eef0f3'}}><TextField fullWidth size="small" placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} sx={{'& fieldset':{border:'none'}}}/></Box>

        <Box sx={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px,1fr))', gap:2.5}}>
          {filtered.map(e=>{const st=getStatus(e); const isRetard=!e.retourne && new Date(e.dateRetourPrevue)<new Date(); return (
            <Box key={e.id} sx={{bgcolor:'white', borderRadius:4, p:2.5, border: isRetard?'1.5px solid #f59e0b':'1px solid #eef0f3'}}>
              <Box sx={{display:'flex', justifyContent:'space-between', mb:2}}><Chip label={st.label} size="small" sx={{bgcolor:st.color, color:st.text, fontWeight:700, fontSize:11}}/><Typography fontSize={11} color="#9ca3af">#{e.id} • {e.dateEmprunt}</Typography></Box>
              <Typography fontWeight={800}>{e.livre?.titre}</Typography><Typography fontSize={13} color="#6b7280" mb={1.5}>👤 {e.user?.name} • {e.user?.email}</Typography>
              {isRetard && <Box sx={{bgcolor:'#fffbeb', border:'1px dashed #f59e0b', borderRadius:2, p:1.2, mb:1.5, display:'flex', justifyContent:'space-between'}}><Typography fontSize={12} fontWeight={700} color="#92400e">Pénalité: {st.jours}j x 10DH = {st.penalite} DH</Typography><Typography>⚠️</Typography></Box>}
              <Box sx={{bgcolor:'#f9fafb', borderRadius:2, p:1.2, display:'flex', justifyContent:'space-between', mb:2}}><Box><Typography fontSize={10} color="#9ca3af">Emprunt</Typography><Typography fontSize={12} fontWeight={700}>{e.dateEmprunt}</Typography></Box><Box><Typography fontSize={10} color="#9ca3af">Prévu</Typography><Typography fontSize={12} fontWeight={700}>{e.dateRetourPrevue}</Typography></Box><Box><Typography fontSize={10} color="#9ca3af">Retour</Typography><Typography fontSize={12} fontWeight={700}>{e.dateRetourReelle || '-'}</Typography></Box></Box>
              <Box sx={{display:'flex', justifyContent:'flex-end'}}>{!e.retourne ? <Button onClick={()=>openConfirm({...e, ...st})} size="small" sx={{bgcolor: isRetard?'#f59e0b':'#111827', color:'white', borderRadius:2, textTransform:'none', fontWeight:700}}>{isRetard?`Retourner + ${st.penalite} DH`:'Retourner'}</Button> : <Typography fontSize={12} color="#16a34a" fontWeight={700}>✓ {e.penalite>0?`${e.penalite} DH encaissés`:'Retourné'}</Typography>}</Box>
            </Box>
          )})}
        </Box>

        {/* DIALOG PRÊTER */}
        <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth="sm" PaperProps={{sx:{borderRadius:4, p:1}}}><DialogTitle fontWeight={800}>Prêter un livre</DialogTitle><DialogContent sx={{display:'flex', flexDirection:'column', gap:2.5, mt:1}}><TextField select label="Livre disponible" value={form.livre_id} onChange={e=>setForm({...form, livre_id:e.target.value})} fullWidth>{livres.filter(l=> (l.nombreExemplaires ?? 0)>0).map(l=><MenuItem key={l.id} value={l.id}>{l.titre} - Stock {l.nombreExemplaires}</MenuItem>)}</TextField><TextField select label="Utilisateur" value={form.user_id} onChange={e=>setForm({...form, user_id:e.target.value})} fullWidth>{users.map(u=><MenuItem key={u.id} value={u.id}>{u.name} - {u.email}</MenuItem>)}</TextField></DialogContent><DialogActions sx={{p:2.5}}><Button onClick={()=>setOpen(false)} sx={{textTransform:'none', color:'#6b7280'}}>Annuler</Button><Button onClick={handlePreter} variant="contained" sx={{bgcolor:'#6366f1', borderRadius:2.5, textTransform:'none', fontWeight:700}}>Prêter</Button></DialogActions></Dialog>

        {/* DIALOG CONFIRM RETOUR PRO - bla localhost says */}
        <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)} PaperProps={{sx:{borderRadius:4, p:1}}} maxWidth="xs" fullWidth>
          <DialogTitle fontWeight={800}>Confirmer le retour ?</DialogTitle>
          <DialogContent>
            <Typography fontSize={14} mb={1.5}>Livre: <b>{selected?.livre?.titre}</b></Typography>
            <Typography fontSize={14} mb={1.5}>Utilisateur: <b>{selected?.user?.name}</b></Typography>
            {selected?.jours > 0 ? (
              <Box sx={{bgcolor:'#fffbeb', border:'1px solid #fde68a', p:1.5, borderRadius:2, mt:1}}>
                <Typography fontSize={13} fontWeight={700} color="#92400e">Retard de {selected.jours} jours</Typography>
                <Typography fontSize={13}>Pénalité à encaisser: <b>{selected.penalite} DH</b> (10DH/j)</Typography>
              </Box>
            ) : <Typography fontSize={13} color="#6b7280">Aucune pénalité, retour à temps.</Typography>}
          </DialogContent>
          <DialogActions sx={{p:2.5}}><Button onClick={()=>setConfirmOpen(false)} sx={{textTransform:'none', color:'#6b7280'}}>Annuler</Button><Button onClick={handleRetourConfirm} variant="contained" sx={{bgcolor:'#111827', borderRadius:2.5, textTransform:'none', fontWeight:700}}>{selected?.jours>0?`Confirmer + ${selected.penalite} DH`:'Confirmer retour'}</Button></DialogActions>
        </Dialog>

        <Snackbar open={snack.open} autoHideDuration={4000} onClose={()=>setSnack({...snack, open:false})} anchorOrigin={{vertical:'bottom', horizontal:'right'}}><Alert severity={snack.sev} variant="filled" sx={{borderRadius:3}}>{snack.msg}</Alert></Snackbar>
      </Box>
    </AdminLayout>
  );
}