import { useEffect, useState } from "react";
import { Box, Paper, Typography, TextField, Button, Avatar, Stack, Alert, Chip } from "@mui/material";
import UserLayout from "./UserLayout";
import api from "../../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "success" });
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  useEffect(() => {
    api.get("/profile/me").then(res => {
      setUser(res.data);
      setName(res.data.name);
    }).catch(() => setMsg({ text: "Erreur chargement", type: "error" }));
  }, []);

  const updateProfile = async () => {
    try {
      await api.put("/profile/me", { name });
      setMsg({ text: "Profil mis à jour ✅", type: "success" });
      const u = {...JSON.parse(localStorage.getItem("user")), name };
      localStorage.setItem("user", JSON.stringify(u));
    } catch { setMsg({ text: "Erreur", type: "error" }); }
  };

  const updatePassword = async () => {
    try {
      await api.put("/profile/password", { oldPassword: oldPass, newPassword: newPass });
      setMsg({ text: "Mot de passe changé ✅", type: "success" });
      setOldPass(""); setNewPass("");
    } catch (e) { setMsg({ text: e.response?.data || "Ancien incorrect", type: "error" }); }
  };

  if (!user) return <UserLayout><Box p={4}>Chargement...</Box></UserLayout>;

  const fieldSx = {
    "&.MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "#f9fafb", height: 48 },
  };
  const disabledSx = {
    "&.MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "#f3f4f6", height: 48 },
  };

  return (
    <UserLayout>
      <Box sx={{ p: 4, px: 5, maxWidth: 800 }}>
        <Box sx={{ bgcolor: "white", borderRadius: 4, p: 2.5, border: "1px solid #eef0f3", display: "flex", gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: "black" }}>{user.name[0].toUpperCase()}</Avatar>
          <Box>
            <Typography fontWeight={800}>{user.name}</Typography>
            <Typography fontSize={13} color="text.secondary">{user.email}</Typography>
            <Stack direction="row" gap={1} mt={0.5}>
              <Chip label="USER" size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, bgcolor: "black", color: "white" }} />
              <Chip label={`${user.totalEmprunts || 0} emprunts`} size="small" sx={{ height: 20, fontSize: 10 }} />
            </Stack>
          </Box>
        </Box>

        {msg.text && <Alert severity={msg.type} sx={{ mb: 2, borderRadius: 2 }}>{msg.text}</Alert>}

        <Paper sx={{ p: 3.5, borderRadius: 4, mb: 3, border: "1px solid #eef0f3" }} elevation={0}>
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: "#111", mb: 3 }}>
            Modifier profil
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: 1, mb: 1.5, display: "block" }}>NOM COMPLET</Typography>
              <TextField fullWidth value={name} onChange={e=>setName(e.target.value)} size="small" sx={fieldSx} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: 1, mb: 1.5, display: "block" }}>ADRESSE EMAIL</Typography>
              <TextField fullWidth value={user.email} disabled size="small" sx={disabledSx} />
            </Box>
          </Stack>
          <Button onClick={updateProfile} variant="contained" sx={{ mt: 3, borderRadius: 2.5, bgcolor: "black", textTransform: "none", fontWeight: 700, px: 3, height: 44 }}>
            Enregistrer les modifications
          </Button>
        </Paper>

        <Paper sx={{ p: 3.5, borderRadius: 4, border: "1px solid #eef0f3" }} elevation={0}>
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: "#111", mb: 3 }}>
            Sécurité
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: 1, mb: 1.5, display: "block" }}>ANCIEN MOT DE PASSE</Typography>
              <TextField fullWidth type="password" value={oldPass} onChange={e=>setOldPass(e.target.value)} placeholder="••••••••" size="small" sx={fieldSx} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: 1, mb: 1.5, display: "block" }}>NOUVEAU MOT DE PASSE</Typography>
              <TextField fullWidth type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="••••••••" size="small" sx={fieldSx} />
            </Box>
          </Stack>
          <Button onClick={updatePassword} variant="outlined" sx={{ mt: 3, borderRadius: 2.5, borderColor: "black", color: "black", textTransform: "none", fontWeight: 700, px: 3, height: 44 }}>
            Changer le mot de passe
          </Button>
        </Paper>
      </Box>
    </UserLayout>
  );
}