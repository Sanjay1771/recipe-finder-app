import { AppBar, Toolbar, Typography, Container, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun
import UserMenu from './UserMenu';

/**
 * Navbar Component
 */
function Navbar({ user, mode, onToggleTheme }) {
  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(30,30,30,0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        py: 0.5,
        boxShadow: mode === 'light' ? '0 2px 10px rgba(0,0,0,0.02)' : '0 4px 20px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <Box 
            component={RouterLink} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none', 
              color: 'primary.main',
              gap: 1
            }}
          >
            <RestaurantIcon sx={{ fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                fontSize: { xs: '1.1rem', md: '1.4rem' }
              }}
            >
              Recipe<span style={{ color: '#FF6B35' }}>Finder</span>
            </Typography>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Theme Toggle */}
            <IconButton onClick={onToggleTheme} color="inherit" sx={{ mr: 0.5 }}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon color="action" />}
            </IconButton>

            {user ? (
              <UserMenu user={user} />
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                disableElevation
                sx={{ borderRadius: 2, px: 3 }}
              >
                Login
              </Button>
            )}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
