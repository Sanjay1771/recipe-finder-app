import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Switch, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';

/**
 * Settings Page
 * 
 * Provides a clean interface for managing user preferences.
 */
function Settings() {
  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 4, 
          border: '1px solid', 
          borderColor: 'grey.100',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your account preferences and application experience.
        </Typography>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {/* Appearance Section */}
          <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ mt: 2, display: 'block' }}>
            Appearance
          </Typography>
          <ListItem sx={{ px: 1 }}>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Dark Mode" 
              secondary="Switch to a dark theme (Coming soon)" 
            />
            <Switch edge="end" disabled />
          </ListItem>
          
          <Divider sx={{ my: 2 }} />

          {/* Notifications Section */}
          <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ mt: 2, display: 'block' }}>
            Notifications
          </Typography>
          <ListItem sx={{ px: 1 }}>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Email Updates" 
              secondary="Receive recipe recommendations and weekly digests" 
            />
            <Switch edge="end" defaultChecked />
          </ListItem>

          <Divider sx={{ my: 2 }} />

          {/* Privacy Section */}
          <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ mt: 2, display: 'block' }}>
            Privacy & Security
          </Typography>
          <ListItem sx={{ px: 1 }}>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Public Profile" 
              secondary="Allow others to see your saved recipe collection" 
            />
            <Switch edge="end" defaultChecked />
          </ListItem>
        </List>

        <Box sx={{ mt: 6, p: 2, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            User Settings Version 1.0.0
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Settings;
