import { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Button,
  Paper 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import RecipeCard from '../components/RecipeCard';
import FavoriteIcon from '@mui/icons-material/Favorite';

/**
 * Favorites Page
 * 
 * Displays all recipes saved by the authenticated user.
 */
function Favorites({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (favItem) => {
    // Optimistically update UI
    setFavorites(prev => prev.filter(f => f.recipe_id !== favItem.recipe_id));
    
    // Remove from Database
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('recipe_id', favItem.recipe_id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error removing favorite:', err.message);
      // If error, refresh list to stay in sync
      fetchFavorites();
    }
  };

  // If not logged in
  if (!user && !loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Paper elevation={0} sx={{ p: 5, borderRadius: 4, border: '1px solid', borderColor: 'grey.100' }}>
          <FavoriteIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Your recipe collection is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please log in to save your favorite culinary discoveries and access them anytime.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/login')}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Log In to Continue
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          My Favorites
        </Typography>
        <Typography variant="body1" color="text.secondary">
          All the recipes you've saved in one place.
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : favorites.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: 'grey.50', border: '1px dashed', borderColor: 'grey.300' }}>
          <Typography variant="h6" color="text.secondary">
            You haven't saved any recipes yet.
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }} 
            onClick={() => navigate('/')}
          >
            Browse Recipes
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {favorites.map((fav) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={fav.id}>
              <RecipeCard 
                recipe={{ 
                  id: fav.recipe_id, 
                  title: fav.title, 
                  image: fav.image 
                }}
                onClick={(id) => navigate(`/recipe/${id}`)}
                onFavorite={() => handleFavoriteToggle(fav)}
                isFavorite={true}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Favorites;
