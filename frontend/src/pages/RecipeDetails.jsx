import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  CircularProgress, 
  Alert, 
  Grid,
  IconButton,
  Tooltip,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import { getRecipeDetails } from '../services/api';
import { supabase } from '../services/supabase';

/**
 * RecipeDetails Page
 * 
 * Displays full information about a specific recipe, including ingredients and instructions.
 * Also allows users to toggle the favorite status.
 */
function RecipeDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getRecipeDetails(id);
        setRecipe(data);
        setError('');
      } catch (err) {
        setError('Could not fetch recipe details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    if (user) checkFavoriteStatus();
  }, [id, user]);

  const checkFavoriteStatus = async () => {
    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', id);

      setIsFavorite(data && data.length > 0);
    } catch (err) {
      console.error('Error checking favorite:', err);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('recipe_id', id);
        setIsFavorite(false);
      } else {
        await supabase.from('favorites').insert({
          user_id: user.id,
          recipe_id: id,
          title: recipe.title,
          image: recipe.image
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!recipe) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 4, fontWeight: 600 }}>
        Back to Results
      </Button>

      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, md: 5 }, 
          borderRadius: 6, 
          border: '1px solid', 
          borderColor: 'divider', 
          backgroundColor: 'background.paper',
          overflow: 'hidden',
          boxShadow: (theme) => theme.palette.mode === 'light' 
            ? '0 4px 20px rgba(0,0,0,0.05)' 
            : '0 10px 40px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        <Grid container spacing={6}>
          {/* Image Column */}
          <Grid item xs={12} md={5}>
            <Box 
              component="img" 
              src={recipe.image} 
              alt={recipe.title} 
              sx={{ 
                width: '100%', 
                borderRadius: 4, 
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
                objectFit: 'cover',
                maxHeight: 400
              }} 
            />
          </Grid>

          {/* Info Column */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, lineHeight: 1.2 }}>
                {recipe.title}
              </Typography>
              <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
                <IconButton onClick={toggleFavorite} sx={{ mt: 1, bgcolor: 'grey.50', '&:hover': { bgcolor: 'grey.100' } }}>
                  {isFavorite ? <FavoriteIcon sx={{ color: '#FF6B35' }} /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Chip icon={<AccessTimeIcon />} label={`${recipe.readyInMinutes} mins`} variant="outlined" />
              <Chip icon={<PeopleIcon />} label={`${recipe.servings} servings`} variant="outlined" />
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h6" fontWeight={700} gutterBottom>Ingredients</Typography>
            <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
              {recipe.extendedIngredients?.map((ing, idx) => (
                <Typography component="li" key={idx} variant="body1" sx={{ mb: 1 }}>
                  {ing.original}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Full Width Instructions */}
          <Grid item xs={12}>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" fontWeight={800} gutterBottom>Instructions</Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.8, 
                color: 'text.secondary',
                '& p': { mb: 2 },
                '& ol, & ul': { pl: 3 }
              }}
              dangerouslySetInnerHTML={{ __html: recipe.instructions || recipe.summary }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default RecipeDetails;
