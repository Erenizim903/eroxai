import { Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography, alpha } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DescriptionIcon from '@mui/icons-material/Description'
import SettingsIcon from '@mui/icons-material/Settings'
import PeopleIcon from '@mui/icons-material/People'
import ListAltIcon from '@mui/icons-material/ListAlt'
import MenuIcon from '@mui/icons-material/Menu'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const drawerWidth = 260

const navItems = [
  { label: 'Genel Bakış', to: '/admin-panel/overview', icon: <DashboardIcon /> },
  { label: 'Şablonlar', to: '/admin-panel/templates', icon: <DescriptionIcon /> },
  { label: 'Site İçerikleri', to: '/admin-panel/content', icon: <SettingsIcon /> },
  { label: 'Kullanıcılar', to: '/admin-panel/users', icon: <PeopleIcon /> },
  { label: 'Loglar', to: '/admin-panel/logs', icon: <ListAltIcon /> },
]

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const drawerContent = (
    <Box sx={{ height: '100%', background: 'linear-gradient(180deg, #0b0b0f 0%, #151a2b 100%)', color: 'white' }}>
      <Stack spacing={1.5} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={800}>
          EroxAI Studio Admin
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Yönetim Paneli
        </Typography>
      </Stack>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            selected={location.pathname === item.to}
            onClick={() => {
              navigate(item.to)
              setMobileOpen(false)
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              },
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.15)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' } }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0a 0%, #151822 100%)' }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            px: { xs: 2, md: 4 },
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${alpha('#667eea', 0.15)}`,
          }}
        >
          <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' }, color: 'white' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700 }}>
            Yönetim Paneli
          </Typography>
          <Box />
        </Toolbar>
        <Box sx={{ px: { xs: 2, md: 4 }, pb: 6 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout
