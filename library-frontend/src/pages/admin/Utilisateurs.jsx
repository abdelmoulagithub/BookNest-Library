import { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from './AdminLayout';
import { Box, Typography, TextField, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';

export default function Utilisateurs(){
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('TOUS');
  const [snack, setSnack] = useState({open:false, msg:'', sev:'success'});
  const [confirm, setConfirm] = useState({open:false, user:null});
  const [detail, setDetail] = useState({open:false, user:null, emprunts:[], loading:false});

  const fetchUsers = async () => {
    try{
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch{
      setSnack({open:true, msg:'Erreur chargement users', sev:'error'});
    }
  };
  useEffect(()=>{ fetchUsers(); }, []);

  const openDetail = async (u) => {
    setDetail({open:true, user:u, emprunts:[], loading:true});
    try{
      const res = await api.get(`/emprunts/user/${u.id}`);
      setDetail({open:true, user:u, emprunts: res.data || [], loading:false});
    }catch{
      setDetail({open:true, user:u, emprunts:[], loading:false});
    }
  };

  const handleDelete = async () => {
    try{ await api.delete(`/users/${confirm.user.id}`); setSnack({open:true, msg:'Utilisateur supprimé', sev:'success'}); setConfirm({open:false, user:null}); fetchUsers(); }
    catch(err){ setSnack({open:true, msg: err.response?.data || 'Impossible - a des emprunts en cours', sev:'error'}); }
  };

  const handleRole = async (u) => {
    if(!u) return;
    const newRole = u.role === 'ADMIN'? 'USER' : 'ADMIN';
    try{
      await api.put(`/users/${u.id}/role`, {role: newRole});
      setSnack({open:true, msg:`${u.name} → ${newRole}`, sev:'success'});
      fetchUsers();
      if(detail.open && detail.user?.id===u.id) {
        setDetail(d=>({...d, user:{...d.user, role:newRole}}));
      }
    } catch{ setSnack({open:true, msg:'Erreur changement rôle', sev:'error'}); }
  };

  const filtered = (users || []).filter(u => {
    const txt = `${u?.name || ''} ${u?.email || ''} ${u?.role || ''}`.toLowerCase();
    const ok = txt.includes((search || '').toLowerCase());
    if(filter==='ADMIN') return u.role==='ADMIN' && ok;
    if(filter==='USER') return u.role==='USER' && ok;
    return ok;
  });

  const allEmprunts = detail.emprunts || [];
  const enCours = allEmprunts.filter(e=>!e?.retourne);
  const retournes = allEmprunts.filter(e=>e?.retourne);

  return (
    <AdminLayout>
      <Box sx={{p:3, bgcolor:'#f5f5f7', minHeight:'100vh'}}>
        <Box sx={{display:'flex', justifyContent:'space-between', mb:3}}>
          <Box>
            <Typography fontWeight={800} fontSize={22}>Utilisateurs</Typography>
            <Typography fontSize={13} color="#6b7280">{filtered?.length || 0} utilisateurs • {(users || []).filter(u=>u?.role==='ADMIN')?.length || 0} admins</Typography>
          </Box>
        </Box>

        <Box sx={{display:'flex', gap:1, mb:2}}>
          {['TOUS','USER','ADMIN'].map(f=><Chip key={f} label={f} onClick={()=>setFilter(f)} sx={{bgcolor: filter===f?'#111827':'white', color: filter===f?'white':'#6b7280', fontWeight:700, cursor:'pointer', border:'1px solid #eef0f3'}}/>)}
        </Box>

        <Box sx={{bgcolor:'white', p:1.5, borderRadius:3, mb:3, border:'1px solid #eef0f3'}}>
          <TextField fullWidth size="small" placeholder="Rechercher nom ou email..." value={search} onChange={e=>setSearch(e.target.value)} sx={{'& fieldset':{border:'none'}}}/>
        </Box>

        <Box sx={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:2.5}}>
          {filtered.map(u=>(
            <Box key={u.id} onClick={()=>openDetail(u)} sx={{bgcolor:'white', borderRadius:4, p:2.5, border:'1px solid #eef0f3', cursor:'pointer', '&:hover':{boxShadow:'0 12px 32px rgba(0,0,0,0.08)', transform:'translateY(-2px)'}, transition:'all.2s'}}>
              <Box sx={{display:'flex', justifyContent:'space-between', mb:2}}>
                <Chip label={u?.role || 'USER'} size="small" sx={{bgcolor: u?.role==='ADMIN'?'#111827':'#e0e7ff', color: u?.role==='ADMIN'?'white':'#4338ca', fontWeight:700, fontSize:11}}/>
                <Typography fontSize={11} color="#9ca3af">#{u?.id}</Typography>
              </Box>
              <Box sx={{display:'flex', alignItems:'center', gap:1.5, mb:1.5}}>
                <Box sx={{width:42, height:42, borderRadius:'50%', bgcolor: u?.role==='ADMIN'?'#111827':'#f3f4f6', color: u?.role==='ADMIN'?'white':'#111', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800}}>{u?.name?.[0]?.toUpperCase() || '?'}</Box>
                <Box><Typography fontWeight={800} fontSize={14}>{u?.name}</Typography><Typography fontSize={12} color="#6b7280" sx={{maxWidth:180, overflow:'hidden', textOverflow:'ellipsis'}}>{u?.email}</Typography></Box>
              </Box>
              <Box sx={{display:'flex', gap:1, justifyContent:'flex-end', mt:2}} onClick={e=>e.stopPropagation()}>
                <Button size="small" onClick={()=>handleRole(u)} sx={{textTransform:'none', fontWeight:700, fontSize:12, color:'#6366f1'}}>{u?.role==='ADMIN'?'→ User':'→ Admin'}</Button>
                <Button size="small" onClick={()=>setConfirm({open:true, user:u})} sx={{textTransform:'none', fontWeight:700, fontSize:12, color:'#ef4444'}}>Supprimer</Button>
              </Box>
            </Box>
          ))}
        </Box>

        {/* MODAL SUPPRESSION */}
        <Dialog open={confirm.open} onClose={()=>setConfirm({open:false, user:null})} PaperProps={{sx:{borderRadius:4}}} maxWidth="xs" fullWidth>
          <DialogTitle fontWeight={800}>Supprimer {confirm.user?.name}?</DialogTitle>
          <DialogContent><Typography fontSize={13} color="#6b7280">Impossible si l'utilisateur a des emprunts en cours.</Typography></DialogContent>
          <DialogActions sx={{p:2.5}}><Button onClick={()=>setConfirm({open:false, user:null})} sx={{textTransform:'none', color:'#6b7280'}}>Annuler</Button><Button onClick={handleDelete} variant="contained" sx={{bgcolor:'#ef4444', borderRadius:2.5, textTransform:'none', fontWeight:700}}>Supprimer</Button></DialogActions>
        </Dialog>

        {/* MODAL DETAIL */}
        <Dialog open={detail.open} onClose={()=>setDetail({open:false, user:null, emprunts:[], loading:false})} maxWidth="md" fullWidth PaperProps={{sx:{borderRadius:4}}}>
          <DialogTitle sx={{fontWeight:800, borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Box>{detail.user?.name} <Typography component="span" fontSize={13} color="#6b7280" fontWeight={400}>• {detail.user?.email}</Typography></Box>
            <Chip label={detail.user?.role || 'USER'} size="small" sx={{bgcolor: detail.user?.role==='ADMIN'?'#111827':'#e0e7ff', color: detail.user?.role==='ADMIN'?'white':'#4338ca', fontWeight:700}}/>
          </DialogTitle>
          <DialogContent sx={{pt:3}}>
            <Box sx={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2, mb:3, mt:2}}>
              <Box sx={{bgcolor:'#f9fafb', p:2, borderRadius:3}}><Typography fontSize={11} color="#9ca3af">Total Emprunts</Typography><Typography fontWeight={800} fontSize={22}>{allEmprunts.length}</Typography></Box>
              <Box sx={{bgcolor:'#ecfdf5', p:2, borderRadius:3}}><Typography fontSize={11} color="#059669">En cours</Typography><Typography fontWeight={800} fontSize={22}>{enCours.length}</Typography></Box>
              <Box sx={{bgcolor:'#fef2f2', p:2, borderRadius:3}}><Typography fontSize={11} color="#dc2626">Retournés</Typography><Typography fontWeight={800} fontSize={22}>{retournes.length}</Typography></Box>
            </Box>

            <Typography fontWeight={700} mb={1.5}>Historique des emprunts</Typography>
            <Box sx={{display:'flex', flexDirection:'column', gap:1, maxHeight:350, overflow:'auto', pr:1}}>
              {detail.loading && <Typography fontSize={13} color="#9ca3af" sx={{py:4, textAlign:'center'}}>Chargement...</Typography>}
              {!detail.loading && allEmprunts.length===0 && <Typography fontSize={13} color="#9ca3af" sx={{py:4, textAlign:'center'}}>Aucun emprunt pour cet utilisateur</Typography>}
              {allEmprunts.map(emp=>(
                <Box key={emp?.id} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', p:1.5, bgcolor:'white', border:'1px solid #eef0f3', borderRadius:2.5}}>
                  <Box>
                    <Typography fontWeight={700} fontSize={13}>{emp?.livre?.titre || emp?.livreTitre || `Livre #${emp?.livre?.id || emp?.livreId || ''}`}</Typography>
                    <Typography fontSize={11} color="#6b7280">
                      {emp?.dateEmprunt? `Emprunté le ${new Date(emp.dateEmprunt).toLocaleDateString()}` : ''}
                      {emp?.dateRetourPrevue? ` • Retour prévu ${new Date(emp.dateRetourPrevue).toLocaleDateString()}` : ''}
                    </Typography>
                  </Box>
                  <Chip size="small" label={emp?.retourne? 'Retourné' : 'En cours'} sx={{bgcolor: emp?.retourne? '#e0e7ff' : '#fef3c7', color: emp?.retourne? '#4338ca' : '#92400e', fontWeight:700, fontSize:11}}/>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions sx={{p:2.5, borderTop:'1px solid #f3f4f6'}}>
            <Button onClick={()=>setDetail({open:false, user:null, emprunts:[], loading:false})} sx={{textTransform:'none', color:'#6b7280'}}>Fermer</Button>
            <Button onClick={()=>handleRole(detail.user)} sx={{textTransform:'none', fontWeight:700}}>{detail.user?.role==='ADMIN'?'Passer USER':'Passer ADMIN'}</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snack.open} autoHideDuration={4000} onClose={()=>setSnack({...snack, open:false})} anchorOrigin={{vertical:'bottom', horizontal:'right'}}><Alert severity={snack.sev} variant="filled" sx={{borderRadius:3}}>{snack.msg}</Alert></Snackbar>
      </Box>
    </AdminLayout>
  );
}