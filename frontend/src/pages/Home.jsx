import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Fade,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Snackbar
} from '@mui/material';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { useNavigate } from 'react-router-dom';
import { searchRecipes } from '../services/api';
import { supabase } from '../services/supabase';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * Home Page
 * 
 * Main landing page where users can search for recipes and view results.
 */
function Home({ user }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipeForPlan, setSelectedRecipeForPlan] = useState(null);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch favorites on load
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('recipe_id')
        .eq('user_id', user.id);

      if (error) throw error;
      if (data) {
        setFavorites(data.map(fav => fav.recipe_id.toString()));
      }
    } catch (err) {
      console.error('Error fetching favorites:', err.message);
    }
  };

  const openPlanDialog = (recipe) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedRecipeForPlan(recipe);
    setIsPlanDialogOpen(true);
  };

  const handleAddToPlan = async (day) => {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .upsert({
          user_id: user.id,
          day: day,
          recipe_id: selectedRecipeForPlan.id.toString(),
          title: selectedRecipeForPlan.title,
          image: selectedRecipeForPlan.image
        });

      if (error) throw error;
      
      setIsPlanDialogOpen(false);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error adding to plan:', err.message);
    }
  };

  const handleFavorite = async (recipe) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const recipeIdStr = recipe.id.toString();
    const isFavorited = favorites.includes(recipeIdStr);

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeIdStr);

        if (error) throw error;
        setFavorites(prev => prev.filter(id => id !== recipeIdStr));
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            recipe_id: recipeIdStr,
            title: recipe.title,
            image: recipe.image
          });

        if (error) throw error;
        setFavorites(prev => [...prev, recipeIdStr]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err.message);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const results = await searchRecipes(query);
      setRecipes(results);
    } catch (err) {
      if (err.response?.status === 402) {
        setError('Daily API quota reached. Please try again tomorrow or use a different API key.');
      } else if (err.response?.status === 401) {
        setError('Invalid API Key. Please check your .env file.');
      } else {
        setError('Something went wrong. Please check your internet connection and API key.');
      }
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <Box>
      {/* ====== HERO SECTION ====== */}
      <Box
        sx={{
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #FF6B35 0%, #FF8F65 50%, #FFA17A 100%)'
            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, #FF6B35 200%)`,
          pt: { xs: 4, md: 6 },
          pb: { xs: 6, md: 8 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.3s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.mode === 'light'
              ? 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)'
              : 'radial-gradient(circle at 20% 50%, rgba(0,0,0,0.2) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 800,
              textAlign: 'center',
              mb: 1.5,
              fontSize: { xs: '2rem', md: '2.8rem' },
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            🍽️ Recipe Finder
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'center',
              mb: 4,
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.15rem' },
            }}
          >
            Discover delicious recipes from around the world
          </Typography>

          <SearchBar onSearch={handleSearch} loading={loading} />
        </Container>
      </Box>

      {/* ====== RESULTS SECTION ====== */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={48} sx={{ color: 'primary.main' }} />
          </Box>
        )}

        {error && (
          <Fade in>
            <Alert severity="error" sx={{ maxWidth: 500, mx: 'auto', borderRadius: 3, mb: 3 }}>
              {error}
            </Alert>
          </Fade>
        )}

        {searched && !loading && !error && recipes.length === 0 && (
          <Fade in>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>🔍</Typography>
              <Typography variant="h6" color="text.secondary">
                No recipes found. Try a different search term!
              </Typography>
            </Box>
          </Fade>
        )}

        {!loading && recipes.length > 0 && (
          <Fade in>
            <Box>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                Search Results
                <Typography component="span" sx={{ ml: 1.5, color: 'text.secondary', fontWeight: 400, fontSize: '1rem' }}>
                  ({recipes.length} recipes found)
                </Typography>
              </Typography>

              <Grid container spacing={4}>
                {recipes.map((recipe) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
                    <RecipeCard
                      recipe={recipe}
                      onClick={handleRecipeClick}
                      onFavorite={handleFavorite}
                      isFavorite={favorites.includes(recipe.id.toString())}
                      onAddToPlan={openPlanDialog}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}

        {!searched && !loading && (
          <Fade in>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>👨‍🍳</Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                Start by searching for your favorite recipe above!
              </Typography>
            </Box>
          </Fade>
        )}
      </Container>

      {/* Day Selection Dialog */}
      <Dialog open={isPlanDialogOpen} onClose={() => setIsPlanDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Add to Meal Plan</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Which day would you like to add <strong>{selectedRecipeForPlan?.title}</strong> to?
          </Typography>
          <List>
            {DAYS.map((day) => (
              <ListItem 
                button 
                key={day} 
                onClick={() => handleAddToPlan(day)}
                sx={{ 
                  borderRadius: 2, 
                  mb: 0.5,
                  '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' }
                }}
              >
                <ListItemText primary={day} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Recipe added to your meal plan!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}

export default Home;
