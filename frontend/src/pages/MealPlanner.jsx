import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  CircularProgress, 
  Card, 
  CardMedia, 
  CardContent,
  Button,
  Divider,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * MealPlanner Page
 * 
 * Fetches and displays the user's weekly meal plan in a clean grid.
 */
function MealPlanner({ user }) {
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchMealPlans();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMealPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: sbError } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id);

      if (sbError) throw sbError;

      // Map the array into a day-based object for easy access
      const planMap = {};
      data.forEach((item) => {
        planMap[item.day] = item;
      });
      
      setPlans(planMap);
    } catch (err) {
      console.error('Error fetching meal plans:', err.message);
      setError('Could not load your meal plan. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700}>Sign in to view your planner</Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>Weekly Meal Planner</Typography>
        <Typography variant="body1" color="text.secondary">
          Track what you're cooking throughout the week.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {DAYS.map((day) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={day}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  borderRadius: 4, 
                  height: '100%', 
                  border: '1px solid', 
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="subtitle1" fontWeight={800} color="primary" sx={{ mb: 2 }}>
                  {day}
                </Typography>

                {plans[day] ? (
                  <Card 
                    elevation={0} 
                    sx={{ 
                      bgcolor: 'transparent', 
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.8 } 
                    }}
                    onClick={() => navigate(`/recipe/${plans[day].recipe_id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={plans[day].image}
                      alt={plans[day].title}
                      sx={{ borderRadius: 2, mb: 1.5 }}
                    />
                    <Typography variant="body1" fontWeight={700} sx={{ lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {plans[day].title}
                    </Typography>
                  </Card>
                ) : (
                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, border: '2px dashed', borderColor: 'divider', borderRadius: 3 }}>
                    <Typography variant="body2" color="text.disabled">No meal planned</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default MealPlanner;
