import AdminLayout from './AdminLayout';
import { Box, Typography, Paper } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Dashboard(){
  const [stats, setStats] = useState({ livres: 0, users: 0, encours: 0, retards: 0 });
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [livresRes, usersRes, empruntsRes] = await Promise.all([
        api.get('/livres'),
        api.get('/users'),
        api.get('/emprunts')
      ]);
      
      const livres = livresRes.data;
      const emprunts = empruntsRes.data;

      const encours = emprunts.filter(e => 
        e.retourne !== 1 && e.statut !== 'RETOURNE' && !e.date_retour_reelle && !e.date_retour_effective
      ).length;

      const totalLivres = livres.length; // 20 men BDD
      const dispo = totalLivres - encours; // 20 - 2 = 18

      setStats({ 
        livres: totalLivres, 
        users: usersRes.data.length, 
        encours, 
        retards: 0 
      });

      // CERCLE DYNAMIQUE MEN BDD: 18 dispo / 2 en cours
      setPieData([
        { name: 'Livres', value: dispo, color: '#6366f1' },
        { name: 'En cours', value: encours, color: '#22c55e' },
      ]);

      setBarData([
        { name: 'Jan', v: 3 },
        { name: 'Fev', v: 5 },
        { name: 'Mar', v: 2 },
        { name: 'Avr', v: 2 },
        { name: 'Mai', v: 4 },
        { name: 'Juin', v: encours },
      ]);
    };
    load();
  }, []);

  return (
    <AdminLayout>
      <Box sx={{ p: 3, bgcolor: '#f5f5f7', minHeight: '100vh', width: '100%' }}>
        <Typography fontWeight={800} fontSize={22}>Dashboard</Typography>
        <Typography color="#6b7280" fontSize={14} mb={3}>Vue d'ensemble de votre bibliothèque</Typography>

        <Box sx={{ display: 'flex', gap: 2.5, mb: 3, width: '100%' }}>
          <Box sx={{ flex: 1, bgcolor: '#e8eaff', borderRadius: 3, p: 2.5 }}><Typography fontSize={22} fontWeight={800}>{stats.livres}</Typography><Typography>Total Livres</Typography></Box>
          <Box sx={{ flex: 1, bgcolor: '#e6f9ed', borderRadius: 3, p: 2.5 }}><Typography fontSize={22} fontWeight={800}>{stats.users}</Typography><Typography>Utilisateurs</Typography></Box>
          <Box sx={{ flex: 1, bgcolor: '#fff7db', borderRadius: 3, p: 2.5 }}><Typography fontSize={22} fontWeight={800}>{stats.encours}</Typography><Typography>En cours</Typography></Box>
          <Box sx={{ flex: 1, bgcolor: '#ffe9e9', borderRadius: 3, p: 2.5 }}><Typography fontSize={22} fontWeight={800}>{stats.retards}</Typography><Typography>Retards</Typography></Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2.5, width: '100%' }}>
          <Paper elevation={0} sx={{ flex: 1, p: 3, borderRadius: 3, height: 420 }}>
            <Typography fontWeight={700} mb={2}>Répartition ({stats.livres - stats.encours} livres / {stats.encours} en cours)</Typography>
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={85} outerRadius={125} paddingAngle={8} cornerRadius={12}>
                  {pieData.map((e,i)=><Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          <Paper elevation={0} sx={{ flex: 1.5, p: 3, borderRadius: 3, height: 420 }}>
            <Typography fontWeight={700} mb={2}>Emprunts par mois</Typography>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="v" fill="#6366f1" radius={[12,12,0,0]} barSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </AdminLayout>
  );
}