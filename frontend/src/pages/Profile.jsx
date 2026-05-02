import { Container, Paper, Typography, Box, Avatar, Divider, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';

/**
 * Profile Page
 * 
 * Displays user account information in a professional card layout.
 */
function Profile({ user }) {
  // If no user is logged in, this page shouldn't be accessible
  if (!user) return null;

  const username = user.email.split('@')[0];
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

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
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar 
            sx={{ 
              width: { xs: 70, md: 90 }, 
              height: { xs: 70, md: 90 }, 
              bgcolor: 'primary.main', 
              fontSize: '2.5rem',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)'
            }}
          >
            {user.email.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              {username}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              Culinary Enthusiast
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Info Grid */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: 'primary.50', borderRadius: 2, color: 'primary.main' }}>
                <EmailIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Email Address
                </Typography>
                <Typography variant="body1" fontWeight={700}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: 'primary.50', borderRadius: 2, color: 'primary.main' }}>
                <EventIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Joined Since
                </Typography>
                <Typography variant="body1" fontWeight={700}>
                  {joinDate}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, p: 3, bgcolor: 'grey.50', borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Your saved recipes and personal preferences will be displayed here as we continue building the app!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;
